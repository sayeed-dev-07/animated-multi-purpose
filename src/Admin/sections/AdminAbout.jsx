import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Loading';
import AboutUsModal from '../components/aboutComponents/AboutModal';

const AdminAbout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(null); // Changed to null for accurate loading state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getData = async () => {
        try {
            const res = await fetch('https://backend-updated-topaz.vercel.app/about');
            const resData = await res.json();
            const apiData = resData?.[0] || {};
            
            setData({
                ...apiData, // CRITICAL FIX: This keeps the _id intact!
                title: apiData.title || '',
                subtitle: apiData.subtitle || '',
                imgLink: apiData.imgLink || '',
                cards: Array.isArray(apiData.cards) ? apiData.cards : []
            });
        } catch (error) {
            setError(error.message);
            setData({ title: '', subtitle: '', imgLink: '', cards: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading || !data) return <Spinner />;
    if (error) return <div className="py-40 text-center text-red-500">Error: {error}</div>;

    return (
        <div className='text-white py-20 overflow-hidden md:text-start text-center relative'>

            {/* edit button  */}
            <div className='flex justify-center mb-8'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase cursor-pointer text-sm tracking-widest shadow-lg"
                >
                    Edit Entire Section
                </button>
            </div>

            <div className='flex flex-col gap-y-[18px] items-center '>
                <p className='text-center tracking-[6px] font-extrabold text-header font-open-sans uppercase'>
                    {data.title || 'About Us'}
                </p>
                <div className='w-[150px] overflow-hidden'>
                    <div className='w-full h-px bg-white/60' />
                </div>
                <p className='text-secondary'>
                    {data.subtitle || 'Loading description...'}
                </p>
            </div>

            <div className="grid mt-[86px] items-center justify-center grid-cols-1 md:grid-cols-2 gap-x-[74px] gap-y-[42px]">
                <div className="order-1 md:order-2">
                    <div className='flex flex-col gap-y-5'>
                        <p className='text-[20px] font-bold font-open-sans'>{data.cards?.[0]?.title || 'COMPANY'}</p>
                        <p className='text-secondary leading-5.25'>
                            {data.cards?.[0]?.des || 'Loading company description...'}
                        </p>
                    </div>
                </div>

                <div className="order-2 flex items-center justify-center overflow-hidden md:order-1 md:row-span-2">
                    <img className='w-fit will-change-transform' src={data.imgLink || "/images/aboutImg/pcImg.jpg"} alt="About" />
                </div>

                <div className="order-3 md:order-3">
                    <div className='flex flex-col gap-y-5'>
                        <p className='text-[20px] font-bold font-open-sans'>{data.cards?.[1]?.title || 'MISSION & VISION'}</p>
                        <p className='text-secondary leading-5.25'>
                            {data.cards?.[1]?.des || 'Loading mission and vision description...'}
                        </p>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <AboutUsModal
                    fullData={data}
                    onClose={() => setIsModalOpen(false)}
                    refresh={getData}
                />
            )}
        </div>
    );
};

export default AdminAbout;