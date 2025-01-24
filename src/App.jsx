
import './App.css'
import About from './components/About'
import Contact from './components/Contact'
// import Companies from './components/Companies'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Services from './components/Services'
import Work from './components/Work'

function App() {

  return (
    <div className='bg-[#1b0d40]'>
      <Navbar/>
      <Hero/>
      <About/>
      <Services/>
      <Work/>
      <Contact/>
      {/* <Companies/> */}

    </div>
  )
}

export default App
