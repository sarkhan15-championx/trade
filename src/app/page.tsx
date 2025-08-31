import Hero from '@/components/Hero';
import ValueProps from '@/components/ValueProps';
import HowItWorks from '@/components/HowItWorks';
import LiveTicker from '@/components/LiveTicker';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ValueProps />
      <HowItWorks />
      <LiveTicker />
      <FAQ />
      <Footer />
    </main>
  );
}
