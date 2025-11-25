import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Info, Edit2, Save, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, MoveUp, MoveDown } from 'lucide-react';
import { ViewState, CHEAT_SHEET_DATA, CheatSheetSection, CheatSheetItem } from '../types';

interface CheatSheetProps {
  changeView: (view: ViewState) => void;
}

const CheatSheet: React.FC<CheatSheetProps> = ({ changeView }) => {
  // Initialize state with default data
  const [data, setData] = useState<CheatSheetSection[]>(CHEAT_SHEET_DATA);
  const [isEditing, setIsEditing] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ee4216_cheatsheet_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            setData(parsed);
        }
      } catch (e) {
        console.error("Failed to load saved cheatsheet", e);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    localStorage.setItem('ee4216_cheatsheet_v1', JSON.stringify(data));
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes? This cannot be undone.")) {
      setData(CHEAT_SHEET_DATA);
      localStorage.removeItem('ee4216_cheatsheet_v1');
      setIsEditing(false);
    }
  };

  // --- Data Manipulation Functions ---

  const updateItem = (sectionIndex: number, itemIndex: number, field: keyof CheatSheetItem, value: string) => {
    const newData = [...data];
    newData[sectionIndex].items[itemIndex] = {
      ...newData[sectionIndex].items[itemIndex],
      [field]: value
    };
    setData(newData);
  };

  const updateCategory = (sectionIndex: number, value: string) => {
    const newData = [...data];
    newData[sectionIndex].category = value;
    setData(newData);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= data.length) return;
    const newData = [...data];
    const temp = newData[index];
    newData[index] = newData[index + direction];
    newData[index + direction] = temp;
    setData(newData);
  };

  const addSection = () => {
    const newSection: CheatSheetSection = {
      category: "New Section",
      items: [
        { title: "Topic", code: "// code here", explanation: "Explanation here" }
      ]
    };
    setData([...data, newSection]);
  };

  const deleteSection = (index: number) => {
    if (window.confirm("Delete this entire section?")) {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    }
  };

  const addItem = (sectionIndex: number) => {
    const newData = [...data];
    newData[sectionIndex].items.push({
        title: "New Item",
        code: "",
        explanation: "Description"
    });
    setData(newData);
  };

  const deleteItem = (sectionIndex: number, itemIndex: number) => {
    const newData = [...data];
    newData[sectionIndex].items = newData[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setData(newData);
  };

  // Calculate number of pages needed (4 sections per page layout logic)
  // Page Layout: 
  // Col 1: Slot 0, Slot 1
  // Col 2: Slot 2 (plus notes on page 1)
  // Col 3: Slot 3
  const sectionsPerPage = 4;
  const totalPages = Math.ceil(Math.max(data.length, 1) / sectionsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const renderPage = (pageIndex: number) => {
    const baseIndex = pageIndex * sectionsPerPage;
    const section0 = data[baseIndex];
    const section1 = data[baseIndex + 1];
    const section2 = data[baseIndex + 2];
    const section3 = data[baseIndex + 3];

    return (
      <div key={pageIndex} className="w-full h-[210mm] p-[5mm] flex flex-col relative print:h-screen page-break bg-white overflow-hidden mb-8 shadow-xl print:shadow-none print:m-0 print:mb-0">
        <div className="flex justify-between border-b-2 border-nus-blue pb-1 mb-2">
          <h1 className="text-lg font-bold uppercase text-nus-blue">Cheat Sheet - Page {pageIndex + 1}</h1>
          <span className="text-[9px] pt-2 font-mono text-slate-500">EE4216 Hardware for IoT • Exam Cheat Sheet</span>
        </div>

        {/* Landscape Grid: 3 Columns */}
        <div className="grid grid-cols-3 gap-3 h-full content-start">
          
          {/* Column 1: Holds Section 0 & 1 */}
          <div className="flex flex-col gap-2 h-full">
            {section0 && (
              <SectionBlock 
                section={section0} 
                sIdx={baseIndex} 
                isEditing={isEditing} 
                onUpdate={updateItem}
                onUpdateTitle={updateCategory}
                onMove={moveSection}
                onDelete={deleteSection}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                totalSections={data.length}
              />
            )}
            {section1 && (
              <SectionBlock 
                section={section1} 
                sIdx={baseIndex + 1} 
                isEditing={isEditing} 
                onUpdate={updateItem}
                onUpdateTitle={updateCategory}
                onMove={moveSection}
                onDelete={deleteSection}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                totalSections={data.length}
              />
            )}
          </div>

          {/* Column 2: Holds Section 2 + Notes (only on page 1) */}
          <div className="flex flex-col gap-2 h-full">
             {section2 && (
              <SectionBlock 
                section={section2} 
                sIdx={baseIndex + 2} 
                isEditing={isEditing} 
                onUpdate={updateItem}
                onUpdateTitle={updateCategory}
                onMove={moveSection}
                onDelete={deleteSection}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                totalSections={data.length}
              />
            )}
            
            {/* Flexible Notes Area - Only on Page 1 by design choice to keep layout consistent */}
            {pageIndex === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-md flex-grow min-h-[50px] p-2 relative group">
                    <h3 className="text-[9px] font-bold text-slate-300 uppercase text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">Handwritten Notes Area</h3>
                </div>
            )}
          </div>

          {/* Column 3: Holds Section 3 */}
          <div className="flex flex-col gap-2 h-full">
             {section3 && (
              <SectionBlock 
                section={section3} 
                sIdx={baseIndex + 3} 
                isEditing={isEditing} 
                onUpdate={updateItem}
                onUpdateTitle={updateCategory}
                onMove={moveSection}
                onDelete={deleteSection}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                totalSections={data.length}
              />
            )}
          </div>
        </div>
        
        <div className="absolute bottom-1 right-2 text-slate-300 text-[7px]">Generated via EE4216 Exam Prep App</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Navigation Bar */}
      <div className="no-print bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => changeView(ViewState.DASHBOARD)}
            className="flex items-center text-slate-600 hover:text-nus-blue font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button 
                  onClick={addSection}
                  className="flex items-center text-nus-blue bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Section
                </button>
                <div className="h-6 w-px bg-slate-300 mx-1"></div>
                <button 
                  onClick={handleReset}
                  className="flex items-center text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm text-sm font-medium"
                >
                  <Save className="w-4 h-4 mr-2" /> Save
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-slate-700 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 text-sm font-medium border border-slate-300"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Layout
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center bg-nus-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 shadow-sm text-sm font-medium"
                >
                  <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="max-w-7xl mx-auto mt-4 px-4 no-print">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center text-sm">
            <Info className="w-4 h-4 mr-2" />
            Edit Mode Active. You can Add, Delete, and Reorder sections. Content layout flows automatically (4 sections per page).
          </div>
        </div>
      )}

      {/* Printable Content - Scaled for A4 Landscape */}
      <div className="w-[297mm] mx-auto my-8">
        {pages.map(pageIndex => renderPage(pageIndex))}
      </div>
    </div>
  );
};

