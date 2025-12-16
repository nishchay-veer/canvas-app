import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <Header />
      <Hero />
      <Features />
      <UseCases />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
