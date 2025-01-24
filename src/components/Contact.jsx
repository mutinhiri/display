import React from 'react'
import { motion } from 'motion/react'
import { useInView } from 'react-intersection-observer'
import { FaPhone,
        FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram
} from 'react-icons/fa'


const Contact = () => {

    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.2
      })
  return (
    <div id='contact'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12'>
            <motion.h2
            ref={ref}
            initial={{opacity: 0, y: -100}}
            animate={inView ? {opacity: 1, y:0  }: {}}
            transition={{ delay:0.3, duration: 0.5}}
             className='text-4xl font-bold text-white '>Lets Discuss Your <span className='text-purple-500'>Project</span></motion.h2>
            <motion.p
               ref={ref}
               initial={{opacity: 0, y: -100}}
               animate={inView ? {opacity: 1, y:0  }: {}}
               transition={{ delay:0.3, duration: 0.5}}
                className='text-slate-400 mt-4'>We’d love to hear about your unique challenges and goals. Whether you’re looking to create a custom software solution, optimize your existing systems, or explore new tech opportunities, we’re here to help</motion.p>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-6'>
                <motion.div
                   ref={ref}
                   initial={{opacity: 0, x: -50}}
                   animate={inView ? {opacity: 1, x:0  }: {}}
                   transition={{ delay:0.2, duration: 0.5}} className='flex items-center space-x-4'>

               
                <div className='bg-purple-500 p-4 rounded-full '>
                    <FaPhone className='text-white w-6 h-6'/>
                </div>
                <div>
                    <p className='text-lg font-medium text-purple-500'>
                        Call me 
                    </p>
                    <p className='text-white'>
                        +263771066268
                    </p>
                </div>
                </motion.div>
                <motion.div
                   ref={ref}
                   initial={{opacity: 0, x: -50}}
                   animate={inView ? {opacity: 1, x:0  }: {}}
                   transition={{ delay:0.4, duration: 0.5}}  className='flex items-center space-x-4'>

               
                    <div className='bg-purple-500 p-4 rounded-full '>
                        <FaEnvelope className='text-white w-6 h-6'/>
                    </div>
                    <div>
                        <p className='text-lg font-medium text-purple-500'>
                            Email me 
                        </p>
                        <p className='text-white'>
                            barnabmutinhiri@gmail.com
                        </p>
                    </div>
                </motion.div>
                <motion.div
                   ref={ref}
                   initial={{opacity: 0, x: -50}}
                   animate={inView ? {opacity: 1, x:0  }: {}}
                   transition={{ delay:0.6, duration: 0.5}}  className='flex items-center space-x-4'>

               
                <div className='bg-purple-500 p-4 rounded-full '>
                    <FaMapMarkerAlt className='text-white w-6 h-6'/>
                </div>
                <div>
                    <p className='text-lg font-medium text-purple-500'>
                        Address
                    </p>
                    <p className='text-white'>
                       1809 George Silundika Harare Zimbabwe
                    </p>
                </div>
                </motion.div>
            </div>
            <motion.form
               ref={ref}
               initial={{opacity: 0, x: -50}}
               animate={inView ? {opacity: 1, x:0  }: {}}
               transition={{ delay:0.8, duration: 0.5}} 
               className='space-y-4 text-white '>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input type="text" placeholder='Full Name' className='border border-purple-500 bg:gray-900 p-4 rounded-md w-full' />
                    <input type="email" placeholder='Your email' className='border border-purple-500 bg:gray-900 p-4 rounded-md w-full'/>

                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input type="text" placeholder='Phone Number' className='border border-purple-500 bg:gray-900 p-4 rounded-md w-full' />
                    <input type="email" placeholder='Budget' className='border border-purple-500 bg:gray-900 p-4 rounded-md w-full'/>

                </div>
                <textarea name="say" placeholder='Message' id="" className='border border-purple-500 bg:gray-900 p-4 rounded-md w-full'></textarea>
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{scale: 0.95 }}
                 type='submit'className='bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition duration-200'>Submit Message</motion.button>
            </motion.form>
        </div>
        {/* footer */}
        <motion.div className='mt-48 flex justify-between items-center p-5 text-white border-t-2 border-purple-500'>
            <p>
                2025. All rights reserved
            </p>
            <p>
               FlexiLogic Africa
            </p>
            <div className='flex justify-center space-x-4 text-white mt-4 '>
                <a href="" className='hover:text-purple-500'><FaFacebook className='w-6 h-6'/></a>
                <a href="" className='hover:text-purple-500'><FaTwitter className='w-6 h-6'/></a>
                <a href="" className='hover:text-purple-500'><FaLinkedin className='w-6 h-6'/></a>
                <a href="" className='hover:text-purple-500'><FaInstagram className='w-6 h-6'/></a>
            </div>
        </motion.div>
    </div>
  )
}

export default Contact