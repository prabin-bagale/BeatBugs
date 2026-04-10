'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  DollarSign,
  ShoppingBag,
  Loader2,
  Music2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppStore, type Order } from '@/stores/beatbazaar-store';

export function BuyerDashboard() {
  const { currentUser, selectBeat, showToast } = useAppStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders?buyerId=${currentUser.id}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [currentUser?.id]);

  const totalSpent = orders.reduce((acc, o) => acc + o.amount, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-8 bg-secondary rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 bg-secondary rounded w-24 mb-2" />
                <div className="h-8 bg-secondary rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground mt-1">View your beat purchases and licenses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Card className="bg-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="text-2xl font-bold mt-1">{orders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold mt-1">NPR {totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History */}
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Purchase History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Browse beats and find your next hit!
              </p>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                onClick={() => useAppStore.getState().setView('browse')}
              >
                <Music2 className="w-4 h-4 mr-2" />
                Browse Beats
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-16"></TableHead>
                    <TableHead className="text-muted-foreground">Beat</TableHead>
                    <TableHead className="text-muted-foreground">Producer</TableHead>
                    <TableHead className="text-muted-foreground">License</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-border/30">
                      <TableCell>
                        <img
                          src={order.beat?.coverUrl || ''}
                          alt={order.beat?.title}
                          className="w-10 h-10 rounded-md object-cover cursor-pointer"
                          onClick={() => {
                            if (order.beat) {
                              selectBeat({
                                ...order.beat,
                                bpm: 0,
                                key: '',
                                plays: 0,
                                sales: 0,
                                status: '',
                                exclusiveSold: false,
                                basicPrice: order.beat.basicPrice,
                                premiumPrice: order.beat.premiumPrice,
                                exclusivePrice: order.beat.exclusivePrice,
                                producerId: order.beat.producer?.id || '',
                                tags: '',
                                coverUrl: order.beat.coverUrl,
                                audioPreviewUrl: '',
                                createdAt: '',
                              });
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {order.beat?.title || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.beat?.producer?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.licenseType === 'exclusive'
                              ? 'border-purple-500/30 text-purple-500'
                              : order.licenseType === 'premium'
                              ? 'border-amber-500/30 text-amber-500'
                              : 'border-emerald-500/30 text-emerald-500'
                          }
                        >
                          {order.licenseType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        NPR {order.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-500 hover:text-emerald-400 h-8"
                          onClick={() => showToast('Download started!', 'success')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          <span className="text-xs">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
