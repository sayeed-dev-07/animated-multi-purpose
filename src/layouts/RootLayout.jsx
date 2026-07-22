/* eslint-disable react-hooks/set-state-in-effect */
import React, { useLayoutEffect, useRef, useState } from 'react';
import Layout from './Layout';
import gsap from 'gsap';
import { Flip } from 'gsap/all';
import IntroAnimation from './IntroAnimation';
import { IntroContext } from '../providers/IntroContext';

gsap.registerPlugin(Flip)

const RootLayout = () => {

    const mainAppRef = useRef(null);
    const [intro, setIntro] = useState(true);
    const [introFinished, setIntroFinished] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useLayoutEffect(() => {
        const played = sessionStorage.getItem("introPlayed");

        if (played) {
            setIntro(false);
            setIntroFinished(true);
            if (mainAppRef.current) {
                gsap.set(mainAppRef.current, { opacity: 1 });
            }
        } else {
            if (mainAppRef.current) {
                gsap.set(mainAppRef.current, { opacity: 0 });
            }
        }
        setIsLoaded(true);
    }, []);

    useLayoutEffect(() => {
        const rootElement = document.documentElement;
        const bodyElement = document.body;

        if (!isLoaded || introFinished) {
            rootElement.classList.remove('intro-scroll-lock');
            bodyElement.classList.remove('intro-scroll-lock');
            return;
        }

        rootElement.classList.add('intro-scroll-lock');
        bodyElement.classList.add('intro-scroll-lock');
        window.scrollTo(0, 0);

        return () => {
            rootElement.classList.remove('intro-scroll-lock');
            bodyElement.classList.remove('intro-scroll-lock');
        };
    }, [isLoaded, introFinished]);

    const handleIntroComplete = () => {

        const state = Flip.getState('[data-flip-id="hero-img"]');
        setIntro(false);


        gsap.set(mainAppRef.current, { opacity: 1 });


        requestAnimationFrame(() => {
            if (!state) {
                setIntroFinished(true);
                sessionStorage.setItem("introPlayed", "true");
                return;
            }

            Flip.from(state, {
                targets: '[data-flip-id="hero-img"]',
                duration: 1.5,
                ease: 'expo.out',
                nested: true,
                onComplete: () => {
                    setIntroFinished(true);
                    sessionStorage.setItem("introPlayed", "true");
                }
            });
        });
    };

    useLayoutEffect(() => {
        if (mainAppRef.current) {
            gsap.set(mainAppRef.current, { opacity: 0 });
        }
    }, [])

    if (!isLoaded) return null;

    return (
        <IntroContext.Provider value={introFinished}>

            {intro && <IntroAnimation onComplete={handleIntroComplete} />}
            <div style={{ opacity: intro ? 0 : 1 }} ref={mainAppRef}>
                <Layout introFinished={introFinished} />
            </div>

        </IntroContext.Provider>
    );
};

export default RootLayout;
