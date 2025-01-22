import React from 'react'
import Union from '../img/Union.png'
import Heading from "../img/Header bg.png"

const CardImage = () => {
  return (
    <div className="bg-white ml-8" >
        <section>
            <nav className='grid grid-cols-2 mb-12'>
                <p className='text-blue-500 capitalize font-bold text-xl mt-2 ml-24'>Bunbee</p>
                {/* <a href="#"><img src={Heading} alt="" /></a> */}
                <ul className='grid grid-cols-6  gap-2 mt-2 text-Sepiagray font-semibold'>
                    <li className='col-start-2'>Portfolio</li>
                    <li className=''>About</li>
                    <li className=''>Contact</li>
                </ul>
            </nav>
            <div className='mt-2 ml-1 mb-3'>
                <div style={{ backgroundImage: `url(${Heading})`}} className='h-screen'>
                    <div className='flex flex-col items-center justify-center h-full space-y-6 text-right'>
                        <h1 className='text-4xl font-bold text-gray-800 '>
                            I'm Bunbee.
                        </h1>
                        <h1 className='text-4xl font-bold text-gray-800 '>
                         Glad to see you 
                        </h1>
                        <p>I’m a software developer! I can help you build a product , feature or website Look through
                            some of my work and experience! If you like what you see and have a project you need coded, 
                            don’t hesitate to contact me.
                        </p>
                        <p>LET'S CONNECT</p>
                        <ul>
                            <li>Linkedin</li>
                            <li>Github</li>
                            <li>Twitter</li>
                            <li>Facebook</li>
                        </ul>
                    </div>
                </div>
            </div>
           

        </section>

    </div>
  )
}

export default CardImage