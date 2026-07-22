/* eslint-disable react-hooks/refs */
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';
gsap.registerPlugin(useGSAP);

const Navlink = ({children}) => {
    const borderRef = useRef(null);
    const tl = useRef(null);

    const {contextSafe} = useGSAP(() => {
        if (!borderRef.current) {
            return;
        }
        gsap.set(borderRef.current, { xPercent: -105});
        tl.current = gsap.timeline({ paused: true })
        .to(borderRef.current, {
            xPercent:0,
            duration:0.4,
            ease:'power3.out'
        })

    }, []);

    const handleMouseEnter = contextSafe(()=>{
        tl.current?.play()
    })
    const handleMouseLeave = contextSafe(()=>{
        tl.current?.timeScale(1.2).reverse()
    })
    

    return (
        <div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} className='w-fit overflow-hidden'>
            {children}
            <div ref={borderRef} className='w-full h-0.5 bg-white'/>
        </div>
    );
};

export default Navlink;