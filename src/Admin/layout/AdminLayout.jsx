import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ImageSlider from '../../components/heroComp/SlideShow';

import AdminServices from '../sections/AdminServices';
import ContactUs from '../../sections/Contact';
import AdminNavbar from '../components/AdminNavbar';
import AdminTestimonials from '../sections/AdminTestimonials';
import AdminAbout from '../sections/AdminAbout';
import AdminHero from '../sections/AdminHero';
import AdminWork from '../sections/AdminWork';
import AdminTeam from '../sections/AdminTeam';
import AdminPrice from '../sections/AdminPrice';





gsap.registerPlugin(ScrollTrigger);

const AdminLayout = () => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);

    useGSAP(() => {
        if (!containerRef.current || !bgRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            pin: bgRef.current,
            pinSpacing: false,
            invalidateOnRefresh: true,
        });

        return () => trigger.kill();
    }, { scope: containerRef });

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
            className='w-full min-h-screen relative bg-[#111418]'
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
                    <ImageSlider introFinished={true} />
                </div>
            </div>



            <div id='home' className='relative z-10 w-full  flex flex-col mx-auto '>
                <AdminNavbar />
                <AdminHero />
                <div className='sm:max-w-137.5 max-w-none md:max-w-240  w-full mx-auto flex flex-col gap-y-[200px] gap-y-[220px] md:gap-y-63'>
                    <div id='about' className='px-2'>
                        <AdminAbout />
                    </div>
                    <div id='services' className='px-2'>
                        <AdminServices />
                    </div>
                    <div id='work' className='px-2'>
                        <AdminWork />
                    </div>
                    <div id='team' className='px-2'>
                        <AdminTeam />
                    </div>
                    <div id='price' className='px-2'>
                        <AdminPrice />
                    </div>
                    <div id='testimonials' className=''>
                        <AdminTestimonials />
                    </div>
                    <div id='contact' className='px-2'>
                        <ContactUs />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;
