/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

// --- Alert Component ---
const CustomAlert = ({ type, message, onClose }) => {
    const theme = {
        success: 'bg-green-500/10 border-green-500 text-green-400',
        error: 'bg-red-500/10 border-red-500 text-red-400',
        info: 'bg-blue-500/10 border-blue-500 text-blue-400'
    };

    return (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-6 px-6 py-4 border rounded-xl shadow-2xl backdrop-blur-md min-w-[300px] justify-between ${theme[type] || theme.info}`}>
            <p className="text-sm font-bold uppercase tracking-widest">{message}</p>
            <button onClick={onClose} className="text-lg hover:scale-125 transition-transform cursor-pointer">✕</button>
        </div>
    );
};

// --- Main Modal ---
const GlobalTeamModal = ({ fullData, onClose, refresh }) => {
    
    const [formData, setFormData] = useState({
        ...fullData,
        cards: fullData.cards || []
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // Safely grab the ID that was passed down from the parent
    const currentId = fullData._id || fullData.id;
    const API_URL = `https://backend-updated-topaz.vercel.app/teams/${currentId}`;

    const handleHeaderChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (index, field, value) => {
        const updatedCards = [...formData.cards];
        updatedCards[index] = { ...updatedCards[index], [field]: value };
        setFormData({ ...formData, cards: updatedCards });
    };

    const addCard = () => {
        setFormData({
            ...formData,
            cards: [...formData.cards, { id: Date.now(), name: '', position: '', imgLink: '', social: '' }]
        });
        showAlert('info', '✨ New Team Member Slot Created!');
    };

    const removeCard = (index) => {
        const updatedCards = formData.cards.filter((_, i) => i !== index);
        setFormData({ ...formData, cards: updatedCards });
        showAlert('error', '🗑️ Team Member removed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentId) {
            showAlert('error', 'CRITICAL ERROR: No Database ID found!');
            return; 
        }

        setLoading(true);

        // Map payload strictly to avoid Mongoose validation crashes
        const payload = {
            title: formData.title,
            des: formData.des,
            cards: formData.cards.map(card => ({
                id: card.id || Date.now(),
                name: card.name || '',
                position: card.position || '',
                imgLink: card.imgLink || '',
                social: card.social || ''
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
            } catch (parseErr) {
                console.error("Failed to parse response:", text);
            }

            if (res.ok) {
                showAlert('success', '🚀 TEAM UPDATED SUCCESSFULLY!');
                setTimeout(() => {
                    refresh();
                    onClose();
                }, 1500);
            } else {
                console.error("Backend Error Response:", data); 
                showAlert('error', data?.message || "Update failed. Check console.");
            }
        } catch (err) {
            console.error("Network Error:", err);
            showAlert('error', "Network Error: Could not reach server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4">

            {alert.show && (
                <CustomAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/30 hover:text-white text-2xl cursor-pointer transition-colors"
                >
                    ✕
                </button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Edit Team Section</h2>
                    <p className="text-white/40 text-xs mt-1 tracking-widest">CONFIGURATION PANEL</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* SECTION HEADER */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/5 space-y-5">
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Global Content</p>
                        <input
                            name="title"
                            value={formData.title || ''}
                            onChange={handleHeaderChange}
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="Section Title (e.g., TEAM MEMBER)"
                        />
                        <textarea
                            name="des"
                            value={formData.des || ''}
                            onChange={handleHeaderChange}
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white h-24 focus:border-blue-500 outline-none transition-all"
                            placeholder="Section Description"
                        />
                    </div>

                    {/* CARDS MANAGEMENT */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                            <div>
                                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Roster</p>
                                <h3 className="text-white font-bold text-xl">Team Members ({formData.cards.length})</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addCard}
                                className="bg-blue-600 text-white text-[10px] px-6 py-3 rounded-full cursor-pointer font-black hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
                            >
                                + ADD MEMBER
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.cards.map((card, index) => (
                                <div key={card.id || index} className="relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/20 transition-all group flex flex-col gap-4">
                                    <button
                                        type="button"
                                        onClick={() => removeCard(index)}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full text-xs cursor-pointer shadow-xl border-4 border-gray-900 group-hover:scale-110 transition-transform z-10"
                                    >✕</button>

                                    <div className="flex gap-4">
                                        {/* Avatar Preview */}
                                        <div className="w-20 h-20 shrink-0 bg-black rounded-full overflow-hidden border border-white/10 flex items-center justify-center">
                                            {card.imgLink ? (
                                                <img src={card.imgLink} alt="preview" className="w-full h-full object-cover opacity-80" />
                                            ) : (
                                                <span className="text-[8px] text-white/30 text-center uppercase font-bold px-1">No Image</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 space-y-3">
                                            <input
                                                value={card.name || ''}
                                                onChange={(e) => handleCardChange(index, 'name', e.target.value)}
                                                placeholder="Member Name"
                                                className="w-full bg-black/40 border border-white/5 p-2 rounded-lg text-sm text-white font-bold"
                                            />
                                            <input
                                                value={card.position || ''}
                                                onChange={(e) => handleCardChange(index, 'position', e.target.value)}
                                                placeholder="Job Role / Position"
                                                className="w-full bg-black/40 border border-white/5 p-2 rounded-lg text-xs text-blue-400 uppercase tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-white/40 font-bold uppercase ml-1">Avatar Image URL</label>
                                            <input
                                                value={card.imgLink || ''}
                                                onChange={(e) => handleCardChange(index, 'imgLink', e.target.value)}
                                                placeholder="/images/tMemberImg/..."
                                                className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-[10px] text-white/70"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-white/40 font-bold uppercase ml-1">Social Link</label>
                                            <input
                                                value={card.social || ''}
                                                onChange={(e) => handleCardChange(index, 'social', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-[10px] text-white/70"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FORM ACTIONS */}
                    <div className="flex gap-4 sticky bottom-0 bg-gray-900 pt-6 border-t border-white/10 mt-10">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] cursor-pointer bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-400 hover:text-white transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Pushing Changes...' : 'Save Configuration'}
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

export default GlobalTeamModal;