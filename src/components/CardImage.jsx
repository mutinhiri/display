import React from 'react'
import Union from '../img/Union.png'
import Heading from "../img/Header bg.png"

const CardImage = () => {
  return (
    <div className="bg-white ml-8" >
        <section>
            <nav className='grid grid-cols-2'>
                <p className='text-blue-500 capitalize font-bold text-xl '>Bunbee</p>
                {/* <a href="#"><img src={Heading} alt="" /></a> */}
                <ul className='grid grid-cols-6 ml-52 gap-2 mt-2'>
                    <li className='col-start-2'>Portfolio</li>
                    <li className=''>About</li>
                    <li className=''>Contact</li>
                </ul>
            </nav>

        </section>

    </div>
  )
}

export default CardImage