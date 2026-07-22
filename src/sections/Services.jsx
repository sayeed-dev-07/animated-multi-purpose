import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

import ServiceCard from '../components/servicesComp/serviceCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Services = () => {
    const cardContainer = useRef(null);
    const sectionRef = useRef(null);
    const [data, setData] = useState({
        title: '',
        des: '',
        cards: []
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('https://backend-updated-topaz.vercel.app/services');
                if (!res.ok) throw new Error('Failed to fetch services data');

                const resData = await res.json();
                const apiData = resData?.[0];

                setData({
                    title: apiData?.title || '',
                    des: apiData?.des || '',
                    cards: Array.isArray(apiData?.cards) ? apiData.cards : []
                });
            } catch (error) {
                console.error('Services fetch error:', error);
                setData({
                    title: '',
                    des: '',
                    cards: []
                });
            }
        }

        getData()

    }, [])

    useGSAP(() => {
        const cards = gsap.utils.toArray('.serviceCard');
        let mm = gsap.matchMedia();

        mm.add({

            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isDesktop } = context.conditions;

            if (isDesktop) {

                gsap.from(cards, {
                    y: 60,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardContainer.current,
                        start: 'clamp(top 85%)',
                    }
                });
            } else {

                cards.forEach((card) => {
                    gsap.from(card, {
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'clamp(top 90%)',

                        }
                    });
                });
            }
        });

    }, { scope: sectionRef });

    return (
        <div ref={sectionRef} className='py-20 overflow-hidden'>
            <SectionTitle title={data.title} des={data.des} />

            <div ref={cardContainer} className='py-25 grid grid-cols-1 md:grid-cols-3 gap-x-13 text-white gap-y-12 md:gap-y-22.5'>
                {data.cards.map(item => (
                    <div key={item.id} className="serviceCard">
                        <ServiceCard data={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