interface SectionProps {
  section: CheatSheetSection;
  sIdx: number;
  isEditing: boolean;
  totalSections: number;
  onUpdate: (sIdx: number, itemIdx: number, field: keyof CheatSheetItem, value: string) => void;
  onUpdateTitle: (sIdx: number, value: string) => void;
  onMove: (sIdx: number, direction: -1 | 1) => void;
  onDelete: (sIdx: number) => void;
  onAddItem: (sIdx: number) => void;
  onDeleteItem: (sIdx: number, itemIdx: number) => void;
}

const SectionBlock: React.FC<SectionProps> = ({ 
    section, sIdx, isEditing, totalSections, 
    onUpdate, onUpdateTitle, onMove, onDelete, onAddItem, onDeleteItem 
}) => (
  <section className="border border-slate-300 rounded-md overflow-hidden break-inside-avoid bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
    <div className="font-bold bg-slate-50 px-2 py-1 text-[10px] border-b border-slate-200 text-nus-blue uppercase tracking-wider flex items-center justify-between h-7">
      {isEditing ? (
        <>
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => onMove(sIdx, -1)} 
                    disabled={sIdx === 0}
                    className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30"
                    title="Move Up/Left"
                >
                    <ChevronUp className="w-3 h-3" />
                </button>
                <button 
                    onClick={() => onMove(sIdx, 1)} 
                    disabled={sIdx === totalSections - 1}
                    className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30"
                    title="Move Down/Right"
                >
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>
            <input 
            value={section.category}
            onChange={(e) => onUpdateTitle(sIdx, e.target.value)}
            className="bg-white border border-slate-300 px-1 rounded w-full text-xs mx-1"
            />
            <button 
                onClick={() => onDelete(sIdx)} 
                className="p-0.5 hover:bg-red-100 text-red-500 rounded"
                title="Delete Section"
            >
                <Trash2 className="w-3 h-3" />
            </button>
        </>
      ) : (
        section.category
      )}
    </div>
    <div className="p-1.5 flex flex-col gap-2">
      {section.items.map((item, i) => (
        <div key={i} className="text-[9px] leading-tight group relative">
          <div className="font-bold text-slate-800 mb-0.5 inline-block w-full">
            {isEditing ? (
                <div className="flex gap-1 mb-1">
                    <input 
                        value={item.title}
                        onChange={(e) => onUpdate(sIdx, i, 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-1 rounded text-[9px] font-bold"
                        placeholder="Title"
                    />
                    <button 
                        onClick={() => onDeleteItem(sIdx, i)}
                        className="text-red-400 hover:text-red-600 p-0.5"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ) : (
              <span className="border-b border-slate-100 pb-0.5">{item.title}</span>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            {isEditing ? (
              <textarea 
                value={item.code}
                onChange={(e) => onUpdate(sIdx, i, 'code', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-1 py-1 rounded font-mono text-[9px] h-12 resize-y"
                placeholder="Code Snippet"
              />
            ) : (
              <code className="block bg-slate-50 border border-slate-100 px-1.5 py-1 font-mono text-[9px] text-blue-900 whitespace-pre-wrap rounded">
                {item.code}
              </code>
            )}
            
            <div className="text-slate-600 text-justify pl-0.5 border-l-2 border-slate-200">
              {isEditing ? (
                <textarea 
                  value={item.explanation}
                  onChange={(e) => onUpdate(sIdx, i, 'explanation', e.target.value)}
                  className="w-full bg-white border border-slate-200 px-1 py-1 rounded text-[9px] h-10 resize-y mt-1"
                  placeholder="Explanation"
                />
              ) : (
                <span className="pl-1 block">{item.explanation}</span>
              )}
            </div>
          </div>
        </div>
      ))}
      {isEditing && (
          <button 
            onClick={() => onAddItem(sIdx)}
            className="w-full py-1 text-[9px] text-slate-400 hover:text-nus-blue hover:bg-slate-50 border border-dashed border-slate-300 rounded flex items-center justify-center gap-1"
          >
              <Plus className="w-3 h-3" /> Add Item
          </button>
      )}
    </div>
  </section>
);

export default CheatSheet;