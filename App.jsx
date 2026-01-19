import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Download,
    FileText,
    Database,
    User,
    BarChart3,
    Layers,
    Clock,
    CheckCircle2,
    Mail,
    Phone,
    Edit3,
    ListFilter,
    History,
    BookOpen,
    Search,
    X,
    Code
} from 'lucide-react';

/**
 * MultiInput with Immediate Suggestions
 * Shows suggestions on focus/click even if empty.
 */
const MultiInput = ({
    label,
    field,
    placeholder,
    tempInputs,
    setTempInputs,
    addItem,
    removeItem,
    currentItems,
    suggestions = []
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const fieldKey = field.slice(0, -1);
    const inputValue = tempInputs[fieldKey] || '';

    const filteredSuggestions = suggestions.filter(s => {
        const isNotSelected = !currentItems.some(item => item.toLowerCase() === s.toLowerCase());
        const matchesInput = s.toLowerCase().includes(inputValue.toLowerCase());
        return isNotSelected && (inputValue === '' || matchesInput);
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-3 relative" ref={containerRef}>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">{label}</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder={placeholder}
                        value={inputValue}
                        onFocus={() => setIsFocused(true)}
                        onChange={(e) => {
                            setTempInputs({ ...tempInputs, [fieldKey]: e.target.value });
                            setIsFocused(true);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addItem(field, inputValue)}
                    />
                    {isFocused && filteredSuggestions.length > 0 && (
                        <div className="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Available from Library
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {filteredSuggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            addItem(field, suggestion);
                                            setIsFocused(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700 transition-colors flex items-center justify-between group"
                                    >
                                        <span className="font-medium">{suggestion}</span>
                                        <Plus size={14} className="text-slate-300 group-hover:text-indigo-500" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => addItem(field, inputValue)}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {currentItems.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 shadow-sm">
                        {item}
                        <button onClick={() => removeItem(field, idx)} className="hover:text-red-500 transition-colors ml-1">
                            <Trash2 size={12} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

const App = () => {
    const [view, setView] = useState('wizard');
    const [step, setStep] = useState(0);
    const [stories, setStories] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [globalSuggestions, setGlobalSuggestions] = useState({
        metrics: ['Total Revenue', 'Net Margin', 'Customer Acquisition Cost', 'Churn Rate', 'Lifetime Value', 'Inventory Turnover', 'Daily Active Users'],
        dimensions: ['Region', 'Product Category', 'Date', 'Sales Channel', 'Store Location', 'Customer Segment', 'Device Type'],
        filters: ['Fiscal Period', 'Region Code', 'Promotion Type', 'Subscription Tier'],
        sources: ['Salesforce', 'SAP S/4HANA', 'Google Analytics 4', 'Microsoft Dynamics', 'Stripe Payments', 'AWS S3 Logs']
    });

    const [userProfile, setUserProfile] = useState({ fullName: '', email: '', phone: '', role: '' });
    const [currentStory, setCurrentStory] = useState({
        action: 'view an interactive dashboard',
        metrics: [],
        dimensions: [],
        filters: [],
        frequency: 'Daily',
        value: '',
        sources: []
    });

    const [tempInputs, setTempInputs] = useState({ metric: '', dimension: '', filter: '', source: '' });

    const handleProfileChange = (e) => setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const addItem = (field, value) => {
        if (!value || !value.trim()) return;
        const cleanValue = value.trim();
        setCurrentStory(prev => ({
            ...prev,
            [field]: [...new Set([...prev[field], cleanValue])]
        }));
        setTempInputs(prev => ({ ...prev, [field.slice(0, -1)]: '' }));
    };

    const removeItem = (field, index) => {
        setCurrentStory(prev => {
            const newList = [...prev[field]];
            newList.splice(index, 1);
            return { ...prev, [field]: newList };
        });
    };

    const updateGlobalMemory = (story) => {
        setGlobalSuggestions(prev => {
            const updated = { ...prev };
            ['metrics', 'dimensions', 'filters', 'sources'].forEach(field => {
                const uniqueValues = new Set([...prev[field], ...(story[field] || [])]);
                updated[field] = Array.from(uniqueValues).sort();
            });
            return updated;
        });
    };

    const saveStory = () => {
        if (editingId) {
            setStories(stories.map(s => s.id === editingId ? { ...currentStory, id: editingId, submittedBy: userProfile.fullName, userRole: userProfile.role, timestamp: new Date().toLocaleString() } : s));
            setEditingId(null);
        } else {
            setStories([...stories, { ...currentStory, id: Date.now(), submittedBy: userProfile.fullName, userRole: userProfile.role, timestamp: new Date().toLocaleString() }]);
        }
        updateGlobalMemory(currentStory);
        setCurrentStory({ action: 'view an interactive dashboard', metrics: [], dimensions: [], filters: [], frequency: 'Daily', value: '', sources: [] });
        setStep(1);
        setView('manage');
    };

    const startEditStory = (story) => {
        setCurrentStory(story);
        setEditingId(story.id);
        setStep(1);
        setView('wizard');
    };

    const exportToCSV = () => {
        if (stories.length === 0) return;
        const headers = ["ID", "Submitted By", "User Role", "Action", "Metrics", "Dimensions", "Filters", "Frequency", "Business Value", "Source Systems"];
        const rows = stories.map(s => [
            s.id, s.submittedBy, s.userRole, s.action,
            `"${s.metrics.join(', ')}"`, `"${s.dimensions.join(', ')}"`, `"${s.filters.join(', ')}"`,
            s.frequency, `"${s.value.replace(/"/g, '""')}"`, `"${s.sources.join(', ')}"`
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `DataStory_Backlog_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    // --- Views ---

    const renderLibraryView = () => (
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

    const renderWizardStep = () => {
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

    const renderManageView = () => (
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

    const canProgress = () => {
        if (step === 0) return userProfile.fullName && userProfile.role && userProfile.email;
        if (step === 2) return currentStory.metrics.length > 0;
        if (step === 3) return currentStory.dimensions.length > 0;
        if (step === 4) return currentStory.value.length > 5;
        return true;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-80 bg-slate-900 text-white p-10 flex flex-col shrink-0 shadow-2xl z-20">
                <div className="mb-12">
                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                        <Database size={32} />
                        <span className="font-black tracking-tight text-2xl uppercase">DataStory Collector</span>
                    </div>
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">Business Intelligence Engine</p>
                </div>

                <div className="space-y-2 mb-10">
                    <button onClick={() => setView('wizard')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${view === 'wizard' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                        <Plus size={18} /> New Story
                    </button>
                    <button onClick={() => setView('manage')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${view === 'manage' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                        <ListFilter size={18} /> Review Collection ({stories.length})
                    </button>
                </div>

                {view === 'wizard' && (
                    <nav className="flex-1 space-y-6 pt-8 border-t border-slate-800/50">
                        {['Identity', 'Output', 'Metrics', 'Breakdown', 'Impact', 'Sources'].map((label, idx) => (
                            <div key={label} className={`flex items-center gap-4 transition-all ${step === idx ? 'text-white' : 'text-slate-500'}`}>
                                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all ${step === idx ? 'border-indigo-500 bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/20' : step > idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-800 bg-slate-800/50'}`}>
                                    {step > idx ? <CheckCircle2 size={16} /> : idx + 1}
                                </div>
                                {/* LARGER SIDEBAR FONT: Increased from text-[10px] to text-xs with increased tracking */}
                                <span className={`text-xs font-black uppercase tracking-widest ${step === idx ? 'opacity-100' : 'opacity-40'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </nav>
                )}

                <div className="mt-auto pt-10 border-t border-slate-800/50 space-y-4">
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <History size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Library Memory</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                <div className="flex flex-col"><span className="text-white text-base leading-none">{globalSuggestions.metrics.length}</span> Metrics</div>
                                <div className="flex flex-col"><span className="text-white text-base leading-none">{globalSuggestions.dimensions.length}</span> Dims</div>
                            </div>
                        </div>

                        {/* DATA LIBRARY BUTTON NEAR MEMORY STATS */}
                        <button
                            onClick={() => setView('library')}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'library' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-indigo-300 hover:bg-white/20'}`}
                        >
                            <BookOpen size={14} /> Explore Library
                        </button>
                    </div>

                    <button onClick={exportToCSV} disabled={stories.length === 0} className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-20 disabled:grayscale hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-900/20">
                        <Download size={18} /> Export Backlog
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col p-8 md:p-16 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full">
                    {view === 'wizard' ? (
                        <div className="max-w-2xl mx-auto">
                            {editingId && (
                                <div className="mb-8 flex items-center justify-between p-6 bg-amber-50 border border-amber-100 rounded-[2rem] shadow-sm">
                                    <div className="flex items-center gap-3 text-amber-900 font-black text-sm uppercase tracking-tight">
                                        <Edit3 size={18} /> Refining DataStory #{editingId.toString().slice(-4)}
                                    </div>
                                    <button onClick={() => { setEditingId(null); setView('manage'); }} className="text-amber-700 hover:text-amber-900 text-[10px] font-black uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-amber-200 transition-all shadow-sm">Exit Editing</button>
                                </div>
                            )}
                            {renderWizardStep()}
                            <div className="mt-16 flex justify-between items-center border-t border-slate-100 pt-10">
                                {step > 0 && <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-[0.2em] px-6 py-3 transition-all"><ChevronLeft size={20} /> Previous</button>}
                                <div className="flex-1"></div>
                                {step < 5 && <button onClick={nextStep} disabled={!canProgress()} className={`flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${!canProgress() ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black active:scale-95'}`}>Next Phase <ChevronRight size={20} /></button>}
                            </div>
                        </div>
                    ) : view === 'library' ? renderLibraryView() : renderManageView()}
                </div>
            </div>

            {/* Visual Preview Sidebar (Wizard Only) */}
            {view === 'wizard' && (
                <div className="w-full md:w-[450px] bg-slate-50 border-l border-slate-200 p-8 shrink-0 hidden 2xl:flex flex-col justify-center">

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-lg leading-relaxed font-medium text-slate-400 font-sans">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Live Logic Preview</span>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700/50 text-slate-500">
                                <Code size={20} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-8">
                            <div>
                                <span className="">As a </span>
                                <span className={`${userProfile.role ? 'text-white font-bold' : 'text-slate-600 decoration-slate-700 underline decoration-dashed underline-offset-4 decoration-2'}`}>
                                    {userProfile.role || 'Product Manager'}
                                </span>
                                <span className="">,</span>
                            </div>

                            <div>
                                <span className="">I want to </span>
                                <span className="text-blue-400 font-bold">{currentStory.action}</span>
                            </div>

                            <div>
                                <span className="">showing </span>
                                {currentStory.metrics.length > 0 ? (
                                    <span className="text-white font-bold">{currentStory.metrics.join(', ')}</span>
                                ) : (
                                    <span className="text-slate-600">______</span>
                                )}
                                <span className=""> over </span>
                                {currentStory.dimensions.length > 0 ? (
                                    <span className="text-white font-bold">{currentStory.dimensions.join(', ')}</span>
                                ) : (
                                    <span className="text-slate-600">______</span>
                                )}
                                <span className="">,</span>
                            </div>

                            <div>
                                <span className="">Filterable by </span>
                                {currentStory.filters.length > 0 ? (
                                    <span className="text-white font-bold">{currentStory.filters.join(', ')}</span>
                                ) : (
                                    <span className="text-slate-600">______</span>
                                )}
                                <span className="">,</span>
                            </div>

                            <div>
                                <span className="">updated </span>
                                <span className="text-white font-bold">{currentStory.frequency}</span>
                                <span className=""> so that </span>
                            </div>

                            <div>
                                {currentStory.value ? (
                                    <span className="text-white font-bold italic">"{currentStory.value}"</span>
                                ) : (
                                    <span className="text-slate-600">______</span>
                                )}
                                <span className="">.</span>
                            </div>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default App;