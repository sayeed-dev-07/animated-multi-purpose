import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router';

gsap.registerPlugin(useGSAP)

export default function NotFound() {
    const containerRef = useRef(null);
    const leftPlugRef = useRef(null);
    const rightPlugRef = useRef(null);
    const sparksRef = useRef(null);

    useGSAP(() => {
        gsap.config({
            force3D: true,
        });
        const tl = gsap.timeline();
        const revealItems = gsap.utils.toArray('.reveal-text', containerRef.current);


        gsap.set(revealItems, { y: 60, autoAlpha: 0 });
        gsap.set(sparksRef.current?.children || [], { scale: 0, opacity: 0, transformOrigin: 'center' });


        tl.fromTo(
            [leftPlugRef.current, rightPlugRef.current],
            { x: (i) => (i === 0 ? 30 : -30), opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        )
            .to(
                sparksRef.current?.children || [],
                { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
                '-=0.8'
            )
            .to(
                revealItems,
                { y: 0, autoAlpha: 1, duration: 1, stagger: 0.15, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
                '-=0.8'
            );


        gsap.to(leftPlugRef.current, {
            y: -4,
            rotation: -1,
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
        });

        gsap.to(rightPlugRef.current, {
            y: 4,
            rotation: 1,
            duration: 2.8,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 0.2,
        });
    }, { scope: containerRef })
    return (
        <section
            ref={containerRef}

            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fdfbf7] px-6 text-[#2c1e16] antialiased"
        >

            <div className="relative mb-12 flex w-full max-w-lg items-center justify-center">
                <svg viewBox="0 0 400 120" className="h-auto w-full max-w-[400px] overflow-visible">

                    <g ref={leftPlugRef}>
                        <path d="M-50,60 Q50,40 150,60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <rect x="150" y="45" width="30" height="30" rx="4" fill="#fdfbf7" stroke="currentColor" strokeWidth="4" />
                        <line x1="180" y1="52" x2="190" y2="52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <line x1="180" y1="68" x2="190" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <line x1="160" y1="50" x2="160" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="166" y1="50" x2="166" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="172" y1="50" x2="172" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </g>


                    <g ref={sparksRef} stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="200" y1="20" x2="200" y2="35" />
                        <line x1="200" y1="85" x2="200" y2="100" />
                        <line x1="175" y1="30" x2="185" y2="40" />
                        <line x1="215" y1="80" x2="225" y2="90" />
                    </g>


                    <g ref={rightPlugRef}>
                        <path d="M250,60 Q350,80 450,60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <rect x="220" y="45" width="30" height="30" rx="4" fill="#fdfbf7" stroke="currentColor" strokeWidth="4" />
                        <rect x="210" y="49" width="10" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                    </g>
                </svg>
            </div>


            <div className="flex flex-col items-center text-center">
                <div className="overflow-hidden pb-2">
                    <h1 className="reveal-text text-8xl font-black tracking-tight md:text-9xl">
                        404
                    </h1>
                </div>

                <div className="overflow-hidden pb-2 mt-2">
                    <h2 className="reveal-text text-xl font-medium tracking-wide md:text-2xl">
                        Oops!, Page not Found
                    </h2>
                </div>

                <div className="overflow-hidden mt-6 mb-10 max-w-md">
                    <p className="reveal-text text-sm leading-relaxed text-[#5a483e]">
                        The connection seems to be broken. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="overflow-hidden p-2">
                    <Link
                        to="/"
                        className="reveal-text group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-[#2c1e16] bg-transparent px-8 py-3 font-medium active:scale-95"
                    >
                        <span className="absolute inset-0 translate-y-[100%] bg-[#2c1e16] transition-transform duration-300 ease-out will-change-transform group-hover:translate-y-0" />
                        <span className="relative text-xs tracking-widest text-[#2c1e16] transition-colors duration-300 group-hover:text-[#fdfbf7]">
                            GO BACK HOME
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
