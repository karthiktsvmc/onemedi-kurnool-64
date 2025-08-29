import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  User,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Edit
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FulfillmentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  pincode: string;
  status: string;
  priority: string;
  estimated_delivery: string;
  assigned_agent?: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface FulfillmentAgent {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  current_orders: number;
  max_orders: number;
  status: 'active' | 'busy' | 'offline';
}

interface FulfillmentWorkflowProps {
  orders: any[];
  onOrderUpdate: (orderId: string, updates: any) => void;
}

export const FulfillmentWorkflow: React.FC<FulfillmentWorkflowProps> = ({ 
  orders, 
  onOrderUpdate 
}) => {
  const [fulfillmentOrders, setFulfillmentOrders] = useState<FulfillmentOrder[]>([]);
  const [agents, setAgents] = useState<FulfillmentAgent[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<FulfillmentOrder | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for fulfillment agents
  const mockAgents: FulfillmentAgent[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      vehicle_type: 'Bike',
      current_orders: 3,
      max_orders: 8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91 9876543211',
      vehicle_type: 'Car',
      current_orders: 2,
      max_orders: 6,
      status: 'active'
    },
    {
      id: '3',
      name: 'Amit Singh',
      phone: '+91 9876543212',
      vehicle_type: 'Bike',
      current_orders: 5,
      max_orders: 8,
      status: 'busy'
    }
  ];

  useEffect(() => {
    setAgents(mockAgents);
    // Transform orders for fulfillment view
    const fulfillmentData = orders
      .filter(order => ['confirmed', 'processing', 'shipped'].includes(order.status))
      .map(order => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name || 'Unknown',
        customer_phone: '+91 9876543210', // Mock data
        delivery_address: 'Mock Address, Kurnool', // Mock data
        city: 'Kurnool',
        pincode: '518001',
        status: order.status,
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        assigned_agent: Math.random() > 0.5 ? mockAgents[Math.floor(Math.random() * mockAgents.length)].name : undefined,
        tracking_number: Math.random() > 0.5 ? `TRK${Math.floor(Math.random() * 1000000)}` : undefined,
        notes: '',
        created_at: order.created_at,
        updated_at: order.created_at
      }));
    setFulfillmentOrders(fulfillmentData);
  }, [orders]);

  const handleAssignAgent = async (orderId: string, agentId: string) => {
    setLoading(true);
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) throw new Error('Agent not found');

      await onOrderUpdate(orderId, {
        status: 'processing',
        assigned_agent: agent.name
      });

      setFulfillmentOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, assigned_agent: agent.name, status: 'processing' }
            : order
        )
      );

      toast({
        title: "Agent Assigned",
        description: `Order assigned to ${agent.name}`,
      });
      setAssignDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async (orderId: string, trackingNumber: string, notes: string) => {
    setLoading(true);
    try {
      await onOrderUpdate(orderId, {
        status: 'shipped',
        tracking_number: trackingNumber,
        notes: notes
      });

      setFulfillmentOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, tracking_number: trackingNumber, notes: notes, status: 'shipped' }
            : order
        )
      );

      toast({
        title: "Tracking Updated",
        description: "Order tracking information has been updated",
      });
      setTrackingDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tracking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Fulfillment Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready to Ship</p>
                <p className="text-xl font-bold">
                  {fulfillmentOrders.filter(o => o.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-xl font-bold">
                  {fulfillmentOrders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-xl font-bold">
                  {agents.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fulfillment Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{agent.name}</h4>
                    <Badge className={getAgentStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {agent.phone}
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      {agent.vehicle_type}
                    </div>
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      {agent.current_orders}/{agent.max_orders} orders
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fulfillment Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fulfillment Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfillmentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders in fulfillment queue
                    </TableCell>
                  </TableRow>
                ) : (
                  fulfillmentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{order.delivery_address}</div>
                          <div className="text-muted-foreground">{order.city}, {order.pincode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.assigned_agent ? (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {order.assigned_agent}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.tracking_number ? (
                          <div className="text-sm font-mono">{order.tracking_number}</div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!order.assigned_agent && (
                            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <User className="h-3 w-3 mr-1" />
                                  Assign
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Delivery Agent</DialogTitle>
                                  <DialogDescription>
                                    Select an agent to assign order {selectedOrder?.order_number}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {agents.filter(a => a.status === 'active' && a.current_orders < a.max_orders).map((agent) => (
                                    <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <div className="font-medium">{agent.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {agent.vehicle_type} • {agent.current_orders}/{agent.max_orders} orders
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => selectedOrder && handleAssignAgent(selectedOrder.id, agent.id)}
                                        disabled={loading}
                                      >
                                        Assign
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {order.status === 'processing' && (
                            <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Truck className="h-3 w-3 mr-1" />
                                  Ship
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Ship Order</DialogTitle>
                                  <DialogDescription>
                                    Add tracking information for order {selectedOrder?.order_number}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="tracking">Tracking Number</Label>
                                    <Input
                                      id="tracking"
                                      placeholder="Enter tracking number"
                                      defaultValue={selectedOrder?.tracking_number}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Delivery Notes</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="Enter any delivery notes..."
                                      defaultValue={selectedOrder?.notes}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      const trackingInput = document.getElementById('tracking') as HTMLInputElement;
                                      const notesInput = document.getElementById('notes') as HTMLTextAreaElement;
                                      if (selectedOrder) {
                                        handleUpdateTracking(selectedOrder.id, trackingInput.value, notesInput.value);
                                      }
                                    }}
                                    disabled={loading}
                                  >
                                    Ship Order
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};