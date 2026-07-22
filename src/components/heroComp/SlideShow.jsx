import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { slideImg } from '../../../public/data/slideShowImgData';

const ImageSlider = ({ introFinished }) => {
    const container = useRef(null);
    const slidesRef = useRef([]);
    const timerRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const prevIndex = useRef(0);
    

    useGSAP(() => {
        if (!introFinished) return;
        const slides = slidesRef.current;
        if (!slides.length) return;

        gsap.set(slides, { opacity: 0, scale: 1, zIndex: 0 });


        gsap.set(slides[0], { opacity: 1, zIndex: 2 });

        prevIndex.current = 0;
        setActiveIndex(0);

    }, [introFinished]);


    useGSAP(() => {
        if (!introFinished || slideImg.length <= 1) return;

        timerRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slideImg.length);
        }, 5000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [introFinished], { scope: container });


    useGSAP(() => {
        if (!introFinished) return;

        const slides = slidesRef.current;
        if (!slides.length) return;

        const current = slides[activeIndex];
        const previous = slides[prevIndex.current];

        if (!current || !previous || current === previous) return;

        const tl = gsap.timeline({
            defaults: { duration: 1.5, ease: 'none' }
        });

        tl.set(current, { zIndex: 2 });
        tl.set(previous, { zIndex: 1 });


        tl.to(previous, {
            opacity: 0,
            scale: 1,
        }, 0);

        tl.fromTo(current,
            {
                opacity: 0,
                scale: 1,
            },
            {
                opacity: 1,
                scale: 1,
            },
            0
        );

        prevIndex.current = activeIndex;

    }, [activeIndex, introFinished]);

    return (
        <div ref={container} className="relative h-full w-full overflow-hidden">
            {slideImg.map((img, i) => (
                <div
                    key={img.name}
                    ref={(el) => {
                        if (el) slidesRef.current[i] = el;
                    }}
                    className="absolute inset-0 h-full w-full opacity-0"
                >
                    <img
                        src={img.url}
                        alt={img.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageSlider;