import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Courses from './components/Courses';
import Experience from './components/Experience';
import Extra from './components/Extra';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navbar />
      
      <main className="container mx-auto px-6 max-w-6xl pt-24">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Courses />
        <Extra />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
