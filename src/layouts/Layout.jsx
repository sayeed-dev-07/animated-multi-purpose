import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import ImageSlider from '../components/heroComp/SlideShow';
import Navbar from '../components/heroComp/Navbar';
import Hero from '../components/heroComp/Hero';
import AboutUs from '../sections/AboutUs';
import Services from '../sections/Services';
import Work from '../sections/Work';
import Team from '../sections/Team';
import Price from '../sections/Price';
import Testimonials from '../sections/Testimonials';

import ContactUs from '../sections/Contact';


gsap.registerPlugin(ScrollTrigger);

const Layout = ({ introFinished }) => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);

    useGSAP(() => {
        if (!introFinished || !containerRef.current || !bgRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            pin: bgRef.current,
            pinSpacing: false,
            invalidateOnRefresh: true,
        });

        return () => trigger.kill();
    }, { scope: containerRef, dependencies: [introFinished] });

    useEffect(() => {
        if (!containerRef.current) return;

        const refreshScrollTrigger = () => ScrollTrigger.refresh();
        const observer = new ResizeObserver(refreshScrollTrigger);

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            data-flip-id="hero-img"
            className='w-full h-full relative'
        >
            {/* 1. BACKGROUND LAYER (Pinned) */}
            <div
                data-flip-id="hero-img"
                ref={bgRef}
                style={{ backgroundImage: 'url("/images/homeImg/slider3.jpg")' }}
                className='h-screen w-full absolute top-0 left-0 z-0 bg-cover bg-center'
            >
                {/* z-index lowered to keep it behind */}
                <div className='h-full w-full absolute inset-0 z-0'>
                    <ImageSlider introFinished={introFinished} />
                </div>
            </div>



            <div id='home' className='relative z-10  flex flex-col mx-auto '>
                <Navbar introFinished={introFinished} />
                <Hero introFinished={introFinished} />
                <div className='sm:max-w-137.5 max-w-none md:max-w-240  w-full mx-auto flex flex-col gap-y-[200px] gap-y-[220px] md:gap-y-63'>
                    <div id='about' className='px-2'>
                        <AboutUs introFinish={introFinished} />
                    </div>
                    <div id='services' className='px-2'>
                        <Services />
                    </div>
                    <div id='work' className='px-2'>
                        <Work />
                    </div>
                    <div id='team' className='px-2'>
                        <Team />
                    </div>
                    <div id='price' className='px-2'>
                        <Price />
                    </div>
                    <div id='testimonials' className=''>
                        <Testimonials />
                    </div>
                    <div id='contact' className='px-2'>
                        <ContactUs />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Layout;
