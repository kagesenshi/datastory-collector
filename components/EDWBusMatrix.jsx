import React from 'react';
import { ArrowLeft, Check, Grid } from 'lucide-react';

const EDWBusMatrix = ({ stories, setView }) => {
    // Collect all unique dimensions from all stories
    const allDimensions = Array.from(new Set(
        stories.flatMap(s => s.dimensions || [])
    )).sort();

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-6">
                <div>
                    <button
                        onClick={() => setView('manage')}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4 transition-colors text-sm uppercase tracking-wider"
                    >
                        <ArrowLeft size={16} /> Back to Collection
                    </button>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                        <Grid size={32} className="text-indigo-600" />
                        EDW Bus Matrix
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        Dimensional analysis intersecting User Stories with identified Dimensions.
                    </p>
                </div>
            </div>

            {stories.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <Grid className="mx-auto text-slate-200 mb-6" size={64} />
                    <p className="text-slate-400 font-black text-xl tracking-tight uppercase">No data available for matrix</p>
                    <p className="text-slate-400 mt-2 font-medium">Add stories to generate the bus matrix.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-1 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 border-b border-r border-slate-200 bg-slate-50/50 text-slate-900 font-black uppercase text-xs tracking-widest w-[350px] min-w-[350px] max-w-[350px] sticky left-0 z-20 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.05)]">
                                        User Story
                                    </th>
                                    {allDimensions.map(dim => (
                                        <th key={dim} className="p-4 border-b border-r border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap bg-white align-bottom relative group hover:bg-slate-50 transition-colors">
                                            <div className="writing-vertical-lr h-40 text-center w-8 flex items-center justify-center mx-auto mb-2">
                                                {dim}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stories.map(story => (
                                    <tr key={story.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6 bg-white group-hover:bg-slate-50/50 transition-colors border-r border-slate-200 sticky left-0 z-10 w-[350px] min-w-[350px] max-w-[350px] shadow-[4px_0_24px_-2px_rgba(0,0,0,0.05)]">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 uppercase tracking-wider">
                                                        #{String(story.id).slice(-4)}
                                                    </div>
                                                </div>

                                                <div className="text-sm leading-7 font-medium text-slate-500 font-sans">
                                                    <span>As a </span>
                                                    <span className="text-slate-900 font-bold">
                                                        {story.userRole || 'Product Manager'}
                                                    </span>
                                                    <span>, I want to </span>
                                                    <span className="text-indigo-600 font-bold">{story.action} </span>
                                                    <span> showing </span>
                                                    {story.metrics && story.metrics.length > 0 ? (
                                                        <span className="text-slate-900 font-bold">{story.metrics.join(', ')}</span>
                                                    ) : (
                                                        <span className="text-slate-400"> ... </span>
                                                    )}
                                                    <span> over </span>
                                                    {story.dimensions && story.dimensions.length > 0 ? (
                                                        <span className="text-slate-900 font-bold">{story.dimensions.join(', ')}</span>
                                                    ) : (
                                                        <span className="text-slate-400"> ... </span>
                                                    )}
                                                    <span>...</span>
                                                </div>
                                            </div>
                                        </td>
                                        {allDimensions.map(dim => {
                                            const hasDimension = story.dimensions && story.dimensions.includes(dim);
                                            return (
                                                <td key={`${story.id}-${dim}`} className="p-4 text-center border-r border-slate-100 relative">
                                                    {/* Hover highlight for column */}
                                                    <div className="absolute inset-y-0 -left-[1px] -right-[1px] bg-indigo-50/0 group-hover:bg-indigo-50/30 pointer-events-none transition-colors"></div>

                                                    {hasDimension ? (
                                                        <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200 ring-2 ring-white">
                                                            <Check size={18} strokeWidth={4} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-100 mx-auto opacity-50 text-slate-200">
                                                            &middot;
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EDWBusMatrix;
