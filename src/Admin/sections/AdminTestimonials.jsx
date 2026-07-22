import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import Slider from '../../components/testimonialsComp/Slider';
import GlobalTestimonialModal from '../components/testimonalsComponent/TestmonialModal';

const AdminTestimonials = () => {
    const [sectionData, setSectionData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const API_URL = 'https://backend-updated-topaz.vercel.app/testimonials';

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch testimonial data');
            const resData = await res.json();
            const apiData = resData?.[0];
            setSectionData({
                ...apiData,
                title: apiData?.title || '',
                subtitle: apiData?.subtitle || ''
            });
        } catch (err) {
            console.error("Fetch error:", err);
            setSectionData({
                title: '',
                subtitle: ''
            });
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (!sectionData) return <div className="p-20 text-white">Loading...</div>;

    return (
        <div className='py-20'>

            <div className='flex items-center mb-3 justify-center'>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase text-sm tracking-widest shadow-lg cursor-pointer"
                >
                    Edit Entire Section
                </button>

            </div>

            <div>
                <SectionTitle
                    title={sectionData.title}
                    des={sectionData.subtitle}
                />

            </div>


            <div className='overflow-hidden'>
                <Slider />
            </div>


            {isOpen && (
                <GlobalTestimonialModal
                    fullData={sectionData}
                    onClose={() => setIsOpen(false)}
                    refresh={fetchData}
                />
            )}
        </div>
    );
};

export default AdminTestimonials;
