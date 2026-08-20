import React from 'react';
import { Navbar }           from '../components/layout/Navbar';
import { Footer }           from '../components/layout/Footer';
import { Hero }             from '../components/sections/Hero';
import { Problem }          from '../components/sections/Problem';
import { HowItWorks }       from '../components/sections/HowItWorks';
import { SchemeCategories } from '../components/sections/SchemeCategories';
import Demo                 from './Demo';

/**
 * Home — the main landing page.
 * Assembles all sections in the correct order:
 * Hero → Problem → HowItWorks → SchemeCategories → Demo
 *
 * SEO: <title> and <meta description> are set in index.html.
 * Heading hierarchy: one h1 in Hero, h2 in each section, h3 in cards.
 */
const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <HowItWorks />
        <SchemeCategories />
        <Demo />
      </main>
      <Footer />
    </>
  );
};

export default Home;
