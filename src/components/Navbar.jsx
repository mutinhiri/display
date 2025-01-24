import React, { useState } from 'react'
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdCloseFullscreen } from "react-icons/md";
import { motion } from 'motion/react'
import { clipPath } from 'motion/react-client';
import { PiClosedCaptioningDuotone } from 'react-icons/pi';
import { Link } from 'react-scroll';
import { tr } from 'motion/react-m';



function Navbar() {


    const variants = {
        open: {clipPath: "circle(1200px at 43px 43px)"},
        transition: {
            type: "spring"
        },
        closed: {
            clipPath: "circle(25px at 43px 37px)",
            transition: {
                type: 'spring',
                duration: 1,
            }
        }
    }
    const [menu, setMenu] = useState(false)
    const items = [
        {id: 1, text: 'About', to: "about"},
        {id: 2, text: 'Services', to: 'services'},
        {id: 3, text: 'Work', to: "work"},
        {id: 4, text: 'Contact', to: 'contact'}
    ]
  return (
    <div>
        <motion.div
        initial={{opacity: 0, y: -100}} 
        animate={{opacity:1, y: 0 }}
        duration={{duration: 0.9}}
        className="container mx-auto hidden md:flex justify-between items-center py-6">
            <div className="text-xl lg:text-2xl font-bold flex items-center gap-1">
                <span className='text-white'>FlexiLogic</span>
                <span className='text-purple-500'>Africa</span>
            </div>
            <div className="abot">
                <ul className='hidden md:flex items-center space-x-6 list-none lg:text-lg md:text-base text-white'>
                    { items.map(({id, text, to }) => (
                        <li key={id}><Link
                        to={to}
                        smooth={true}
                        duration={500}
                        offset={-70}
                        >{text}</Link></li>
                    ))}
                </ul>
            </div>
            <a className='md:text-base lg:text-lg bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded-full'>Download CV</a>
        </motion.div>
        <div className='flex md:hidden justify-between'>
            <motion.div animate={menu ? "open" : 'closed'}>
                <motion.div 
                variants={variants}
                onClick={() => setMenu((prev) => !prev )}
                className='bg-white 2-2/3 h-screen text-black fixed x-10'>
                    <div className='px-7 py-6'>
                        {
                            menu ? (<HiOutlineMenuAlt3 size={30}/>) : <MdCloseFullscreen size={30}/>
                        }
                    {/* <HiOutlineMenuAlt3 />
                    <MdCloseFullscreen /> */}
                    </div>
                    { menu && (
                        <div className='flex flex-col justify-center items-center'>
                            <ul className='space-y-6 text-black text-lg'>
                            { items.map(({id, text, to}) => (
                                <li 
                                key={id}
                                className='hover:text-purple-500 duration-200 cursor-pointer'
                                ><Link
                                to={to}
                                smooth={true}
                                duration={500}
                                offset={-70}
                                >{text}</Link></li>
                                  ))}
                    
 
                            </ul>
                            <a href="" className="text-lg bg-purple-500 hover:bg-purple-400 text-white py-2 mt-6 rounded-full">Download Cv</a>
                        </div>
                    )}
                </motion.div>
            </motion.div>
            <motion.div 
            initial={{opacity: 0, x:100, y: -100}}
            animate={{opacity: 1, x:0, y:0}}
            transition={{duration: 0.9}}
            className="text-xl font-bold flex items-center gap-2 py-6 px-4">
                <span className='text-white'>FlexiLogic</span>
                <span className='text-purple-500'>Africa</span>
            </motion.div>
        </div>
        
    </div>
  )
}

export default Navbar