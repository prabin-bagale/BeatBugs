'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/stores/app-store';

export function Navigation() {
  const {
    currentUser,
    setView,
    openAuth,
    logout,
    setSearchQuery,
    searchQuery,
  } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setView('browse');
  };

  const navLinks = [
    { label: 'Browse', view: 'browse' as const },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => setView('home')}
          >
            <img src="/beatbugs-logo.png" alt="BeatBugs" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-bold hidden sm:block">
              Beat<span className="text-emerald-500">Bugs</span>
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search beats, genres, producers..."
                className="pl-10 bg-secondary border-border/50 focus:border-emerald-500/50 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.view}
                variant="ghost"
                size="sm"
                onClick={() => setView(link.view)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                {link.label}
              </Button>
            ))}

            {currentUser?.role === 'producer' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('producer-dashboard')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
              </Button>
            )}

            {currentUser?.role === 'buyer' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('buyer-dashboard')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                My Purchases
              </Button>
            )}
          </nav>

          {/* Auth / User */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-xs font-bold">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <Badge variant="outline" className="mt-1.5 text-[10px] border-emerald-500/30 text-emerald-500">
                      {currentUser.role === 'producer' ? 'Producer' : 'Buyer'}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  {currentUser.role === 'producer' && (
                    <DropdownMenuItem onClick={() => setView('producer-dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  {currentUser.role === 'buyer' && (
                    <DropdownMenuItem onClick={() => setView('buyer-dashboard')}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      My Purchases
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuth('login')}
                  className="text-sm"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuth('signup')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card border-border/50 p-0">
                <SheetHeader className="px-4 pt-6 pb-4 border-b border-border/50">
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/beatbugs-logo.png" alt="BeatBugs" className="w-7 h-7 rounded-lg object-cover" />
                    Beat<span className="text-emerald-500">Bugs</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile search */}
                <form onSubmit={handleSearch} className="px-4 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search beats..."
                      className="pl-10 bg-secondary border-border/50 h-9 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <nav className="flex flex-col p-4 gap-1">
                  <Button
                    variant="ghost"
                    className="justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => { setView('browse'); setMobileOpen(false); }}
                  >
                    Browse Beats
                  </Button>

                  {currentUser?.role === 'producer' && (
                    <Button
                      variant="ghost"
                      className="justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => { setView('producer-dashboard'); setMobileOpen(false); }}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  )}

                  {currentUser?.role === 'buyer' && (
                    <Button
                      variant="ghost"
                      className="justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => { setView('buyer-dashboard'); setMobileOpen(false); }}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      My Purchases
                    </Button>
                  )}

                  {currentUser ? (
                    <>
                      <div className="border-t border-border/50 mt-2 pt-4">
                        <div className="flex items-center gap-3 mb-3 px-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.avatar} />
                            <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-xs">
                              {currentUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{currentUser.name}</p>
                            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start text-destructive hover:text-destructive"
                        onClick={() => { logout(); setMobileOpen(false); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-border/50 mt-2 pt-4 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => { openAuth('login'); setMobileOpen(false); }}
                        >
                          Log In
                        </Button>
                        <Button
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                          onClick={() => { openAuth('signup'); setMobileOpen(false); }}
                        >
                          Sign Up Free
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
