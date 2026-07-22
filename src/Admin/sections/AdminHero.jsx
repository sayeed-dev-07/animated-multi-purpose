/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';


// --- Reusable Alert Component ---
const CustomAlert = ({ type, message, onClose }) => {
    const theme = {
        success: 'bg-green-500/10 border-green-500 text-green-400',
        error: 'bg-red-500/10 border-red-500 text-red-400',
        info: 'bg-blue-500/10 border-blue-500 text-blue-400'
    };

    return (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[250] flex items-center gap-6 px-6 py-4 border rounded-xl shadow-2xl backdrop-blur-md min-w-[300px] justify-between ${theme[type] || theme.info}`}>
            <p className="text-sm font-bold uppercase tracking-widest">{message}</p>
            <button onClick={onClose} className="text-lg hover:scale-125 transition-transform cursor-pointer">✕</button>
        </div>
    );
};

// --- Hero Edit Modal ---
const HeroModal = ({ fullData, onClose, refresh }) => {
    const [formData, setFormData] = useState({
        ...fullData,
        button: fullData.button || { text: '', link: '' }
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const showAlert = (type, message) => setAlert({ show: true, type, message });

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const API_URL = `https://backend-updated-topaz.vercel.app/hero/${fullData._id}`;

    const handleMainChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleButtonChange = (e) => {
        setFormData({
            ...formData,
            button: {
                ...formData.button,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Remove _id and __v (MongoDB versioning) before sending to prevent backend rejection
        const { _id, __v, ...cleanData } = formData;

        try {
            const res = await fetch(API_URL, {
                method: 'PATCH', // Switched to PATCH to match your working AboutUs code
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData),
            });

            if (res.ok) {
                showAlert('success', '✨ HERO SECTION UPDATED!');
                setTimeout(() => {
                    refresh();
                    onClose();
                }, 1500);
            } else {
                const errorData = await res.json();
                showAlert('error', errorData?.message || "Update failed. Check Server.");
            }
        } catch (err) {
            showAlert('error', "Network Error: Could not reach server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-sm p-4">

            {alert.show && (
                <CustomAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            <div className="bg-gray-950 border border-white/10 p-8 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">

                <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white text-2xl cursor-pointer transition-colors">✕</button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Edit Hero Section</h2>
                    <p className="text-blue-500 text-xs mt-1 font-bold tracking-[0.3em]">ADMINSTRATIVE PANEL</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/40 font-black uppercase ml-2">Main Title</label>
                            <input
                                name="title"
                                value={formData.title || ''}
                                onChange={handleMainChange}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="PLAY YOUR IMAGINATION"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-black uppercase ml-2">Subtitle 1</label>
                                <textarea
                                    name="subtitle1"
                                    value={formData.subtitle1 || ''}
                                    onChange={handleMainChange}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white h-24 focus:border-blue-500 outline-none transition-all"
                                    placeholder="MSR Creation present..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-black uppercase ml-2">Subtitle 2</label>
                                <textarea
                                    name="subtitle2"
                                    value={formData.subtitle2 || ''}
                                    onChange={handleMainChange}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white h-24 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Awesome Think..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5 w-full" />

                    <div className="space-y-6">
                        <h3 className="text-white font-black text-lg uppercase tracking-widest">Call to Action Button</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                            <div className="space-y-2">
                                <label className="text-[10px] text-blue-500 font-black uppercase italic ml-2">Button Text</label>
                                <input
                                    name="text"
                                    value={formData.button.text || ''}
                                    onChange={handleButtonChange}
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="OUR OFFER"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-blue-500 font-black uppercase italic ml-2">Button Link (URL)</label>
                                <input
                                    name="link"
                                    value={formData.button.link || ''}
                                    onChange={handleButtonChange}
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 sticky bottom-0 bg-gray-950 pt-6 border-t border-white/10 mt-10">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] cursor-pointer bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all uppercase text-xs tracking-widest disabled:opacity-50 shadow-xl shadow-blue-900/20"
                        >
                            {loading ? 'Syncing...' : 'Update Hero Content'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 text-white/60 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer uppercase text-xs tracking-widest"
                        >
                            Discard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Hero Component (Static) ---
const AdminHero = () => {
    const [heroData, setHeroData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchHeroData = async () => {
        try {
            const response = await fetch('https://backend-updated-topaz.vercel.app/hero');
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();

            if (data && data.length > 0) {
                setHeroData(data[0]);
            } else {
                throw new Error('No data found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroData();
    }, []);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[50vh] text-white'>
                <p className='text-[20px] animate-pulse tracking-[4px] uppercase'>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[50vh] text-red-500'>
                <p className='text-[20px] tracking-[2px]'>Error: {error}</p>
            </div>
        );
    }

    // Advanced Fallback Logic: Uses fallback if string is totally empty OR just spaces
    const titleText = heroData?.title?.trim() ? heroData.title : 'PLAY YOUR IMAGINATION';
    const sub1Text = heroData?.subtitle1?.trim() ? heroData.subtitle1 : 'MSR Creation present Multi Purpose Website Theme';
    const sub2Text = heroData?.subtitle2?.trim() ? heroData.subtitle2 : 'Awesome Think - Awesome Design';
    const btnText = heroData?.button?.text?.trim() ? heroData.button.text : 'our offer';
    const btnLink = heroData?.button?.link?.trim() ? heroData.button.link : 'https://i.pinimg.com/736x/db/1a/04/db1a04df4a5812f454901be48f4aa27e.jpg';

    return (
        <div className="relative w-full min-h-[60vh] flex items-center justify-center flex-col">

            {/* Admin Edit Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-all uppercase cursor-pointer text-sm tracking-widest mt-[5%] shadow-lg"
            >
                Edit Entire Section
            </button>

            {/* Content Container (Added relative z-10 so it sits ABOVE your background image) */}
            <div className='relative z-10 flex px-2 sm:max-w-137.5 max-w-none md:max-w-240 mx-auto text-center sm:py-[10%] py-[15%] font-roboto items-center text-white justify-center flex-col'>

                <p className='font-extrabold leading-[45px] text-[30px] md:text-[48px] uppercase tracking-[6px] font-open-sans'>
                    {titleText}
                </p>

                <div className='relative mt-[49px] mb-[34px]'>
                    <div className='relative sm:w-[224px] w-[160px] md:w-[350px] h-1'>
                        <div className='absolute right-1/2 top-0 h-full w-1/2 origin-right bg-white' />
                        <div className='absolute left-1/2 top-0 h-full w-1/2 origin-left bg-white' />
                    </div>
                    <div className='h-2 absolute -translate-y-1/2 -translate-x-1/2 left-[50%] top-[50%] w-4 bg-white' />
                </div>

                <div>
                    <p className='sm:text-[18px] text-[20px] md:text-[24px] md:leading-[48px] sm:leading-[36px] leading-[40px] mb-[8px] tracking-[3px]'>
                        {sub1Text}
                    </p>
                    <p className='tracking-[3px] text-[14px] sm:text-[12px] md:text-[16px] leading-[32px]'>
                        {sub2Text}
                    </p>
                </div>

                <div className='mt-[73px]'>
                    <Button
                        text={btnText}
                        href={btnLink}
                        className='text-[12px] cursor-pointer tracking-[2px] py-3 px-10 uppercase'
                    />
                </div>
            </div>

            {/* Mount the Modal */}
            {isModalOpen && heroData && (
                <HeroModal
                    fullData={heroData}
                    onClose={() => setIsModalOpen(false)}
                    refresh={fetchHeroData}
                />
            )}
        </div>
    );
};

export default AdminHero;