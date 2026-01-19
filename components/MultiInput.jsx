import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';

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

export default MultiInput;
