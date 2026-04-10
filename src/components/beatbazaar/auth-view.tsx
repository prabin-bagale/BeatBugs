'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Loader2, Mail, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppStore } from '@/stores/beatbazaar-store';

export function AuthView() {
  const {
    isAuthOpen,
    authMode,
    closeAuth,
    openAuth,
    login,
    showToast,
  } = useAppStore();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<'producer' | 'buyer'>('buyer');
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, action: 'login' }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Login failed', 'error');
        return;
      }

      login(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      setLoginEmail('');
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) return;

    setSignupLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          name: signupName,
          role: signupRole,
          action: 'signup',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Signup failed', 'error');
        return;
      }

      login(data.user);
      showToast(`Welcome to BeatBazaar, ${data.user.name}!`, 'success');
      setSignupName('');
      setSignupEmail('');
      setSignupRole('buyer');
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={isAuthOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center justify-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue={authMode}
            onValueChange={(v) => openAuth(v as 'login' | 'signup')}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 bg-transparent border-b border-border/50 rounded-none p-0 h-auto">
              <TabsTrigger
                value="login"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-2 text-sm font-medium"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-2 text-sm font-medium"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="px-6 pb-6 pt-4 mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Welcome Back</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your email to continue
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-secondary border-border/50 focus:border-emerald-500/50"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold h-11"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Log In
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo: Use any seeded email (e.g. &quot;producer@example.com&quot;)
                </p>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="px-6 pb-6 pt-4 mt-0">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Create Account</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Join Nepal&apos;s beat marketplace
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      placeholder="Your name"
                      className="pl-10 bg-secondary border-border/50 focus:border-emerald-500/50"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-secondary border-border/50 focus:border-emerald-500/50"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">I am a...</Label>
                  <RadioGroup
                    value={signupRole}
                    onValueChange={(v) => setSignupRole(v as 'producer' | 'buyer')}
                    className="grid grid-cols-2 gap-3"
                  >
                    <label
                      htmlFor="role-producer"
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        signupRole === 'producer'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                          : 'border-border/50 bg-secondary text-muted-foreground hover:border-border'
                      }`}
                    >
                      <RadioGroupItem value="producer" id="role-producer" className="sr-only" />
                      <Music className="w-4 h-4" />
                      <span className="text-sm font-medium">Producer</span>
                    </label>
                    <label
                      htmlFor="role-buyer"
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        signupRole === 'buyer'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                          : 'border-border/50 bg-secondary text-muted-foreground hover:border-border'
                      }`}
                    >
                      <RadioGroupItem value="buyer" id="role-buyer" className="sr-only" />
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Buyer</span>
                    </label>
                  </RadioGroup>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold h-11"
                  disabled={signupLoading}
                >
                  {signupLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
