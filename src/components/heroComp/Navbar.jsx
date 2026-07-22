import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import Navlink from './Navlink';
import { navLinksData } from '../../../public/data/navLinksData';

gsap.registerPlugin(useGSAP);

const Navbar = ({ introFinished }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const navRef = useRef(null);
    const navRowRef = useRef(null);
    const mobilePanelRef = useRef(null);
    const luffyImgRef = useRef(null);


    const isMenuOpenRef = useRef(isMenuOpen);
    const lastScrollYRef = useRef(0);
    const isNavHiddenRef = useRef(false);
    const menuTlRef = useRef(null);
    const revealTlRef = useRef(null);


    useEffect(() => {
        isMenuOpenRef.current = isMenuOpen;
    }, [isMenuOpen]);

    useGSAP(() => {
        const desktopItems = gsap.utils.toArray('[data-desktop-item]');
        const mobileItems = gsap.utils.toArray('[data-mobile-item]');
        const hamburgerBars = gsap.utils.toArray('.hamburger-bar');


       gsap.config({
            force3D: true,
        });

        gsap.set(navRef.current, { yPercent: 0, y: -42, autoAlpha: 0 });
        gsap.set(mobilePanelRef.current, {
            yPercent: -100,
            autoAlpha: 0,
            pointerEvents: 'none',
            clipPath: 'inset(0% 0% 100% 0%)',
        });


        gsap.set(hamburgerBars[0], { y: -7, rotate: 0 });
        gsap.set(hamburgerBars[1], { y: 0, rotate: 0, autoAlpha: 1, scaleX: 1, transformOrigin: 'center center' });
        gsap.set(hamburgerBars[2], { y: 7, rotate: 0 });

        gsap.set(mobileItems, {
            autoAlpha: 0,
            y: -22,
            rotateX: 20,
            transformOrigin: 'top center',
        });
        gsap.set(navRowRef.current, { autoAlpha: 0, y: -42 });
        gsap.set(desktopItems, { autoAlpha: 0, y: -12 });


        revealTlRef.current = gsap.timeline({ paused: true });
        revealTlRef.current
            .to(navRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'expo.out',
            })
            .to(navRowRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'expo.out',
            }, '<')
            .to(desktopItems, {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power3.out',
            }, '-=0.4');


        menuTlRef.current = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.inOut' },
        });

        menuTlRef.current
            .to(mobilePanelRef.current, {
                yPercent: 0,
                autoAlpha: 1,
                pointerEvents: 'auto',
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.6,
            })
            .to(mobileItems, {
                autoAlpha: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.05,
                duration: 0.4,
                ease: 'expo.out'
            }, '-=0.3')

            .to(hamburgerBars[0], { y: 0, rotate: 45, duration: 0.3, ease: 'power2.inOut' }, '<')
            .to(hamburgerBars[1], { autoAlpha: 0, scaleX: 0, duration: 0.2, ease: 'power2.inOut' }, '<')
            .to(hamburgerBars[2], { y: 0, rotate: -45, duration: 0.3, ease: 'power2.inOut' }, '<')

            .from(luffyImgRef.current, {
                y: 160,
                duration: 0.6,
                ease: "expo.out"
            }, '-=0.4');

    }, { scope: navRef });


    useEffect(() => {
        if (!menuTlRef.current) return;

        if (isMenuOpen) {
            menuTlRef.current.play();
            document.body.style.overflow = 'hidden';
        } else {
            menuTlRef.current.reverse();
            document.body.style.overflow = '';
        }
    }, [isMenuOpen]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    useEffect(() => {
        if (!revealTlRef.current) return;
        introFinished ? revealTlRef.current.play() : revealTlRef.current.pause(0);
    }, [introFinished]);


    useGSAP(() => {
        if (!introFinished || !navRef.current) return;

        const showNav = () => {
            if (!isNavHiddenRef.current) return;
            isNavHiddenRef.current = false;
            gsap.to(navRef.current, {
                yPercent: 0,
                duration: 0.4,
                ease: 'power3.out',
                overwrite: "auto"
            });
        };

        const hideNav = () => {
            if (isNavHiddenRef.current) return;
            isNavHiddenRef.current = true;
            gsap.to(navRef.current, {
                yPercent: -110,
                duration: 0.4,
                ease: 'power3.in',
                overwrite: "auto"
            });
        };

        const handleScroll = () => {
            const currentY = window.scrollY;


            if (isMenuOpenRef.current || currentY <= 6) {
                showNav();
                lastScrollYRef.current = currentY;
                return;
            }

            if (currentY > lastScrollYRef.current + 5) {
                hideNav();
            } else if (currentY < lastScrollYRef.current - 5) {
                showNav();
            }

            lastScrollYRef.current = currentY;
        };

        lastScrollYRef.current = window.scrollY;
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [introFinished]);

    return (
        <div ref={navRef} className='sticky px-2 bg-black/60 top-0 z-40 font-semibold will-change-transform'>
            <div className='sm:max-w-[550px] max-w-none md:max-w-[960px] mx-auto'>

                <div ref={navRowRef} className='relative z-[80] flex items-center justify-between py-3.5 sm:py-6'>
                    <a href='/' data-desktop-item>
                        <img className='h-[40px] w-[56px]' src='/images/homeImg/logo.png' alt='Logo' />
                    </a>

                    <button
                        type='button'
                        onClick={() => setIsMenuOpen(open => !open)}
                        data-desktop-item
                        className='relative z-90 flex h-10 w-10 cursor-pointer items-center justify-center md:hidden'
                        aria-label='Toggle navigation menu'
                        aria-expanded={isMenuOpen}
                    >
                        <span className='sr-only'>Toggle menu</span>
                        <span className='hamburger-bar absolute h-[2px] w-6 bg-white' />
                        <span className='hamburger-bar absolute h-[2px] w-6 bg-white' />
                        <span className='hamburger-bar absolute h-[2px] w-6 bg-white' />
                    </button>

                    <div data-desktop-item className='hidden items-center gap-6 md:flex'>
                        {navLinksData.map(link => (
                            <Navlink key={link.id}>
                                <a
                                    href={link.href}
                                    className='text-secondary font-roboto uppercase tracking-wide text-white'
                                >
                                    {link.desktopNode ?? link.label}
                                </a>
                            </Navlink>
                        ))}
                    </div>
                </div>

                <div
                    ref={mobilePanelRef}
                    className='fixed overflow-hidden inset-x-0 top-0 z-60 h-dvh bg-black/95 px-6 pt-24 md:hidden will-change-transform'
                >
                    <div className='flex flex-col gap-6 relative z-10'>
                        {navLinksData.map(link => (
                            <a
                                key={link.id}
                                data-mobile-item
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className='text-[18px] font-semibold uppercase tracking-[2px] text-white'
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <img
                        ref={luffyImgRef}
                        src="/images/homeImg/luffy.png"
                        className='w-[150px] z-5 left-[50%] -translate-x-1/2 absolute -bottom-6'
                        alt="Luffy"
                    />
                </div>

            </div>
        </div>
    );
};

export default Navbar;