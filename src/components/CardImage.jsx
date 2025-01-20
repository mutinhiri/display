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
                <ul className='grid grid-cols-3 ml-52'>
                    <li>Portfolio</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </nav>

        </section>

    </div>
  )
}

export default CardImage