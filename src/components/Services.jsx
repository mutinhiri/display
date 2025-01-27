import React from 'react'
import { FaAppStore } from 'react-icons/fa'
import {motion} from "motion/react"
import { useInView } from 'react-intersection-observer'
// import { FaAppStore } from 'react-icons/fa'

const Services = () => {

  const serviceData = [
    {
      title: "Custom Software Development",
      description: "I design and build tailored, scalable software solutions to meet unique business needs, providing end-to-end support from concept to maintenance."
    },

    {
      title: "Web and Mobile App Development",
      description: "I develop responsive web and mobile applications using modern frameworks, delivering optimized, user-friendly experiences across devices."
    },

    {
      title: "API Development and Integration",
      description: "I create secure, scalable APIs and integrate third-party services like payment gateways and analytics tools to streamline operations."
    },

    {
      title: "Software Architecture and System Design",
      description: "I design efficient, scalable architectures, ensuring systems are secure, maintainable, and optimized for long-term growth."
    },
    {
      title: "DevOps and Cloud Solutions",
      description: "I implement CI/CD pipelines, manage cloud deployments, and optimize infrastructure with tools like Docker, Kubernetes, and AWS."
    },
    {
      title: " Technical Consulting and Code Review",
      description: "I provide expert advice, conduct code reviews, and recommend best practices to enhance software quality and team productivity."
    },
  ];

  const {ref, inView} = useInView({
    triggerOnce: true,
    threshold: 0.2
  })

  return (
    <div className='text-white py16' id='services'>
        <motion.div
         ref={ref}
         initial={{opacity: 0, y:50}}
         animate={inView ? {opacity: 1, y:0 } : {}}
         transition={{duration: 0.5}}
          className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold underline mb-8'>Services</h2>
          <p className='mb-12 text-gray-400'>I offer a range of services designed to help businesses build scalable, efficient, and innovative software solutions. Here’s how I can support your goals.</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {
              serviceData.map((service, index) =>(
                <motion.div
                  ref={ref}
                  initial={{opacity: 0, scale: 0.8}}
                  animate={inView ? {opacity: 1, scale:1 } : {opacity: 0, scale: 0.8}}
                  transition={{duration: 0.5, delay: index * 0.2}}
                  key={index}
                  className='bg-[#1c1a2b] rounded-lg p-6 text-center hover:shadow-lg hover:shadow-purple-500 transition-shadow duration-300'>
                    <FaAppStore className='text-purple-500 text-4xl sm:text-5xl lg:text-6xl mb-4 mx-auto'/>
                    <h3 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-2'>{service.title}</h3>
                    <p className='text-sm sm:text-base lg:text-lg text-gray-400'>{service.description}</p>
                  </motion.div>
              ))
            }
          </div>
        </motion.div>
    </div>
  )
}

export default Services