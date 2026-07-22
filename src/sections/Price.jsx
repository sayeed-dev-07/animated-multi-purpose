import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import PriceCard from '../components/priceComp/PriceCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Price = () => {
    const sectionContainerRef = useRef(null);
    const cardContainerRef = useRef(null);

    const [priceInfo, setPriceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://backend-updated-topaz.vercel.app/slideshowData';

    useEffect(() => {
        const fetchPriceData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch pricing data');

                const data = await response.json();

                if (data && data.length > 0) {
                    setPriceInfo(data[0]);
                } else {
                    throw new Error('No pricing data found in database');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPriceData();
    }, []);

    useGSAP(() => {
        if (!priceInfo || !priceInfo.cards || priceInfo.cards.length === 0) return;

        const cards = gsap.utils.toArray('.priceCard');
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isDesktop } = context.conditions;

            if (isDesktop) {
                // FIXED: Using fromTo guarantees it won't get stuck at 0 opacity
                gsap.fromTo(cards,
                    {
                        y: 80,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.15, // Smooth delay between each card
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: cardContainerRef.current,
                            start: 'top 85%',
                        }
                    }
                );
            } else {
                cards.forEach((card) => {
                    gsap.fromTo(card,
                        {
                            y: 50,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                            }
                        }
                    );
                });
            }
        });

    }, { scope: sectionContainerRef, dependencies: [priceInfo] });

    if (loading) {
        return (
            <div className='py-20 flex items-center justify-center min-h-[50vh]'>
                <p className='animate-pulse tracking-[4px] uppercase text-zinc-500'>Loading Pricing...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='py-20 flex items-center justify-center min-h-[50vh] text-red-500'>
                <p>Error: {error}</p>
            </div>
        );
    }

    const sectionTitle = priceInfo?.title?.trim() ? priceInfo.title : 'PRODUCT PRICE';
    const sectionDes = priceInfo?.des?.trim() ? priceInfo.des : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Integer.';
    const cards = Array.isArray(priceInfo?.cards) ? priceInfo.cards : [];

    return (
        <section ref={sectionContainerRef} className="py-20">
            <SectionTitle
                title={sectionTitle}
                des={sectionDes}
            />

            <div ref={cardContainerRef} className='grid grid-cols-1 md:grid-cols-3 mt-[82px] gap-x-[20px] gap-y-10 justify-items-center'>
                {cards.length > 0 ? (
                    cards.map((item, index) => {
                        return <PriceCard data={item} key={item.id || index} />;
                    })
                ) : (
                    <div className="col-span-full text-center text-zinc-500 py-10">
                        No pricing plans available.
                    </div>
                )}
            </div>
        </section>
    );
};

export default Price;