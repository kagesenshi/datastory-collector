import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Edit3,
    User,
    Menu,
    X,
} from 'lucide-react';

// Import modular components
import MultiInput from './components/MultiInput';
import LibraryView from './components/LibraryView';
import Wizard from './components/Wizard';
import ManagementView from './components/ManagementView';
import Sidebar from './components/Sidebar';
import LiveLogicPreview from './components/LiveLogicPreview';
import UserProfileModal from './components/UserProfileModal';
import YamlPreview from './components/YamlPreview';
import EDWBusMatrix from './components/EDWBusMatrix';

const App = () => {
    const [view, setView] = useState('wizard');
    const [step, setStep] = useState(1);
    const [stories, setStories] = useState(() => {
        const saved = localStorage.getItem('datastory_stories');
        return saved ? JSON.parse(saved) : [];
    });
    const [editingId, setEditingId] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [yamlSource, setYamlSource] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [globalSuggestions, setGlobalSuggestions] = useState(() => {
        const saved = localStorage.getItem('datastory_suggestions');
        const defaultValue = {
            metrics: ['Total Revenue', 'Net Margin', 'Customer Acquisition Cost', 'Churn Rate', 'Lifetime Value', 'Inventory Turnover', 'Daily Active Users'],
            dimensions: ['Region', 'Product Category', 'Date', 'Sales Channel', 'Store Location', 'Customer Segment', 'Device Type', 'Fiscal Period', 'Region Code', 'Promotion Type', 'Subscription Tier'],
            sources: ['Salesforce', 'SAP S/4HANA', 'Google Analytics 4', 'Microsoft Dynamics', 'Stripe Payments', 'AWS S3 Logs']
        };
        return saved ? JSON.parse(saved) : defaultValue;
    });

    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('datastory_user_profile');
        return saved ? JSON.parse(saved) : { fullName: '', email: '', phone: '', role: '', department: '', company: '' };
    });
    const [currentStory, setCurrentStory] = useState({
        action: 'view an interactive dashboard',
        metrics: [],
        dimensions: [],
        filters: [],
        frequency: 'Daily',
        value: '',
        importance: 0,
        sources: []
    });

    const [tempInputs, setTempInputs] = useState({ metric: '', dimension: '', filter: '', source: '' });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('datastory_stories', JSON.stringify(stories));
    }, [stories]);

    useEffect(() => {
        localStorage.setItem('datastory_suggestions', JSON.stringify(globalSuggestions));
    }, [globalSuggestions]);

    useEffect(() => {
        localStorage.setItem('datastory_user_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        if (stories.length === 0) {
            setYamlSource('');
            return;
        }

        const escape = (str) => {
            if (!str) return '""';
            const s = str.toString();
            if (s.includes('\n') || s.includes('"') || s.includes(':')) {
                return `"${s.replace(/"/g, '\\"')}"`;
            }
            return s;
        };

        const listItems = (arr, indent = '  ') => {
            if (!arr || arr.length === 0) return ' []';
            return '\n' + arr.map(item => `${indent}- ${escape(item)}`).join('\n');
        };

        const grouped = stories.reduce((acc, s) => {
            const key = `${s.userEmail || ''}|${s.submittedBy || ''}|${s.userRole || ''}`;
            if (!acc[key]) {
                acc[key] = {
                    userRole: s.userRole,
                    userName: s.submittedBy,
                    userEmail: s.userEmail,
                    userDepartment: s.userDepartment,
                    stories: []
                };
            }
            acc[key].stories.push(s);
            return acc;
        }, {});

        const yamlContent = Object.values(grouped).map(u => {
            return `- userRole: ${escape(u.userRole)}
  userName: ${escape(u.userName)}
  userEmail: ${escape(u.userEmail)}
  userDepartment: ${escape(u.userDepartment)}
  userStories:
${u.stories.map(s => `    - id: ${s.id}
      action: ${escape(s.action)}
      metrics:${listItems(s.metrics, '      ')}
      dimensions:${listItems(s.dimensions, '      ')}
      filters:${listItems(s.filters, '      ')}
      frequency: ${escape(s.frequency)}
      businessValue: ${escape(s.value)}
      importance: ${escape(s.importance)}
      sourceSystems:${listItems(s.sources, '      ')}
      timestamp: ${escape(s.timestamp)}`).join('\n')}`;
        }).join('\n');

        setYamlSource(yamlContent);
    }, [stories]);

    useEffect(() => {
        const isComplete = userProfile.fullName && userProfile.email && userProfile.role;
        if (!isComplete) {
            setShowProfileModal(true);
        }
    }, []);

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

            // Metrics
            updated.metrics = Array.from(new Set([...prev.metrics, ...(story.metrics || [])])).sort();

            // Dimensions (merging both dimensions and filters into the dimensions pool)
            updated.dimensions = Array.from(new Set([
                ...prev.dimensions,
                ...(story.dimensions || []),
                ...(story.filters || [])
            ])).sort();

            // Sources
            updated.sources = Array.from(new Set([...prev.sources, ...(story.sources || [])])).sort();

            return updated;
        });
    };

    const saveStory = () => {
        if (editingId) {
            setStories(stories.map(s => s.id === editingId ? {
                ...currentStory,
                id: editingId,
                submittedBy: userProfile.fullName,
                userRole: userProfile.role,
                userEmail: userProfile.email,
                userDepartment: userProfile.department,
                timestamp: new Date().toLocaleString()
            } : s));
            setEditingId(null);
        } else {
            setStories([...stories, {
                ...currentStory,
                id: Date.now(),
                submittedBy: userProfile.fullName,
                userRole: userProfile.role,
                userEmail: userProfile.email,
                userDepartment: userProfile.department,
                timestamp: new Date().toLocaleString()
            }]);
        }
        updateGlobalMemory(currentStory);
        setCurrentStory({ action: 'view an interactive dashboard', metrics: [], dimensions: [], filters: [], frequency: 'Daily', value: '', importance: 0, sources: [] });
        setStep(1);
        setView('manage');
    };

    const startEditStory = (story) => {
        setCurrentStory(story);
        setEditingId(story.id);
        setStep(1);
        setView('wizard');
    };


    const canProgress = () => {
        if (step === 2) return currentStory.metrics.length > 0;
        if (step === 3) return currentStory.dimensions.length > 0;
        if (step === 4) return currentStory.value.length > 5;
        return true;
    };

    const handleSetView = (newView) => {
        setView(newView);
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative">

            {/* Mobile Sidebar Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:shadow-none
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:transform-none lg:block 
            `}>
                <Sidebar
                    view={view}
                    setView={handleSetView}
                    stories={stories}
                    step={step}
                    globalSuggestions={globalSuggestions}
                    onViewYaml={() => { setView('yaml'); setIsSidebarOpen(false); }}
                />
            </div>

            <div className="flex-1 flex flex-col xl:flex-row h-screen overflow-hidden">
                <div className="flex-1 flex flex-col p-4 md:p-16 overflow-y-auto relative">
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="w-full mb-8 pl-16 md:pl-5 md:mb-0 md:w-auto md:absolute md:top-8 md:right-8 flex items-center gap-2 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all group active:scale-95 z-10"
                    >
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : <User size={14} />}
                        </div>
                        <div className="text-left overflow-hidden">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Profile</div>
                            <div className="text-xs font-bold text-slate-800 leading-none whitespace-nowrap overflow-hidden text-ellipsis">{userProfile.fullName || 'Complete Profile'}</div>
                            {userProfile.fullName && (
                                <div className="text-[9px] text-slate-400 mt-1 font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                                    {userProfile.email}
                                </div>
                            )}
                        </div>
                    </button>

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
                                <Wizard
                                    step={step}
                                    currentStory={currentStory}
                                    setCurrentStory={setCurrentStory}
                                    tempInputs={tempInputs}
                                    setTempInputs={setTempInputs}
                                    addItem={addItem}
                                    removeItem={removeItem}
                                    globalSuggestions={globalSuggestions}
                                    saveStory={saveStory}
                                    editingId={editingId}
                                />
                                <div className="mt-16 flex justify-between items-center border-t border-slate-100 pt-10">
                                    {step > 1 && <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-[0.2em] px-6 py-3 transition-all"><ChevronLeft size={20} /> Previous</button>}
                                    <div className="flex-1"></div>
                                    {step < 5 && <button onClick={nextStep} disabled={!canProgress()} className={`flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${!canProgress() ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black active:scale-95'}`}>Next<ChevronRight size={20} /></button>}
                                </div>
                            </div>
                        ) : view === 'library' ? (
                            <LibraryView globalSuggestions={globalSuggestions} setView={setView} />
                        ) : view === 'yaml' ? (
                            <YamlPreview content={yamlSource} onClose={() => setView('manage')} />
                        ) : view === 'matrix' ? (
                            <EDWBusMatrix stories={stories} setView={setView} />
                        ) : (
                            <ManagementView
                                stories={stories}
                                setView={setView}
                                setEditingId={setEditingId}
                                setStep={setStep}
                                startEditStory={startEditStory}
                                setStories={setStories}
                            />
                        )}
                    </div>
                </div>

                {view === 'wizard' && (
                    <LiveLogicPreview userProfile={userProfile} currentStory={currentStory} />
                )}
            </div>

            <UserProfileModal
                profile={userProfile}
                onChange={handleProfileChange}
                onSave={() => setShowProfileModal(false)}
                isOpen={showProfileModal}
            />
        </div>
    );
};

export default App;