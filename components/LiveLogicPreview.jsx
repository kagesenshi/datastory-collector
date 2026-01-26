import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const LiveLogicPreview = ({ userProfile, currentStory }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`w-full xl:w-[450px] bg-slate-50 border-t xl:border-l xl:border-t-0 border-slate-200 shrink-0 flex flex-col transition-all ${isExpanded ? 'p-4 md:p-8' : 'p-0 xl:p-8'}`}>
            <div className={`bg-slate-900 transition-all duration-300 shadow-2xl relative overflow-hidden text-lg leading-relaxed font-medium text-slate-400 font-sans sticky top-8 ${isExpanded ? 'rounded-[2.5rem] p-6 md:p-10' : 'rounded-none p-4 cursor-pointer hover:bg-slate-800 xl:rounded-[2.5rem] xl:p-10 xl:cursor-default xl:hover:bg-slate-900'}`} onClick={() => !isExpanded && setIsExpanded(true)}>
                {/* Header */}
                <div
                    className={`flex items-center justify-between xl:pointer-events-none ${isExpanded ? 'mb-4 md:mb-10 cursor-pointer' : 'mb-0 xl:mb-10'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] ${isExpanded ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Data Story Preview</span>
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors p-1 xl:hidden">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                </div>

                {/* Content */}
                <div className={`space-y-8 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden xl:opacity-100 xl:max-h-[1000px] xl:overflow-visible'}`}>
                    <div>
                        <span className="">As a </span>
                        <span className={`${userProfile.role ? 'text-white font-bold' : 'text-slate-600 decoration-slate-700 underline decoration-dashed underline-offset-4 decoration-2'}`}>
                            {userProfile.role || 'Product Manager'}
                        </span>
                        <span className=""> , </span>
                        <span className="">I want to </span>
                        <span className="text-blue-400 font-bold">{currentStory.action} </span>
                        <span className=""> showing </span>
                        {currentStory.metrics.length > 0 ? (
                            <span className="text-white font-bold">{currentStory.metrics.join(', ')}</span>
                        ) : (
                            <span className="text-slate-600"> ______ </span>
                        )}
                        <span className=""> over </span>
                        {currentStory.dimensions.length > 0 ? (
                            <span className="text-white font-bold">{currentStory.dimensions.join(', ')}</span>
                        ) : (
                            <span className="text-slate-600"> ______ </span>
                        )}
                        {currentStory.granularity && (
                            <>
                                <span className=""> at </span>
                                <span className="text-white font-bold">{currentStory.granularity}</span>
                                <span className=""> granularity</span>
                            </>
                        )}
                        <span className="">, </span>
                        <span className="">filterable by </span>
                        {currentStory.filters.length > 0 ? (
                            <span className="text-white font-bold">{currentStory.filters.join(', ')}</span>
                        ) : (
                            <span className="text-slate-600"> ______ </span>
                        )}
                        <span className=""> , </span>
                        <span className=""> updated </span>
                        <span className="text-white font-bold">{currentStory.frequency}</span>
                        <span className=""> , </span>
                        <span className=""> so that </span>
                        {currentStory.value ? (
                            <span className="text-white font-bold">{currentStory.value}</span>
                        ) : (
                            <span className="text-slate-600">______</span>
                        )}
                        <span className="">.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveLogicPreview;
