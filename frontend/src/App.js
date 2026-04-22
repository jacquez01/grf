import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import TopBar from "./components/site/TopBar";
import Header from "./components/site/Header";
import Hero from "./components/site/Hero";
import StatsBand from "./components/site/StatsBand";
import WelcomeNotes from "./components/site/WelcomeNotes";
import WhatWeDo from "./components/site/WhatWeDo";
import FeaturedPrograms from "./components/site/FeaturedPrograms";
import ExecutiveBoard from "./components/site/ExecutiveBoard";
import WhereWeWork from "./components/site/WhereWeWork";
import Partners from "./components/site/Partners";
import ProposalSection from "./components/site/ProposalSection";
import Campaigns from "./components/site/Campaigns";
import Contact from "./components/site/Contact";
import Footer from "./components/site/Footer";

const Home = () => {
  return (
    <div className="bg-white">
      <TopBar />
      <Header />
      <Hero />
      <StatsBand />
      <WelcomeNotes />
      <WhatWeDo />
      <FeaturedPrograms />
      <ExecutiveBoard />
      <WhereWeWork />
      <Campaigns />
      <Partners />
      <ProposalSection />
      <Contact />
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
