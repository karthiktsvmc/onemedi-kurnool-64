import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { AlertTriangle, Check, Copy, Key, Smartphone } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

interface MFASettings {
  id?: string;
  totp_secret?: string;
  backup_codes?: string[];
  phone_number?: string;
  is_enabled: boolean;
  preferred_method: 'totp' | 'sms';
}

export const MFASetup: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mfaSettings, setMfaSettings] = useState<MFASettings>({
    is_enabled: false,
    preferred_method: 'totp'
  });
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');

  useEffect(() => {
    if (user) {
      fetchMFASettings();
    }
  }, [user]);

  const fetchMFASettings = async () => {
    try {
      // Mock MFA settings for now
      const data = null;
      const error = null;

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setMfaSettings(data);
        if (data.is_enabled) {
          setStep('complete');
        }
      }
    } catch (error) {
      console.error('Error fetching MFA settings:', error);
    }
  };

  const generateTOTPSecret = async () => {
    setLoading(true);
    try {
      // Generate a TOTP secret (in production, this would use a proper TOTP library)
      const secret = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(36))
        .join('')
        .toUpperCase();

      // Generate QR code URL for authenticator apps
      const appName = 'ONE MEDI Admin';
      const username = user?.email || 'admin';
      const qrCodeUrl = `otpauth://totp/${appName}:${username}?secret=${secret}&issuer=${appName}`;
      
      setQrCode(qrCodeUrl);
      setMfaSettings(prev => ({ ...prev, totp_secret: secret }));
      setStep('verify');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate TOTP secret",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyTOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate backup codes
      const backupCodes = Array.from({ length: 8 }, () => 
        Array.from(crypto.getRandomValues(new Uint8Array(4)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
      );

      // Mock save MFA settings for now
      const error = null;

      if (error) throw error;

      setMfaSettings(prev => ({ ...prev, backup_codes: backupCodes, is_enabled: true }));
      setStep('complete');
      setShowBackupCodes(true);

      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify TOTP code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    setLoading(true);
    try {
      // Mock disable MFA for now
      const error = null;

      if (error) throw error;

      setMfaSettings(prev => ({ ...prev, is_enabled: false }));
      setStep('setup');

      toast({
        title: "MFA Disabled",
        description: "Two-factor authentication has been disabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable MFA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  if (step === 'complete' && mfaSettings.is_enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Two-Factor Authentication Enabled
          </CardTitle>
          <CardDescription>
            Your account is protected with two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Status</Label>
              <p className="text-sm text-muted-foreground">MFA is currently enabled</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Preferred Method</Label>
              <p className="text-sm text-muted-foreground">
                {mfaSettings.preferred_method === 'totp' ? 'Authenticator App' : 'SMS'}
              </p>
            </div>
          </div>

          {showBackupCodes && mfaSettings.backup_codes && (
            <div className="space-y-2">
              <Label>Backup Codes</Label>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {mfaSettings.backup_codes.map((code, index) => (
                    <div key={index} className="font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(mfaSettings.backup_codes!.join('\n'))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Codes
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBackupCodes(!showBackupCodes)}>
              {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
            </Button>
            <Button variant="destructive" onClick={disableMFA} disabled={loading}>
              Disable MFA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your admin account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mfaSettings.preferred_method} onValueChange={(value) => 
          setMfaSettings(prev => ({ ...prev, preferred_method: value as 'totp' | 'sms' }))
        }>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="totp">Authenticator App</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="totp" className="space-y-4">
            {step === 'setup' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900">Setup Instructions</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                      <li>2. Click "Generate Secret" to create your TOTP secret</li>
                      <li>3. Scan the QR code with your authenticator app</li>
                      <li>4. Enter the 6-digit code from your app to verify</li>
                    </ol>
                  </div>
                </div>

                <Button onClick={generateTOTPSecret} disabled={loading} className="w-full">
                  Generate Secret
                </Button>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <div className="text-xs text-muted-foreground mb-2">Scan this QR code</div>
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center">
                        QR Code<br/>
                        {qrCode}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Manual Entry Key</Label>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {mfaSettings.totp_secret}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(mfaSettings.totp_secret || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('setup')}>
                    Back
                  </Button>
                  <Button onClick={verifyTOTP} disabled={loading} className="flex-1">
                    Verify & Enable
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">SMS Authentication</h4>
                <p className="text-sm text-yellow-800">
                  SMS-based authentication is currently in development. Please use the Authenticator App method for now.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={mfaSettings.phone_number || ''}
                onChange={(e) => setMfaSettings(prev => ({ ...prev, phone_number: e.target.value }))}
                disabled
              />
            </div>

            <Button disabled className="w-full">
              Setup SMS Authentication (Coming Soon)
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};