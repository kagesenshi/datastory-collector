import React from 'react';
import { Code } from 'lucide-react';

const LiveLogicPreview = ({ userProfile, currentStory }) => {
    return (
        <div className="w-full xl:w-[450px] bg-slate-50 border-t xl:border-l xl:border-t-0 border-slate-200 p-8 shrink-0 flex flex-col justify-center">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-lg leading-relaxed font-medium text-slate-400 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Live Logic Preview</span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
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
