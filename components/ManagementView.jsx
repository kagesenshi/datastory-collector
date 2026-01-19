import React from 'react';
import { Plus, FileText, Trash2, Edit3 } from 'lucide-react';

const ManagementView = ({ stories, setView, setEditingId, setStep, startEditStory, setStories }) => {
    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex justify-between items-center border-b pb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Collected DataStories</h2>
                    <p className="text-slate-500 mt-1 font-medium italic">Consolidated requirements for the Data Warehouse backlog.</p>
                </div>
                <button onClick={() => { setEditingId(null); setView('wizard'); setStep(1); }} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                    <Plus size={20} /> Capture New Story
                </button>
            </div>

            {stories.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <FileText className="mx-auto text-slate-200 mb-6" size={64} />
                    <p className="text-slate-400 font-black text-xl tracking-tight uppercase">Backlog is currently empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {stories.map((s) => (
                        <div key={s.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-slate-800 truncate max-w-lg leading-tight">As a {s.userRole}, I want to {s.action}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Persona: {s.submittedBy} • {s.timestamp}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditStory(s)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100" title="Edit Story"><Edit3 size={18} /></button>
                                    <button onClick={() => setStories(stories.filter(i => i.id !== s.id))} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100" title="Delete Story"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-400 font-black mb-1.5 uppercase tracking-widest text-[9px]">KPIs</p>
                                    <p className="text-slate-800 font-bold leading-tight">{s.metrics.join('; ')}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-400 font-black mb-1.5 uppercase tracking-widest text-[9px]">Granularity</p>
                                    <p className="text-slate-800 font-bold leading-tight">{s.dimensions.join(', ')}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-400 font-black mb-1.5 uppercase tracking-widest text-[9px]">Freshness</p>
                                    <p className="text-slate-800 font-bold leading-tight uppercase">{s.frequency}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-400 font-black mb-1.5 uppercase tracking-widest text-[9px]">Sources</p>
                                    <p className="text-slate-800 font-bold leading-tight">{s.sources.join(', ') || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManagementView;
