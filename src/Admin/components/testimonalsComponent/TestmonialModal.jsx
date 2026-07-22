/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const CustomAlert = ({ type, message, onClose }) => {
    const theme = {
        success: 'bg-green-500/10 border-green-500 text-green-400',
        error: 'bg-red-500/10 border-red-500 text-red-400',
        info: 'bg-blue-500/10 border-blue-500 text-blue-400'
    };
    return (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-6 px-6 py-4 border rounded-xl shadow-2xl backdrop-blur-md min-w-[300px] justify-between ${theme[type]}`}>
            <p className="text-xs font-black uppercase tracking-widest">{message}</p>
            <button onClick={onClose} className="hover:scale-125 transition-transform cursor-pointer">✕</button>
        </div>
    );
};

const GlobalTestimonialModal = ({ fullData, onClose, refresh }) => {
    const [formData, setFormData] = useState({ ...fullData });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const API_URL = `https://backend-updated-topaz.vercel.app/testimonials/${fullData._id}`;

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    const handleHeaderChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (index, field, value) => {
        const updatedCards = [...formData.testimonials];
        updatedCards[index] = { ...updatedCards[index], [field]: value };
        setFormData({ ...formData, testimonials: updatedCards });
    };

    const addCard = () => {
        setFormData({
            ...formData,
            testimonials: [...formData.testimonials, { name: '', position: '', testimonial: '', imgLink: '' }]
        });
        showAlert('info', '✨ New Testimonial Slot Added');
    };

    const removeCard = (index) => {
        const updatedCards = formData.testimonials.filter((_, i) => i !== index);
        setFormData({ ...formData, testimonials: updatedCards });
        showAlert('error', '🗑️ Testimonial removed from list');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { _id, ...cleanData } = formData;

        try {
            const res = await fetch(API_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData),
            });

            if (res.ok) {
                showAlert('success', '🚀 Section Updated Successfully!');
                setTimeout(() => { refresh(); onClose(); }, 1500);
            } else {
                showAlert('error', 'Failed to save changes');
            }
        } catch (err) {
            showAlert('error', 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4">
            {alert.show && <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}

            <div className="bg-gray-900 border border-white/20 p-8 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">

                <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white text-2xl cursor-pointer">✕</button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Testimonial Engine</h2>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Master Configuration</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* SECTION HEADER EDIT */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/5 space-y-4">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Global Content</p>
                        <input
                            name="title"
                            value={formData.title || ''}
                            onChange={handleHeaderChange}
                            placeholder="Section Title"
                            className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
                        />
                        <textarea
                            name="subtitle"
                            value={formData.subtitle || ''}
                            onChange={handleHeaderChange}
                            placeholder="Section Description"
                            className="w-full bg-black border border-white/10 p-4 rounded-xl text-white h-24 outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* TESTIMONIAL CARDS EDIT */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h3 className="text-white font-bold text-xl px-2">People & Quotes ({formData.testimonials.length})</h3>
                            <button type="button" onClick={addCard} className="bg-blue-600 text-white text-[10px] px-6 py-3 rounded-full cursor-pointer font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                                + ADD NEW PERSON
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.testimonials.map((card, index) => (
                                <div key={index} className="relative p-6 bg-black border border-white/5 rounded-2xl group">
                                    <button
                                        type="button"
                                        onClick={() => removeCard(index)}
                                        className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full text-xs cursor-pointer shadow-xl transition-transform hover:scale-110"
                                    >✕</button>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                value={card.name}
                                                onChange={(e) => handleCardChange(index, 'name', e.target.value)}
                                                placeholder="Name"
                                                className="bg-gray-800/50 p-3 rounded-lg text-sm text-white outline-none"
                                            />
                                            <input
                                                value={card.position}
                                                onChange={(e) => handleCardChange(index, 'position', e.target.value)}
                                                placeholder="Position"
                                                className="bg-gray-800/50 p-3 rounded-lg text-sm text-white outline-none"
                                            />
                                        </div>
                                        <input
                                            value={card.imgLink}
                                            onChange={(e) => handleCardChange(index, 'imgLink', e.target.value)}
                                            placeholder="Avatar Image URL"
                                            className="w-full bg-gray-800/50 p-3 rounded-lg text-[11px] text-white/50 outline-none"
                                        />
                                        <textarea
                                            value={card.testimonial}
                                            onChange={(e) => handleCardChange(index, 'testimonial', e.target.value)}
                                            placeholder="Quote Content"
                                            className="w-full bg-gray-800/50 p-3 rounded-lg text-sm text-white h-24 outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SAVE BUTTONS */}
                    <div className="flex gap-4 sticky bottom-0 bg-gray-900 pt-6 border-t border-white/10">
                        <button disabled={loading} type="submit" className="flex-[2] cursor-pointer bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase text-xs tracking-widest">
                            {loading ? 'Processing...' : 'Save All Changes'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 text-white/60 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer uppercase text-xs tracking-widest">
                            Discard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GlobalTestimonialModal;