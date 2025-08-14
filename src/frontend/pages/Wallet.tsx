import { useState } from 'react';
import { Wallet as WalletIcon, Plus, History, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockWalletTransactions, mockOffers, walletBalance } from '@/frontend/data/mockProfileData';

export const Wallet = () => {
  const [transactions] = useState(mockWalletTransactions);
  const [offers] = useState(mockOffers);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="p-6 text-center">
              <WalletIcon className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-2">₹{walletBalance}</h2>
              <p className="opacity-90 mb-4">Available Balance</p>
              <Button variant="secondary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Money
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Refer & Earn</h3>
                <p className="text-sm text-muted-foreground">Get ₹100 per referral</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <History className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Transactions</h3>
                <p className="text-sm text-muted-foreground">{transactions.length} transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Available Offers */}
          <Card>
            <CardHeader>
              <CardTitle>Available Offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{offer.title}</h4>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                    <Badge variant="secondary" className="mt-1">
                      Code: {offer.code}
                    </Badge>
                  </div>
                  <Button size="sm">Copy</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`font-bold ${
                    transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'Credit' ? '+' : '-'}₹{transaction.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};