import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import ServiceCard from '../../components/servicesComp/serviceCard';
import GlobalServiceModal from '../components/serviceComponents/AdminServiceModal';

const AdminServices = () => {
    const [sectionData, setSectionData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'https://backend-updated-topaz.vercel.app/services';

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch services data');
            const resData = await res.json();
            const apiData = resData?.[0];
            
            setSectionData({
                ...apiData, // CRITICAL FIX: This grabs the _id and safely stores it!
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

    useEffect(() => { fetchData(); }, []);

    if (!sectionData) return <div className="text-white p-10">Loading Section Data...</div>;

    return (
        <div className='py-20'>
            <div className='flex items-center justify-center mb-6'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase cursor-pointer text-sm tracking-widest shadow-lg"
                >
                    Edit Entire Section
                </button>
            </div>
            
            <div className="">
                <SectionTitle
                    title={sectionData.title}
                    des={sectionData.des}
                />
            </div>

            {/* Preview Grid */}
            <div className='container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-white '>
                {sectionData.cards.map((item, index) => (
                    <ServiceCard key={item.id || index} data={item} />
                ))}
            </div>

            {isModalOpen && (
                <GlobalServiceModal
                    fullData={sectionData}
                    onClose={() => setIsModalOpen(false)}
                    refresh={fetchData}
                />
            )}
        </div>
    );
};

export default AdminServices;