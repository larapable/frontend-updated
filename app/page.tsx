'use client';
import AboutUs from './components/LandingPage/AboutUs';
import BottomPage from './components/LandingPage/BottomPage';
import Features from './components/LandingPage/Features';
import FeaturesPic from './components/LandingPage/FeaturesPic';
import GetStarted from './components/LandingPage/GetStarted';
import Highlight from './components/LandingPage/Highlight';
import Navbar from './components/LandingPage/LandingNavbar';
import NavigateBusiness from './components/LandingPage/NavigateBusiness';
import Pricing from './components/LandingPage/Pricing';
import './page.css'
import Benefits from './components/LandingPage/Benefits';
import Showcase from './components/LandingPage/Showcase';
 
export default function Home() {
 
 
  return (
    <div style={{backgroundColor: '#FFFFFF'}}>
      <Navbar/>
      <NavigateBusiness />
      <Highlight />
      <AboutUs />
      <FeaturesPic />
      <Benefits/>
      <Showcase/>
      <Pricing />
      <BottomPage />
    </div>
  )
}