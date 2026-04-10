'use client';

import { Music, Github, Twitter, Instagram } from 'lucide-react';
import { useAppStore } from '@/stores/beatbazaar-store';

export function Footer() {
  const { setView } = useAppStore();

  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div
              className="flex items-center gap-2 cursor-pointer mb-4"
              onClick={() => setView('home')}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold">
                Beat<span className="text-emerald-500">Bazaar</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Built for Nepal&apos;s music creators. Buy and sell beats with local payments, 
              instant delivery, and legal licensing.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setView('browse')}
                  className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
                >
                  Browse Beats
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  Licensing Agreement
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BeatBazaar. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Built with{' '}
            <span className="text-emerald-500">&hearts;</span>
            {' '}for Nepal&apos;s Music Creators
          </p>
        </div>
      </div>
    </footer>
  );
}
