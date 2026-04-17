'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Shield,
  Download,
  PartyPopper,
  Banknote,
  Smartphone,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/stores/app-store';

const PAYMENT_METHODS = [
  {
    id: 'esewa',
    name: 'eSewa',
    description: 'Pay with eSewa wallet',
    icon: Smartphone,
    color: 'text-green-500',
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'Pay with Khalti wallet',
    icon: Smartphone,
    color: 'text-purple-500',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Bank transfer or cash',
    icon: Truck,
    color: 'text-amber-500',
  },
];

export function CheckoutView() {
  const { checkoutBeat, checkoutLicense, goBack, currentUser, showToast, setView } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!checkoutBeat) return null;

  const getPrice = () => {
    switch (checkoutLicense) {
      case 'premium': return checkoutBeat.premiumPrice;
      case 'exclusive': return checkoutBeat.exclusivePrice;
      default: return checkoutBeat.basicPrice;
    }
  };

  const getLicenseName = () => {
    switch (checkoutLicense) {
      case 'premium': return 'Premium Lease';
      case 'exclusive': return 'Exclusive License';
      default: return 'Basic Lease';
    }
  };

  const getLicenseColor = () => {
    switch (checkoutLicense) {
      case 'premium': return 'border-amber-500/30 text-amber-500';
      case 'exclusive': return 'border-purple-500/30 text-purple-500';
      default: return 'border-emerald-500/30 text-emerald-500';
    }
  };

  const handlePurchase = async () => {
    if (!currentUser) {
      showToast('Please log in to purchase', 'error');
      useAppStore.getState().openAuth('login');
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: currentUser.id,
          beatId: checkoutBeat.id,
          licenseType: checkoutLicense,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Purchase failed', 'error');
        setProcessing(false);
        return;
      }

      setOrderComplete(true);
      showToast('Purchase successful! 🎉', 'success');
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <PartyPopper className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">Purchase Complete!</h1>
        <p className="text-muted-foreground mb-8">
          Your license for &quot;{checkoutBeat.title}&quot; has been activated.
        </p>

        <Card className="bg-card border-emerald-500/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={checkoutBeat.coverUrl}
                alt={checkoutBeat.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="text-left">
                <h3 className="font-semibold">{checkoutBeat.title}</h3>
                <p className="text-sm text-muted-foreground">{checkoutBeat.producer?.name}</p>
              </div>
            </div>
            <Separator className="bg-border/50 mb-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">License</span>
                <Badge variant="outline" className={getLicenseColor()}>{getLicenseName()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">NPR {getPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-medium capitalize">{paymentMethod === 'cod' ? 'Cash/Bank' : paymentMethod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
            onClick={() => showToast('Download started!', 'success')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Files
          </Button>
          <Button
            variant="outline"
            className="border-border/50"
            onClick={() => {
              setOrderComplete(false);
              setView('home');
            }}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        className="mb-6 text-muted-foreground hover:text-white -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Order Summary */}
        <div className="lg:col-span-3 space-y-6">
          {/* Beat Summary */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold">Beat Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img
                  src={checkoutBeat.coverUrl}
                  alt={checkoutBeat.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{checkoutBeat.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {checkoutBeat.producer?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-border/50 text-xs">
                      {checkoutBeat.genre}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{checkoutBeat.bpm} BPM</span>
                    <span className="text-xs text-muted-foreground">{checkoutBeat.key}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Selection */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold">Selected License</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{getLicenseName()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {checkoutLicense === 'basic' && 'YouTube & TikTok • 1 Year'}
                    {checkoutLicense === 'premium' && 'All Platforms + Spotify • Lifetime'}
                    {checkoutLicense === 'exclusive' && 'Exclusive Ownership • Lifetime + Stems'}
                  </p>
                </div>
                <span className="text-xl font-bold">NPR {getPrice().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Payment Method
              </h2>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const MethodIcon = method.icon;
                  return (
                    <label
                      key={method.id}
                      htmlFor={`pay-${method.id}`}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-emerald-500/50 bg-emerald-500/5'
                          : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={`pay-${method.id}`} />
                      <MethodIcon className={`w-5 h-5 ${method.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </label>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right: Price Summary */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border/50 sticky top-24">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold">Price Breakdown</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Beat Price ({getLicenseName()})</span>
                <span>NPR {getPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-emerald-500">Free</span>
              </div>

              <Separator className="bg-border/50" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>NPR {getPrice().toLocaleString()}</span>
              </div>

              <Button
                size="lg"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 mt-2"
                onClick={handlePurchase}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                By completing this purchase, you agree to the licensing terms.
                Files will be available for download immediately after payment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
