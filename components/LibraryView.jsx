import React from 'react';
import { X, BarChart3, Layers, Database, ListFilter } from 'lucide-react';

const LibraryView = ({ globalSuggestions, setView }) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div className="flex justify-between items-center border-b pb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Master Data Library</h2>
                    <p className="text-slate-500 mt-1 font-medium italic">Shared system definitions for architectural consistency.</p>
                </div>
                <button onClick={() => setView('wizard')} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <X size={24} className="text-slate-600" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(globalSuggestions).map(([category, items]) => (
                    <div key={category} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                {category === 'metrics' ? <BarChart3 size={20} /> : category === 'dimensions' ? <Layers size={20} /> : category === 'sources' ? <Database size={20} /> : <ListFilter size={20} />}
                            </div>
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-lg">{category}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {items.length > 0 ? items.map((item, idx) => (
                                <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-100 shadow-sm">
                                    {item}
                                </span>
                            )) : <p className="text-slate-400 text-sm italic">No entries yet.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryView;
