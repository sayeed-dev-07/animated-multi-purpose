import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';
gsap.registerPlugin(useGSAP)

const IntroAnimation = ({ onComplete }) => {
    const containerRef = useRef(null);
    const firstImgRef = useRef(null);
    const secondImgRef = useRef(null);
    const thirdImgRef = useRef(null);
    const hasCompletedRef = useRef(false);

  


    useGSAP(() => {
        gsap.config({
      force3D: true,
    });
        const tl = gsap.timeline({
            onComplete: () => {
                if (hasCompletedRef.current) {
                    return;
                }

                hasCompletedRef.current = true;
                onComplete?.();
            },
            defaults: {
                ease: 'expo',

            }
        });

        gsap.set(firstImgRef.current, {
            x: '-55vw',
            y: '-50%',
            scale: 0.9,
            autoAlpha: 0,
            rotate: -10,
            
        });

        gsap.set(secondImgRef.current, {
            x: '55vw',
            y: '-50%',
            scale: 0.9,
            autoAlpha: 0,
            rotate: 10,
           
        });

        gsap.set(thirdImgRef.current, {
            x: '-50%',
            y: '55vh',
            scale: 0.9,
            autoAlpha: 0,
            rotate: 0,
            
        });

        tl.to(firstImgRef.current, {
            x: '-50%',
            y: '-50%',
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            delay: 0.4,

        })
            .to(secondImgRef.current, {
                x: '-50%',
                y: '-50%',
                autoAlpha: 1,
                scale: 1,
                duration: 0.7,

            }, '>-0.1')
            .to({}, { duration: 0.10 })
            .to(thirdImgRef.current, {
                x: '-50%',
                y: '-50%',
                autoAlpha: 1,
                scale: 1,
                duration: 0.6,

            })
            .to({}, { duration: 0.3 });
    }, { scope: containerRef });


    return (
        <div
            ref={containerRef}
            className='fixed top-0 left-0 h-screen w-full bg-foreground px-4 text-background z-[9999] overflow-hidden'
        >
            <img
                ref={firstImgRef}
                className='absolute will-change-transform top-1/2 left-1/2 w-[82vw] max-w-[500px] aspect-square rounded-[8px] object-cover shadow-2xl'
                src="/images/homeImg/slider1.jpg"
                alt=""
            />
            <img
                ref={secondImgRef}
                className='absolute will-change-transform top-1/2 left-1/2 w-[82vw] max-w-[500px] aspect-square rounded-[8px] object-cover shadow-2xl'
                src="/images/homeImg/slider2.jpg"
                alt=""
            />
            <img
                data-flip-id="hero-img"
                ref={thirdImgRef}
                className='absolute will-change-transform top-1/2 left-1/2 w-[82vw] max-w-[500px] aspect-square rounded-[8px] object-cover shadow-2xl'
                src="/images/homeImg/slider3.jpg"
                alt=""
            />
        </div>
    );
};

export default IntroAnimation;
