'use client';
import AboutUs from './components/AboutUs';
import BottomPage from './components/BottomPage';
import Features from './components/Features';
import FeaturesPic from './components/FeaturesPic';
import GetStarted from './components/GetStarted';
import Highlight from './components/Highlight';
import Navbar from './components/LandingNavbar';
import NavigateBusiness from './components/NavigateBusiness';
import Pricing from './components/Pricing';
import './page.css'
import Benefits from './components/Benefits';
import Showcase from './components/Showcase';
 
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