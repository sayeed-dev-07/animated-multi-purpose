import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import TeamCard from '../../components/teamComp/teamCard';
import GlobalTeamModal from '../components/teamComponents/GlobalTeamModal';


const AdminTeam = () => {
    const [sectionData, setSectionData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'https://backend-updated-topaz.vercel.app/teams';

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch team data');
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

    if (!sectionData) return <div className="text-white p-10 animate-pulse">Loading Team Section...</div>;

    return (
        <div className='py-20'>
            {/* Edit Button */}
            <div className='flex items-center justify-center mb-6'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase cursor-pointer text-sm tracking-widest shadow-lg"
                >
                    Edit Team Section
                </button>
            </div>

            {/* Section Header */}
            <div>
                <SectionTitle
                    title={sectionData.title || 'TEAM MEMBER'}
                    des={sectionData.des || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Integer.'}
                />
            </div>

            {/* Preview Grid */}
            <div className='grid md:grid-cols-4 sm:gap-y-11.5 sm:grid-cols-2 grid-cols-1 py-25 md:gap-x-5 sm:gap-x-11.25 justify-center place-items-center gap-y-12.5'>
                {sectionData.cards.length > 0 ? (
                    sectionData.cards.map((item, index) => (
                        <TeamCard key={item.id || index} data={item} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-white/50 py-10">
                        No team members available.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <GlobalTeamModal
                    fullData={sectionData}
                    onClose={() => setIsModalOpen(false)}
                    refresh={fetchData}
                />
            )}
        </div>
    );
};

export default AdminTeam;