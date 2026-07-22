import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

const SectionTitle = ({ title, des }) => {
    const containerRef = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const lineRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%", 
            }
        });

      
        tl.from([text1Ref.current, text2Ref.current], {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)", 
        })
        
        .from(lineRef.current, {
            xPercent: -100, 
            duration: 1,
            ease: "power2.out",
        }, "-=0.5"); 

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className='flex text-white text-center flex-col gap-y-4.5 items-center'>
            <p ref={text1Ref} className='text-center tracking-[6px] font-extrabold text-header font-open-sans leading-[43px] uppercase'>
                {title}
            </p>
            
            <div className='w-37.5 overflow-hidden'>
                <div ref={lineRef} className='w-full h-px bg-white/60' />
            </div>
            
            <p ref={text2Ref} className='text-secondary'>
                {des}
            </p>
        </div>
    );
};

export default SectionTitle;