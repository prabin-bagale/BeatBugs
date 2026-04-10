'use client';

import { AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/beatbazaar/navigation';
import { HomeView } from '@/components/beatbazaar/home-view';
import { BrowseView } from '@/components/beatbazaar/browse-view';
import { BeatDetailView } from '@/components/beatbazaar/beat-detail-view';
import { ProducerView } from '@/components/beatbazaar/producer-view';
import { ProducerDashboard } from '@/components/beatbazaar/producer-dashboard';
import { BuyerDashboard } from '@/components/beatbazaar/buyer-dashboard';
import { CheckoutView } from '@/components/beatbazaar/checkout-view';
import { AuthView } from '@/components/beatbazaar/auth-view';
import { AudioPlayerBar } from '@/components/beatbazaar/audio-player-bar';
import { Footer } from '@/components/beatbazaar/footer';
import { useAppStore } from '@/stores/beatbazaar-store';

export default function Home() {
  const { currentView, currentlyPlaying } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />

      <main className={`flex-1 ${currentlyPlaying ? 'pb-24' : ''}`}>
        <AnimatePresence mode="wait">
          {currentView === 'home' && <HomeView key="home" />}
          {currentView === 'browse' && <BrowseView key="browse" />}
          {currentView === 'beat-detail' && <BeatDetailView key="beat-detail" />}
          {currentView === 'producer' && <ProducerView key="producer" />}
          {currentView === 'producer-dashboard' && <ProducerDashboard key="producer-dashboard" />}
          {currentView === 'buyer-dashboard' && <BuyerDashboard key="buyer-dashboard" />}
          {currentView === 'checkout' && <CheckoutView key="checkout" />}
        </AnimatePresence>
      </main>

      <Footer />
      <AudioPlayerBar key={currentlyPlaying?.id || 'none'} />
      <AuthView />
    </div>
  );
}
