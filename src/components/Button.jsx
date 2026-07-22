import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Button = ({ text, className = '', type = 'button', href, ...props }) => {
    const container = useRef(null);
    const tl = useRef(null);

    useGSAP(() => {
        tl.current = gsap.timeline({ paused: true })
            .to(".bg-layer", {
                xPercent: 100,
                duration: 0.45,
                ease: 'power3.out',
            })
            .to(".text-layer", {
                color: '#111827',
                duration: 0.3,
                ease: 'power2.out',
            }, 0);

    }, { scope: container });

    const handleMouseEnter = () => tl.current.play();
    const handleMouseLeave = () => tl.current.reverse();


    const Component = href ? 'a' : 'button';

    return (
        <Component
            ref={container}
            href={href}
            target='_blank'
            type={href ? undefined : type}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative w-full inline-flex items-center justify-center overflow-hidden border-2 rounded-xs px-6 py-2 transition-colors ${className}`}
            {...props}
        >

            <span className='invisible select-none' aria-hidden="true">{text}</span>

            <span
                className='bg-layer absolute inset-0 z-1 bg-white -translate-x-[103%] w-[105%]'
                style={{ willChange: 'transform' }}
            />

            {/* Text Layer */}
            <span className='text-layer absolute inset-0 z-2 flex items-center justify-center text-white'>
                {text}
            </span>
        </Component>
    );
};

export default Button;