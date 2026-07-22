import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import WorkCard from '../components/workComp/workCard'; 


const Work = () => {
    const [workInfo, setWorkInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://backend-updated-topaz.vercel.app/work';

    useEffect(() => {
        const fetchWorkData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch work data');

                const data = await response.json();


                if (data && data.length > 0) {
                    setWorkInfo(data[0]);
                } else {
                    throw new Error('No data found in database');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkData();
    }, []);

    if (loading) {
        return (
            <div className='py-20 flex items-center justify-center text-white min-h-[50vh]'>
                <p className='animate-pulse tracking-[4px] uppercase'>Loading Work...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='py-20 flex items-center justify-center text-red-500 min-h-[50vh]'>
                <p>Error: {error}</p>
            </div>
        );
    }


    const sectionTitle = workInfo?.title?.trim() ? workInfo.title : 'OUR WORK';
    const sectionDes = workInfo?.des?.trim() ? workInfo.des : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Integer.';
    const cards = Array.isArray(workInfo?.cards) ? workInfo.cards : [];

    return (
        <div className='py-20'>
            <SectionTitle
                title={sectionTitle}
                des={sectionDes}
            />


            <div className='mt-21.25 gap-3 grid grid-cols-2 md:grid-cols-3'>
                {cards.length > 0 ? (
                    cards.map((item, index) => {

                        return <WorkCard key={item.id || index} data={item} />
                    })
                ) : (
                    <div className="col-span-full text-center text-white/50 py-10">
                        No work samples available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Work;