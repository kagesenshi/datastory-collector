import React from 'react';
import { User, Mail, Phone, Briefcase, CheckCircle2, Building2, MapPin, Layers } from 'lucide-react';

const UserProfileModal = ({ profile, onChange, onSave, isOpen }) => {
    if (!isOpen) return null;

    const isComplete = profile.fullName && profile.email && profile.role && profile.department && profile.company && profile.systemModule;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-br from-indigo-50 to-slate-50 border-b border-slate-100">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-[1.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 mb-4 group transition-transform hover:scale-105">
                        <User size={28} className="group-hover:animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-1">Tell us about you</h2>
                    <p className="text-slate-400 text-sm font-medium italic">Welcome to DataStory. Please tell us who you are to begin.</p>
                </div>

                <div className="p-8 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                <User size={12} className="text-indigo-400" /> Full Name
                            </label>
                            <input
                                name="fullName"
                                value={profile.fullName}
                                onChange={onChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                                placeholder="Jane Smith"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                <Mail size={12} className="text-indigo-400" /> Corporate Email
                            </label>
                            <input
                                name="email"
                                value={profile.email}
                                onChange={onChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                                placeholder="jane@enterprise.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                <Phone size={12} className="text-indigo-400" /> Phone
                            </label>
                            <input
                                name="phone"
                                value={profile.phone}
                                onChange={onChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                                placeholder="+1..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                <Briefcase size={12} className="text-indigo-400" /> Role
                            </label>
                            <input
                                name="role"
                                value={profile.role}
                                onChange={onChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                                placeholder="Manager"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                <Building2 size={12} className="text-indigo-400" /> Department
                            </label>
                            <input
                                name="department"
                                value={profile.department}
                                onChange={onChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                                placeholder="Marketing"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                <MapPin size={12} className="text-indigo-400" /> Company
                            </label>
                            <input
                                name="company"
                                value={profile.company}
                                onChange={onChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                            <Layers size={12} className="text-indigo-400" /> System Module
                        </label>
                        <input
                            name="systemModule"
                            value={profile.systemModule}
                            onChange={onChange}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold transition-all placeholder:text-slate-300"
                            placeholder="Finance, HR, etc."
                        />
                    </div>

                    <button
                        onClick={onSave}
                        disabled={!isComplete}
                        className={`w-full mt-2 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all ${isComplete
                            ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 hover:bg-slate-900 active:scale-95'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <CheckCircle2 size={18} /> Complete Setup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
