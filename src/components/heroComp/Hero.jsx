import React, { useRef, useState, useEffect } from 'react';
import Button from '../Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Hero = ({ introFinished }) => {
    const containerRef = useRef(null);
    const mainTl = useRef(null);

    // 1. Setup states for API data, loading, and errors
    const [heroData, setHeroData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Fetch data on component mount
    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch('https://backend-updated-topaz.vercel.app/hero');
                if (!response.ok) throw new Error('Failed to fetch data');

                const data = await response.json();

                // Assuming the API returns an array based on your example response
                if (data && data.length > 0) {
                    setHeroData(data[0]);
                } else {
                    throw new Error('No data found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    useGSAP(() => {
        // Prevent GSAP from targeting elements before the data has loaded
        if (isLoading || error || !heroData) return;

        gsap.config({
            force3D: true,
        });

        gsap.set(".animate-title", { y: -30, autoAlpha: 0 });
        gsap.set(".animate-bottom-text", { y: 30, autoAlpha: 0 });
        gsap.set(".animate-button", { y: 20, autoAlpha: 0 });
        gsap.set(".animate-box", { scale: 0, autoAlpha: 0 });
        gsap.set(".animate-line", { scaleX: 0 });

        // Create Timeline
        mainTl.current = gsap.timeline({
            paused: true,
            defaults: { duration: 0.6, ease: 'power1.inOut' }
        });

        mainTl.current
            .to(".animate-button", { y: 0, autoAlpha: 1 })
            .to(".animate-box", { scale: 1, autoAlpha: 1, duration: 0.4 }, "-=0.3")
            .to(".animate-line", { scaleX: 1, stagger: 0.1 }, "-=0.1")
            .to(".animate-title", { y: 0, autoAlpha: 1 }, "<")
            .to(".animate-bottom-text", { y: 0, autoAlpha: 1 }, "<");

        // Add loading and data states as dependencies so the hook reruns when DOM is ready
    }, { scope: containerRef, dependencies: [isLoading, error, heroData] });


    useGSAP(() => {
        // Ensure mainTl exists before trying to play/pause
        if (mainTl.current) {
            if (introFinished) {
                mainTl.current.play();
            } else {
                mainTl.current.pause(0);
            }
        }
    }, { dependencies: [introFinished, isLoading] });

    // 3. Fallback UI states
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[50vh] text-white'>
                <p className='text-[20px] animate-pulse tracking-[4px] uppercase'>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[50vh] text-red-500'>
                <p className='text-[20px] tracking-[2px]'>Error: {error}</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className='flex px-2 sm:max-w-137.5 max-w-none md:max-w-240 mx-auto text-center sm:py-[10%] py-[15%] font-roboto items-center text-white justify-center flex-col'>

            {/* 4. Inject dynamic data, with hardcoded text as fallbacks in case API fields are empty strings */}
            <p className='animate-title font-extrabold leading-[45px] text-[30px] md:text-[48px] uppercase tracking-[6px] font-open-sans'>
                {heroData?.title || 'PLAY YOUR IMAGINATION'}
            </p>

            <div className='relative mt-[49px] mb-[34px]'>
                <div className='relative sm:w-[224px] w-[160px] md:w-[350px] h-1'>
                    {/* Left Line */}
                    <div className='animate-line absolute right-1/2 top-0 h-full w-1/2 origin-right bg-white' />
                    {/* Right Line */}
                    <div className='animate-line absolute left-1/2 top-0 h-full w-1/2 origin-left bg-white' />
                </div>
                <div className='animate-box h-2 absolute -translate-y-1/2 -translate-x-1/2 left-[50%] top-[50%] w-4 bg-white' />
            </div>

            <div className='animate-bottom-text'>
                <p className='sm:text-[18px] text-[20px] md:text-[24px] md:leading-[48px] sm:leading-[36px] leading-[40px] mb-[8px] tracking-[3px]'>
                    {heroData?.subtitle1 || 'MSR Creation present Multi Purpose Website Theme'}
                </p>
                <p className='tracking-[3px] text-[14px] sm:text-[12px] md:text-[16px] leading-[32px]'>
                    {heroData?.subtitle2 || 'Awesome Think - Awesome Design'}
                </p>
            </div>

            <div className='animate-button mt-[73px]'>
                <Button
                    text={heroData?.button?.text || 'our offer'}
                    className='text-[12px] cursor-pointer tracking-[2px] py-3 px-10 uppercase'
                    href={heroData?.button?.link || 'https://i.pinimg.com/736x/db/1a/04/db1a04df4a5812f454901be48f4aa27e.jpg'}
                />
            </div>
        </div>
    );
};

export default Hero;