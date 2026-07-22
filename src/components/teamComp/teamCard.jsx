/* eslint-disable react-hooks/refs */
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'lucide-react';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TeamCard = ({ data }) => {
    const imgContainer = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const isDesktopRef = useRef(false);

    const { contextSafe } = useGSAP({ scope: imgContainer });

    useGSAP(() => {
        gsap.config({
            force3D: true,
        });
        // 1. Scroll-triggered entry animation for the card
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: imgContainer.current,
                start: 'top 88%',
            },

        });

        tl.fromTo(imgContainer.current,
            { autoAlpha: 0, y: 36, clipPath: 'inset(100% 0% 0% 0%)' },
            { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'power3.out' }
        );

        const mm = gsap.matchMedia();

        // 2. Desktop: prepare hover animation states
        mm.add('(min-width: 768px)', () => {
            isDesktopRef.current = true;
            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set('.overlay-text', { y: 20, opacity: 0 });
            gsap.set('.overlay-icon', { scale: 0.8, opacity: 0 });
        });

        // 3. Mobile/tablet (< md): keep overlay content visible and static
        mm.add('(max-width: 767px)', () => {
            isDesktopRef.current = false;
            gsap.set(imgRef.current, { scale: 1 });
            gsap.set(overlayRef.current, { opacity: 1 });
            gsap.set('.overlay-text', { y: 0, opacity: 1 });
            gsap.set('.overlay-icon', { scale: 1, opacity: 1 });
        });

        return () => mm.revert();

    }, { scope: imgContainer });

    const onMouseEnter = contextSafe(() => {
        if (!isDesktopRef.current) return;

        // Image scale up
        gsap.to(imgRef.current, { scale: 1.05, duration: 0.6, ease: 'power3.out' });

        // Overlay background fade in
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });

        // Staggered text float up
        gsap.to('.overlay-text', {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.1
        });

        // Icon pop in
        gsap.to('.overlay-icon', {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.5)',
            delay: 0.15
        });
    });

    const onMouseLeave = contextSafe(() => {
        if (!isDesktopRef.current) return;

        // Image scale down
        gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: 'power3.out' });

        // Overlay background fade out
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' });

        // Text float down
        gsap.to('.overlay-text', {
            y: 15,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.in'
        });

        // Icon scale out
        gsap.to('.overlay-icon', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    });

    return (
        <div
            ref={imgContainer}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className='group max-w-[230px] will-change-transform relative h-full rounded-lg w-full overflow-hidden bg-gray-100'
        >
            <img
                ref={imgRef}
                className='h-full will-change-transform  w-full rounded-lg object-cover transition-[filter] duration-500 grayscale-0 md:grayscale md:group-hover:grayscale-0'
                src={data.imgLink}
                alt={data.name || "Team Member"}
            />

            <div
                ref={overlayRef}
                className='absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-3 opacity-100 md:opacity-0 pointer-events-none'
            >
                <div className="absolute right-3 top-2.5 overlay-icon">
                    {/* 
                      CHANGED: 
                      1. Replaced <button> with <a> 
                      2. Added dynamic target="_blank" 
                      3. Removed Tailwind hover transitions to respect GSAP
                      4. Handled missing links safely
                    */}
                    <a
                        href={data.social || '#'}
                        target={data.social ? "_blank" : "_self"}
                        rel={data.social ? "noopener noreferrer" : ""}
                        onClick={(e) => {
                            if (!data.social) e.preventDefault();
                        }}
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md cursor-pointer pointer-events-auto ${!data.social ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Link size={18} strokeWidth={2.5} />
                    </a>
                </div>

                <div className="flex flex-col gap-1 pointer-events-auto cursor-default">
                    <h3 className='overlay-text uppercase font-open-sans tracking-[3px] text-2xl font-bold text-white '>
                        {data.name}
                    </h3>
                    <p className='overlay-text text-xs text-gray-300 uppercase tracking-wider'>
                        {data.position}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;