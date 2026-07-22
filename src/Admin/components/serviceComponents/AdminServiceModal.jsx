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
const GlobalServiceModal = ({ fullData, onClose, refresh }) => {

    // Guarantee cards is always an array
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

    const currentId = fullData._id || fullData.id;
    const API_URL = `https://backend-updated-topaz.vercel.app/services/${currentId}`;

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
            cards: [...formData.cards, { id: Date.now(), name: '', des: '', imgLink: '', imgAlt: '' }]
        });
        showAlert('info', '✨ New Card Slot Created!');
    };

    const removeCard = (index) => {
        const updatedCards = formData.cards.filter((_, i) => i !== index);
        setFormData({ ...formData, cards: updatedCards });
        showAlert('error', '🗑️ Card removed from list');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title: formData.title,
            des: formData.des,
            cards: formData.cards.map(card => ({
                id: card.id || Date.now(),
                imgLink: card.imgLink || '',
                imgAlt: card.imgAlt || '',
                name: card.name || '',
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
            } catch (parseErr) {
                console.error("Failed to parse response:", text);
            }

            if (res.ok) {
                showAlert('success', '🚀 SECTION UPDATED SUCCESSFULLY!');
                setTimeout(() => {
                    refresh();
                    onClose();
                }, 1500);
            } else {
                console.error("Backend Error Response:", data);
                showAlert('error', data?.message || "Update failed. Check browser console.");
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
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Edit Services</h2>
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
                            placeholder="Section Title"
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
                                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Components</p>
                                <h3 className="text-white font-bold text-xl">Service Cards ({formData.cards.length})</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addCard}
                                className="bg-blue-600 text-white text-[10px] px-6 py-3 rounded-full cursor-pointer font-black hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
                            >
                                + ADD COMPONENT
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.cards.map((card, index) => (
                                <div key={card.id || index} className="relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/20 transition-all group">
                                    <button
                                        type="button"
                                        onClick={() => removeCard(index)}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full text-xs cursor-pointer shadow-xl border-4 border-gray-900 group-hover:scale-110 transition-transform"
                                    >✕</button>

                                    <div className="space-y-4">
                                        <input
                                            value={card.name || ''}
                                            onChange={(e) => handleCardChange(index, 'name', e.target.value)}
                                            placeholder="Component Name"
                                            className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-sm text-white"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                value={card.imgLink || ''}
                                                onChange={(e) => handleCardChange(index, 'imgLink', e.target.value)}
                                                placeholder="Icon URL"
                                                className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-[11px] text-white/70"
                                            />
                                            <input
                                                value={card.imgAlt || ''}
                                                onChange={(e) => handleCardChange(index, 'imgAlt', e.target.value)}
                                                placeholder="Alt Text"
                                                className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-[11px] text-white/70"
                                            />
                                        </div>
                                        <textarea
                                            value={card.des || ''}
                                            onChange={(e) => handleCardChange(index, 'des', e.target.value)}
                                            placeholder="Card Description"
                                            className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-sm text-white h-24"
                                        />
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

export default GlobalServiceModal;