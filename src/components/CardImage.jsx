import React from 'react'
import Union from '../img/Union.png'

const CardImage = () => {
  return (
    <div className="bg-white bg-[url('../img/Union.png')]">
        <section>
            <nav>
                <p>Bunbee</p>
                <a href="#"><img src={Union} alt="" /></a>
                <ul>
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