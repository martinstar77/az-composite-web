import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import Stats from "@/components/Stats/Stats";
import Solution from "@/components/Solution/Solution";
import Innovation from "@/components/Innovation/Innovation";
import Portfolio from "@/components/Portfolio/Portfolio";
import HowWeWork from "@/components/HowWeWork/HowWeWork";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Solution />
        <Innovation />
        <Portfolio />
        <HowWeWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
