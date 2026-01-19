import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import MultiInput from './MultiInput';

const Wizard = ({
    step,
    userProfile,
    handleProfileChange,
    currentStory,
    setCurrentStory,
    tempInputs,
    setTempInputs,
    addItem,
    removeItem,
    globalSuggestions,
    saveStory,
    editingId
}) => {
    switch (step) {
        case 0:
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 1: Ownership</h2>
                        <p className="text-slate-500 font-medium italic">Attribute this requirement to the lead stakeholder.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input name="fullName" value={userProfile.fullName} onChange={handleProfileChange} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Jane Smith" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Corporate Email</label>
                            <input name="email" value={userProfile.email} onChange={handleProfileChange} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="jane@enterprise.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone</label>
                            <input name="phone" value={userProfile.phone} onChange={handleProfileChange} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Functional Role</label>
                            <input name="role" value={userProfile.role} onChange={handleProfileChange} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Analytics Lead" />
                        </div>
                    </div>
                </div>
            );
        case 1:
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 2: Consumption</h2>
                        <p className="text-slate-500 font-medium italic">Define the end-state visibility for the data requirement.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {['view an interactive dashboard', 'generate a scheduled PDF report', 'download raw data in Excel', 'access via self-service BI (Power BI/Tableau)', 'receive automated Slack/Email alerts'].map((opt) => (
                            <button key={opt} onClick={() => setCurrentStory({ ...currentStory, action: opt })} className={`text-left p-5 rounded-2xl border-2 transition-all shadow-sm ${currentStory.action === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-black' : 'border-slate-100 hover:border-indigo-200 bg-white text-slate-600 font-bold'}`}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 2:
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 3: Metrics</h2>
                        <p className="text-slate-500 font-medium italic">Quantifiable values stored in the library will be suggested.</p>
                    </div>
                    <MultiInput label="Primary Metrics" field="metrics" placeholder="Search or add metrics..." tempInputs={tempInputs} setTempInputs={setTempInputs} addItem={addItem} removeItem={removeItem} currentItems={currentStory.metrics} suggestions={globalSuggestions.metrics} />
                </div>
            );
        case 3:
            return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 4: Dimensions</h2>
                        <p className="text-slate-500 font-medium italic">Define the attributes used to slice and filter the metrics.</p>
                    </div>
                    <div className="space-y-6">
                        <MultiInput label="Breakdown Dimensions" field="dimensions" placeholder="e.g. Region, Product" tempInputs={tempInputs} setTempInputs={setTempInputs} addItem={addItem} removeItem={removeItem} currentItems={currentStory.dimensions} suggestions={globalSuggestions.dimensions} />
                        <MultiInput label="Dynamic Filters" field="filters" placeholder="e.g. Date Range, Segment" tempInputs={tempInputs} setTempInputs={setTempInputs} addItem={addItem} removeItem={removeItem} currentItems={currentStory.filters} suggestions={globalSuggestions.filters} />
                    </div>
                </div>
            );
        case 4:
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 5: SLA & Impact</h2>
                        <p className="text-slate-500 font-medium italic">Critical for prioritizing data pipeline development.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Refresh SLA</label>
                            <select className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold" value={currentStory.frequency} onChange={(e) => setCurrentStory({ ...currentStory, frequency: e.target.value })}>
                                <option>Real-time</option><option>Hourly</option><option>Daily</option><option>Weekly</option><option>Monthly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Value Narrative</label>
                            <textarea className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-32 font-medium leading-relaxed" placeholder="so that I can..." value={currentStory.value} onChange={(e) => setCurrentStory({ ...currentStory, value: e.target.value })} />
                        </div>
                    </div>
                </div>
            );
        case 5:
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 6: Source Systems</h2>
                        <p className="text-slate-500 font-medium italic">Map the story to the technical landscape.</p>
                    </div>
                    <MultiInput label="Source Systems" field="sources" placeholder="Identify source platforms..." tempInputs={tempInputs} setTempInputs={setTempInputs} addItem={addItem} removeItem={removeItem} currentItems={currentStory.sources} suggestions={globalSuggestions.sources} />
                    <div className="pt-6">
                        <button onClick={saveStory} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95">
                            <CheckCircle2 size={24} />
                            {editingId ? 'Refine Collector Entry' : 'Add to Collection'}
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
};

export default Wizard;
