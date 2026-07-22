import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';

import GlobalPriceModal from '../components/priceComponent/GlobalPriceModal';
import PriceCard from '../../components/priceComp/PriceCard';



const AdminPrice = () => {
    const [sectionData, setSectionData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Make sure this matches your exact backend endpoint!
    const API_URL = 'https://backend-updated-topaz.vercel.app/slideshowData';

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch pricing data');
            const resData = await res.json();
            const apiData = resData?.[0];

            setSectionData({
                ...apiData, // CRITICAL: Preserves the MongoDB _id
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

    if (!sectionData) return <div className="text-white p-10 animate-pulse">Loading Pricing Section...</div>;

    return (
        <div className='py-20'>
            {/* Edit Button */}
            <div className='flex items-center justify-center mb-6'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase cursor-pointer text-sm tracking-widest shadow-lg"
                >
                    Edit Pricing Section
                </button>
            </div>

            {/* Section Header */}
            <div>
                <SectionTitle
                    title={sectionData.title || 'PRODUCT PRICE'}
                    des={sectionData.des || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Integer.'}
                />
            </div>

            {/* Preview Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 mt-[82px] gap-x-[20px] gap-y-10 justify-items-center'>
                {sectionData.cards.length > 0 ? (
                    sectionData.cards.map((item, index) => (
                        // Shows your actual PriceCard design in the admin panel
                        <PriceCard key={item.id || index} data={item} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-white/50 py-10">
                        No pricing plans available.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <GlobalPriceModal
                    fullData={sectionData}
                    onClose={() => setIsModalOpen(false)}
                    refresh={fetchData}
                />
            )}
        </div>
    );
};

export default AdminPrice;