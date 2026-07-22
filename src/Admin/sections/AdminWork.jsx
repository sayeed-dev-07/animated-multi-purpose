import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import GlobalWorkModal from '../components/workComponent/GlobalWorkModal';
import WorkCard from '../../components/workComp/workCard';

const AdminWork = () => {
    const [sectionData, setSectionData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'https://backend-updated-topaz.vercel.app/work';

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch work data');
            const resData = await res.json();
            const apiData = resData?.[0];

            setSectionData({
                ...apiData, 
                title: apiData?.title || '',
                des: apiData?.des || '',
                cards: Array.isArray(apiData?.cards) ? apiData.cards : []
            });
        } catch (err) {
            console.error("Fetch error:", err);
            setSectionData({
                title: '',
                des: '',
                cards: []
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!sectionData) return <div className="text-white p-10 animate-pulse">Loading Work Section...</div>;

    return (
        <div className='py-20'>
            {/* Edit Button */}
            <div className='flex items-center justify-center mb-6'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase cursor-pointer text-sm tracking-widest shadow-lg"
                >
                    Edit Work Section
                </button>
            </div>

            {/* Section Header */}
            <div>
                <SectionTitle
                    title={sectionData.title}
                    des={sectionData.des}
                />
            </div>

            {/* Preview Grid */}
            <div className='container mx-auto px-4 py-10 mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 text-white'>
                {sectionData.cards.length > 0 ? (
                    sectionData.cards.map((item, index) => (
                        // Render your existing WorkCard, or just a simple image preview if you prefer
                        <WorkCard key={item.id || index} data={item} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-white/50 py-10">
                        No work samples available.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <GlobalWorkModal
                    fullData={sectionData}
                    onClose={() => setIsModalOpen(false)}
                    refresh={fetchData}
                />
            )}
        </div>
    );
};

export default AdminWork;