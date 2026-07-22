/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NormalTextAnimation from '../components/NormalTextAnimation';
import Spinner from '../components/Loading';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// 1. Define a robust fallback object
const DEFAULT_DATA = {
    title: 'About Us',
    subtitle: 'We are dedicated to excellence.',
    imgLink: "/images/aboutImg/pcImg.jpg",
    cards: [
        { title: 'COMPANY', description: 'Information about our company.' },
        { title: 'MISSION & VISION', description: 'Our goals and future outlook.' }
    ]
};

const AboutUs = ({ introFinish }) => {
    const aboutContainerRef = useRef(null);
    const titleDivRef = useRef(null);
    const tl = useRef(null);
    const container2Ref = useRef(null);
    const imgContainer = useRef(null);
    const imgRef = useRef(null);
    const container3Ref = useRef(null);

    // 2. Initialize with default data to prevent "undefined" errors before fetch
    const [data, setData] = useState(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('https://backend-updated-topaz.vercel.app/about');
                if (!res.ok) throw new Error('Failed to fetch data');

                const resData = await res.json();

                // 3. Deep merge/Validation: Ensure cards array exists even if API sends something else
                const cleanData = {
                    ...DEFAULT_DATA,
                    ...resData[0],
                    cards: resData[0]?.cards?.length >= 2 ? resData[0].cards : DEFAULT_DATA.cards
                };

                setData(cleanData);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error.message);
                // We don't change 'data' here, so it stays as DEFAULT_DATA
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    useGSAP(() => {
        // Only run if not loading and refs are attached
        if (loading || !titleDivRef.current) return;

        gsap.config({ force3D: true });

        // FIXED: Changed .from() to .fromTo()
        tl.current = gsap.timeline({ paused: true })
            .fromTo(titleDivRef.current.children,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                }
            );

        if (introFinish) {
            tl.current.play();
        }

        if (imgContainer.current) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: imgContainer.current,
                    start: 'top 88%',
                },
            })
                .fromTo(imgContainer.current,
                    { autoAlpha: 0, y: 36, clipPath: 'inset(100% 0% 0% 0% round 4px)' },
                    { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 4px)', duration: 1.25, ease: 'power3.out' }
                )
                .fromTo(imgRef.current,
                    { scale: 1.12, yPercent: 8 },
                    { scale: 1, yPercent: 0, duration: 1.5, ease: 'power2.out' },
                    0
                );
        }

        // Defensive check for container refs
        const scrollSections = [container2Ref.current, container3Ref.current].filter(Boolean);
        if (scrollSections.length > 0) {
            // FIXED: Changed .from() to .fromTo()
            gsap.fromTo(scrollSections.flatMap(c => Array.from(c.children)),
                {
                    y: 40,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container2Ref.current,
                        start: 'top 85%',
                    }
                }
            );
        }

    }, { scope: aboutContainerRef, dependencies: [loading, introFinish] });

    if (loading) return <Spinner />;

    return (
        <div ref={aboutContainerRef} className='text-white py-20 overflow-hidden md:text-start text-center'>

            <div ref={titleDivRef} className='flex flex-col gap-y-[18px] items-center '>
                <p className='text-center tracking-[6px] font-extrabold text-header font-open-sans uppercase'>
                    {data.title}
                </p>
                <div className='w-[150px] overflow-hidden'>
                    <div className='w-full h-px bg-white/60' />
                </div>
                <p className='text-secondary'>
                    {data.subtitle}
                </p>
            </div>

            <div className="grid mt-[86px] items-center justify-center grid-cols-1 md:grid-cols-2 gap-x-[74px] gap-y-[42px]">
                {/* Card 1 */}
                <div className="order-1 md:order-2">
                    <div ref={container2Ref} className='flex flex-col gap-y-5'>
                        <NormalTextAnimation
                            style={'text-[20px] font-bold font-open-sans'}
                            text={data.cards[0]?.title}
                        />
                        <p className='text-secondary leading-5.25'>
                            {data.cards[0]?.des}
                        </p>
                    </div>
                </div>

                {/* Image Section */}
                <div ref={imgContainer} className="order-2 flex items-center justify-center overflow-hidden md:order-1 md:row-span-2">
                    <img
                        ref={imgRef}
                        className='w-fit will-change-transform'
                        src={data.imgLink}
                        alt="About"
                        onError={(e) => { e.target.src = DEFAULT_DATA.imgLink; }} // Handle broken image links
                    />
                </div>

                {/* Card 2 */}
                <div className="order-3 md:order-3">
                    <div ref={container3Ref} className='flex flex-col gap-y-5'>
                        <NormalTextAnimation
                            style={'text-[20px] font-bold font-open-sans'}
                            text={data.cards[1]?.title}
                        />
                        <p className='text-secondary leading-5.25'>
                            {data.cards[1]?.des}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;