/* eslint-disable react-hooks/refs */
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ServiceCard = ({ data }) => {
    const cardRef = useRef(null);
    const diamondRef = useRef(null);
    const fillRef = useRef(null);
    const iconRef = useRef(null);
    const titleRef = useRef(null);
    const hoverTl = useRef(null);

    useGSAP(() => {

        gsap.set(diamondRef.current, {
            rotate: -45,
            transformOrigin: '50% 50%',
        });

        gsap.set(iconRef.current, {
            rotate: 45,
            transformOrigin: '50% 50%',
        });

        gsap.set(fillRef.current, {
            xPercent: -50,
            yPercent: -50,
            scale: 0,
        });


        hoverTl.current = gsap.timeline({ paused: true })
            .to(diamondRef.current, {
                rotate: 0,
                duration: 0.6,
                ease: 'power3.out',
            }, 0)
            .to(iconRef.current, {
                rotate: 0,
                duration: 0.6,
                ease: 'power3.out',
            }, 0)
            .to(fillRef.current, {
                scale: 1,
                duration: 0.6,
                ease: 'expo.out'
            }, 0)
            .to(titleRef.current, {
                y: -4,
                color: '#fff',
                duration: 0.4,
                ease: 'power2.out'
            }, 0.1);

    }, { scope: cardRef });

    const { contextSafe } = useGSAP({ scope: cardRef });

    const handleEnter = contextSafe(() => hoverTl.current?.play());
    const handleLeave = contextSafe(() => hoverTl.current?.reverse());

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className='group serviceCard flex flex-col items-center text-center cursor-pointer'
        >

            <div
                ref={diamondRef}
                className='relative border w-fit flex items-center justify-center border-white/30 h-20.25 aspect-square overflow-hidden'
            >
                <span
                    ref={fillRef}
                    className='absolute left-1/2 top-1/2 h-[150%] aspect-square rounded-full bg-white pointer-events-none'
                />
                <img
                    ref={iconRef}
                    className='relative z-10 h-10 aspect-square'
                    src={data.imgLink}
                    alt={data.imgAlt}
                />
            </div>


            <p
                ref={titleRef}
                className='font-bold mt-8.75 mb-7 font-open-sans text-[20px] transition-colors duration-300'
            >
                {data.name}
            </p>

            <p className='text-secondary md:max-w-none max-w-90.5 sm:max-w-70 w-full'>
                {data.des}
            </p>
        </div>
    );
};

export default ServiceCard;
