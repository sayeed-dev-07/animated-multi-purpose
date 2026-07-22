/* eslint-disable react-hooks/refs */
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'lucide-react';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WorkCard = ({ data }) => {
    const imgRef = useRef(null);
    const imgContainer = useRef(null);
    const linkRef = useRef(null);
    const overlayRef = useRef(null);
    const isDesktopRef = useRef(false); // Track viewport state

    const { contextSafe } = useGSAP({ scope: imgContainer });

    useGSAP(() => {
        gsap.config({ force3D: true });

        // 1. Scroll-triggered entry animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: imgContainer.current,
                start: 'top 88%',
            }
        });

        tl.fromTo(imgContainer.current,
            { autoAlpha: 0, y: 36, clipPath: 'inset(100% 0% 0% 0%)' },
            { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'power3.out' }
        );

        // 2. Responsive MatchMedia for Touch vs Desktop
        const mm = gsap.matchMedia();

        // Desktop: Hide overlay initially, let hover events handle it
        mm.add('(min-width: 768px)', () => {
            isDesktopRef.current = true;
            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set(linkRef.current, { y: 40, opacity: 0, scale: 0.5 });
        });

        // Mobile/Tablet: Keep overlay and link visible at all times
        mm.add('(max-width: 767px)', () => {
            isDesktopRef.current = false;
            gsap.set(overlayRef.current, { opacity: 1 });
            gsap.set(linkRef.current, { y: 0, opacity: 1, scale: 1 });
        });

        return () => mm.revert();
    }, { scope: imgContainer });

    const onMouseEnter = contextSafe(() => {
        if (!isDesktopRef.current) return; // Ignore on touch screens

        gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(linkRef.current,
            { y: 40, opacity: 0, scale: 0.5 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
        );
    });

    const onMouseLeave = contextSafe(() => {
        if (!isDesktopRef.current) return; // Ignore on touch screens

        gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' });
        gsap.to(linkRef.current, { y: -40, opacity: 0, scale: 0.5, duration: 0.4, ease: 'power2.in' });
    });

    return (
        <div
            ref={imgContainer}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className='cursor-pointer will-change-transform group relative w-full h-[250px] md:h-[350px] overflow-hidden'
        >
            <img
                ref={imgRef}
                className='h-full w-full will-change-transform object-cover transition-all duration-500 md:grayscale md:group-hover:grayscale-0 hover:scale-105'
                src={data.imgLink}
                alt={data.title || "Work Sample"}
            />

            <div
                ref={overlayRef}
                // CHANGED: Removed 'hidden md:flex' and 'opacity-0'. Added Tailwind fallbacks: opacity-100 on mobile, opacity-0 on desktop
                className='absolute inset-0 bg-black/40 pointer-events-none flex items-center justify-center opacity-100 md:opacity-0'
            >
                <a
                    ref={linkRef}
                    href={data.link || '#'}
                    target={data.link ? "_blank" : "_self"}
                    rel={data.link ? "noopener noreferrer" : ""}
                    onClick={(e) => {
                        if (!data.link) e.preventDefault();
                    }}
                    className={`bg-white p-4 rounded-full text-black shadow-xl pointer-events-auto  ${!data.link ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Link size={24} strokeWidth={2.5} />
                </a>
            </div>
        </div>
    );
};

export default WorkCard;