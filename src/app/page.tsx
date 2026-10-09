import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import DeckShowcase from "@/components/sections/DeckShowcase";
import Toolkit from "@/components/sections/Toolkit";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
 import PostShowcase from "../components/sections/PostShowcase";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <DeckShowcase />
       <PostShowcase />
      <Toolkit />
      <Process />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}