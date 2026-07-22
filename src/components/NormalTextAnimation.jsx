import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const TypingTextAnimation = ({ text, style }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        document.fonts.ready.then(() => {
            const split = new SplitText(textRef.current, { type: "chars" });

            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 90%",
                },
                opacity: 0,
                duration: 0.01,
                stagger: 0.05,
                ease: "none",
            });

            return () => {
                split.revert();
            }
        })

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="">
            <h2 ref={textRef} className={`${style}`}>
                {text}
            </h2>
        </div>
    );
};

export default TypingTextAnimation;