import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  order_id: string;
  amount: number;
  currency: string;
  gateway: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
  };
  order_details: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { order_id, amount, currency, gateway, customer_details, order_details } = await req.json() as PaymentRequest;

    // Get gateway configuration
    const { data: gatewayConfig, error: gatewayError } = await supabase
      .from('payment_gateways')
      .select('*')
      .eq('gateway_key', gateway)
      .eq('is_active', true)
      .single();

    if (gatewayError || !gatewayConfig) {
      throw new Error('Payment gateway not found or inactive');
    }

    console.log(`Processing payment for ${gateway} - Order: ${order_id}, Amount: ${amount}`);

    let paymentResponse;

    switch (gateway) {
      case 'razorpay':
        paymentResponse = await processRazorpayPayment(gatewayConfig, {
          order_id,
          amount,
          currency,
          customer_details,
          order_details
        });
        break;
        
      case 'phonepe':
        paymentResponse = await processPhonePePayment(gatewayConfig, {
          order_id,
          amount,
          currency,
          customer_details,
          order_details
        });
        break;
        
      case 'paytm':
        paymentResponse = await processPaytmPayment(gatewayConfig, {
          order_id,
          amount,
          currency,
          customer_details,
          order_details
        });
        break;
        
      default:
        throw new Error('Unsupported payment gateway');
    }

    // Record payment initiation in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id,
        amount,
        currency,
        gateway_name: gateway,
        gateway_transaction_id: paymentResponse.transaction_id,
        gateway_response: paymentResponse.gateway_response,
        status: 'pending'
      });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
    }

    return new Response(JSON.stringify(paymentResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment processing failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processRazorpayPayment(config: any, paymentData: any) {
  const { key_id, key_secret } = config.config;
  
  if (!key_id || !key_secret) {
    throw new Error('Razorpay configuration incomplete');
  }

  // Create Razorpay order
  const razorpayOrder = {
    amount: paymentData.amount * 100, // Convert to paise
    currency: paymentData.currency,
    receipt: paymentData.order_id,
    notes: {
      order_id: paymentData.order_id,
      customer_name: paymentData.customer_details.name
    }
  };

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${key_id}:${key_secret}`)}`
    },
    body: JSON.stringify(razorpayOrder)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Razorpay API error: ${error}`);
  }

  const order = await response.json();

  return {
    success: true,
    payment_url: null, // Razorpay uses client-side checkout
    transaction_id: order.id,
    gateway_response: order,
    razorpay_order_id: order.id,
    razorpay_key_id: key_id
  };
}

async function processPhonePePayment(config: any, paymentData: any) {
  const { merchant_id, salt_key, salt_index } = config.config;
  
  if (!merchant_id || !salt_key) {
    throw new Error('PhonePe configuration incomplete');
  }

  const transactionId = `TXN_${paymentData.order_id}_${Date.now()}`;
  
  const paymentPayload = {
    merchantId: merchant_id,
    merchantTransactionId: transactionId,
    merchantUserId: `USER_${paymentData.customer_details.phone}`,
    amount: paymentData.amount * 100, // Convert to paise
    redirectUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-callback`,
    redirectMode: "REDIRECT",
    callbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`,
    mobileNumber: paymentData.customer_details.phone,
    paymentInstrument: {
      type: "PAY_PAGE"
    }
  };

  const base64Payload = btoa(JSON.stringify(paymentPayload));
  const string = base64Payload + "/pg/v1/pay" + salt_key;
  const sha256 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(string));
  const checksum = Array.from(new Uint8Array(sha256))
    .map(b => b.toString(16).padStart(2, '0')).join('') + "###" + salt_index;

  const response = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum
    },
    body: JSON.stringify({ request: base64Payload })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PhonePe API error: ${error}`);
  }

  const result = await response.json();

  return {
    success: true,
    payment_url: result.data?.instrumentResponse?.redirectInfo?.url,
    transaction_id: transactionId,
    gateway_response: result
  };
}

async function processPaytmPayment(config: any, paymentData: any) {
  const { merchant_id, merchant_key, website } = config.config;
  
  if (!merchant_id || !merchant_key) {
    throw new Error('Paytm configuration incomplete');
  }

  const orderId = `ORDER_${paymentData.order_id}_${Date.now()}`;
  
  // Paytm requires a different approach - this is a simplified version
  // In production, you'd need to implement Paytm's checksum generation
  
  const paytmParams = {
    MID: merchant_id,
    WEBSITE: website || 'WEBSTAGING',
    ORDER_ID: orderId,
    CUST_ID: paymentData.customer_details.phone,
    TXN_AMOUNT: paymentData.amount.toString(),
    CURRENCY: paymentData.currency,
    INDUSTRY_TYPE_ID: 'Retail',
    CHANNEL_ID: 'WEB',
    CALLBACK_URL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-callback`
  };

  // This is a simplified implementation
  // In production, you need proper checksum generation
  
  return {
    success: true,
    payment_url: `https://securegw-stage.paytm.in/theia/processTransaction?ORDER_ID=${orderId}`,
    transaction_id: orderId,
    gateway_response: paytmParams
  };
}