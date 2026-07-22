import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import Slider from '../components/testimonialsComp/Slider';

const Testimonials = () => {
    const [sectionData, setSectionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://backend-updated-topaz.vercel.app/testimonials';

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                setLoading(true);
                const res = await fetch(API_URL);

                if (!res.ok) {
                    throw new Error('Failed to fetch testimonial data');
                }

                const data = await res.json();

                // Target the first object for title and description
                if (data && data.length > 0) {
                    setSectionData(data[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHeaderData();
    }, []);

    // 1. Loading State
    if (loading) {
        return (
            <div className="py-20 text-center">
                <p className="text-white/50 animate-pulse tracking-widest uppercase text-sm">
                    Loading Testimonials...
                </p>
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-500 font-bold uppercase text-xs tracking-tighter">
                    Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className='py-20'>
            {/* 3. Dynamic Title and Subtitle */}
            <SectionTitle
                title={sectionData?.title || 'CLIENT SAYS'}
                des={sectionData?.subtitle || 'What our clients think about us.'}
            />

            <div className='overflow-hidden'>
                <Slider />
            </div>
        </div>
    );
};

export default Testimonials;