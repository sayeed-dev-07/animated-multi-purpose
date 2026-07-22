/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

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

const AboutUsModal = ({ fullData, onClose, refresh }) => {
    // Initialize state, ensuring cards is always an array
    const [formData, setFormData] = useState({
        ...fullData,
        cards: fullData.cards || []
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

    // Safely grab ID
    const currentId = fullData._id || fullData.id;
    const API_URL = `https://backend-updated-topaz.vercel.app/about/${currentId}`;

    const handleMainChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (index, field, value) => {
        const updatedCards = [...formData.cards];
        updatedCards[index] = { ...updatedCards[index], [field]: value };
        setFormData({ ...formData, cards: updatedCards });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentId) {
            showAlert('error', 'CRITICAL ERROR: No Database ID found!');
            return;
        }

        setLoading(true);

        // Map payload precisely to prevent Mongoose validation errors
        const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            imgLink: formData.imgLink,
            cards: formData.cards.map(card => ({
                id: card.id || Date.now(),
                title: card.title || '',
                des: card.des || ''
            }))
        };

        try {
            const res = await fetch(API_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("Failed to parse", text);
            }

            if (res.ok) {
                showAlert('success', '✨ ABOUT SECTION UPDATED!');
                setTimeout(() => {
                    refresh();
                    onClose();
                }, 1500);
            } else {
                console.error("Backend error:", data);
                showAlert('error', data?.message || "Update failed. Check console.");
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

            <div className="bg-gray-950 border border-white/10 p-8 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">

                <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white text-2xl cursor-pointer transition-colors">✕</button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Edit About Us</h2>
                    <p className="text-blue-500 text-xs mt-1 font-bold tracking-[0.3em]">ADMINSTRATIVE PANEL</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* TOP LEVEL DATA */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-black uppercase ml-2">Section Title</label>
                                <input
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleMainChange}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. About Us"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-black uppercase ml-2">Subtitle / Intro</label>
                                <textarea
                                    name="subtitle"
                                    value={formData.subtitle || ''}
                                    onChange={handleMainChange}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white h-24 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Brief introduction text..."
                                />
                            </div>
                        </div>

                        {/* IMAGE PREVIEW & LINK */}
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4">
                            <label className="text-[10px] text-blue-500 font-black uppercase italic">Hero Image</label>
                            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                                {formData.imgLink ? (
                                    <img src={formData.imgLink} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Image Provided</div>
                                )}
                            </div>
                            <input
                                name="imgLink"
                                value={formData.imgLink || ''}
                                onChange={handleMainChange}
                                className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-[11px] text-white focus:border-blue-500 outline-none"
                                placeholder="Paste Image URL here"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/5 w-full" />

                    {/* CARDS (COMPANY & MISSION) */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black text-lg uppercase tracking-widest">Detail Cards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.cards.map((card, index) => (
                                <div key={card.id || index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                    <p className="text-blue-500 text-[10px] font-black">CARD {index + 1}</p>
                                    <input
                                        value={card.title || ''}
                                        onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                                        placeholder="Card Title (e.g. MISSION)"
                                        className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-sm text-white font-bold"
                                    />
                                    <textarea
                                        value={card.des || ''}
                                        onChange={(e) => handleCardChange(index, 'des', e.target.value)}
                                        placeholder="Detailed description..."
                                        className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-xs text-white/70 h-32 leading-relaxed"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 sticky bottom-0 bg-gray-950 pt-6 border-t border-white/10 mt-10">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] cursor-pointer bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all uppercase text-xs tracking-widest disabled:opacity-50 shadow-xl shadow-blue-900/20"
                        >
                            {loading ? 'Syncing...' : 'Update About Content'}
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

export default AboutUsModal;