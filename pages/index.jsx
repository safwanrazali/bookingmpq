import MainLayout from '@/layouts/MainLayout';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import AvailableSlots from '@/components/home/AvailableSlots';
import Features from '@/components/home/Features';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <HowItWorks />
      <AvailableSlots />
      <Features />
      <FAQ />
      <Contact />
    </main>
  );
}

HomePage.getLayout = (page) => <MainLayout>{page}</MainLayout>;
