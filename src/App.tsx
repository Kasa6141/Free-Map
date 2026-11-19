import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Upload,
  Search,
  Sun,
  Moon,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Palette,
  Smile,
  Edit3,
  Move,
  FileText,
  RotateCcw,
  RotateCw,
  Sparkles,
  Layout,
  Share2,
  Info,
  Check,
  X,
  HelpCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Type,
  List,
  StickyNote,
  Image as ImageIcon,
  Network,
  Lock,
  Unlock,
  Pin,
  File,
  Minimize2
} from 'lucide-react';

// Preset Palette Colors for Nodes
const COLOR_PALETTE = [
  { label: 'Default', bg: 'bg-slate-800 dark:bg-slate-900', border: 'border-slate-600', text: 'text-slate-100', accent: '#64748b' },
  { label: 'Blue', bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-white', accent: '#3b82f6' },
  { label: 'Emerald', bg: 'bg-emerald-600', border: 'border-emerald-400', text: 'text-white', accent: '#10b981' },
  { label: 'Purple', bg: 'bg-purple-600', border: 'border-purple-400', text: 'text-white', accent: '#a855f7' },
  { label: 'Amber', bg: 'bg-amber-600', border: 'border-amber-400', text: 'text-white', accent: '#f59e0b' },
  { label: 'Rose', bg: 'bg-rose-600', border: 'border-rose-400', text: 'text-white', accent: '#f43f5e' },
  { label: 'Cyan', bg: 'bg-cyan-600', border: 'border-cyan-400', text: 'text-white', accent: '#06b6d4' },
  { label: 'Indigo', bg: 'bg-indigo-600', border: 'border-indigo-400', text: 'text-white', accent: '#6366f1' },
  { label: 'Violet', bg: 'bg-violet-600', border: 'border-violet-400', text: 'text-white', accent: '#8b5cf6' },
  { label: 'Teal', bg: 'bg-teal-600', border: 'border-teal-400', text: 'text-white', accent: '#14b8a6' },
  { label: 'Orange', bg: 'bg-orange-600', border: 'border-orange-400', text: 'text-white', accent: '#f97316' },
  { label: 'Fuchsia', bg: 'bg-fuchsia-600', border: 'border-fuchsia-400', text: 'text-white', accent: '#d946ef' },
  { label: 'Pink', bg: 'bg-pink-600', border: 'border-pink-400', text: 'text-white', accent: '#ec4899' },
  { label: 'Lime', bg: 'bg-lime-600', border: 'border-lime-400', text: 'text-white', accent: '#84cc16' },
  { label: 'Sky', bg: 'bg-sky-600', border: 'border-sky-400', text: 'text-white', accent: '#0ea5e9' },
  { label: 'Obsidian', bg: 'bg-slate-950', border: 'border-slate-700', text: 'text-slate-100', accent: '#0f172a' },
];

const EMOJI_PRESETS = ['💡', '🚀', '🎯', '⭐', '🔥', '📌', '🧠', '✅', '❌', '❓', '📈', '🛠️', '🎨', '⚙️', '📝', '💻', '🚛', '🚚', '🚗'];

const STICKY_NOTE_PRESETS = [
  { label: 'Classic Yellow', bg: '#fef08a', border: '#eab308', text: '#1e293b' },
  { label: 'Mint Green', bg: '#bbf7d0', border: '#22c55e', text: '#1e293b' },
  { label: 'Sky Blue', bg: '#bae6fd', border: '#0ea5e9', text: '#1e293b' },
  { label: 'Soft Pink', bg: '#fbcfe8', border: '#ec4899', text: '#1e293b' },
  { label: 'Lavender', bg: '#e9d5ff', border: '#a855f7', text: '#1e293b' },
  { label: 'Peach Orange', bg: '#fed7aa', border: '#f97316', text: '#1e293b' },
  { label: 'Dark Slate', bg: '#1e293b', border: '#475569', text: '#f8fafc' },
];

// Helper for contrast text on custom sticky note colors
const getContrastTextColor = (hex) => {
  if (!hex || !hex.startsWith('#')) return '#1e293b';
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return '#1e293b';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135 ? '#0f172a' : '#f8fafc';
};

// Default Tree Builder Helper
const createDefaultTreeData = (title = 'Central Idea') => ({
  id: `root-${Date.now()}`,
  text: title,
  emoji: '💡',
  colorIndex: 1,
  expanded: true,
  xOffset: 0,
  yOffset: 0,
  width: null,
  height: null,
  note: '',
  isSmall: false,
  children: [
    {
      id: `node-${Date.now()}-1`,
      text: 'Main Branch 1',
      emoji: '🎯',
      colorIndex: 2,
      expanded: true,
      xOffset: 0,
      yOffset: 0,
      width: null,
      height: null,
      children: []
    },
    {
      id: `node-${Date.now()}-2`,
      text: 'Main Branch 2',
      emoji: '🚀',
      colorIndex: 3,
      expanded: true,
      xOffset: 0,
      yOffset: 0,
      width: null,
      height: null,
      children: []
    }
  ]
});

// Initial Demo Mind Map Data (Wrapped in Root Nodes Array)
const initialTreeData = [
  {
    id: 'root-1',
    text: 'Central Project Idea',
    emoji: '💡',
    colorIndex: 1,
    expanded: true,
    xOffset: 0,
    yOffset: 0,
    width: null,
    height: null,
    note: '',
    isSmall: false,
    children: [
      {
        id: 'node-1',
        text: 'Research & Discovery',
        emoji: '🔍',
        colorIndex: 2,
        expanded: true,
        xOffset: 0,
        yOffset: 0,
        width: null,
        height: null,
        note: 'Need to review competitor analysis docs by Q3.',
        children: [
          { id: 'node-1-1', text: 'User Interviews', emoji: '👥', colorIndex: 2, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] },
          { id: 'node-1-2', text: 'Competitor Analysis', emoji: '📊', colorIndex: 2, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] },
          { id: 'node-1-3', text: 'Market Requirements', emoji: '📋', colorIndex: 2, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, isSmall: true, children: [] }
        ]
      },
      {
        id: 'node-2',
        text: 'Product Features',
        emoji: '🚀',
        colorIndex: 3,
        expanded: true,
        xOffset: 0,
        yOffset: 0,
        width: null,
        height: null,
        children: [
          { id: 'node-2-1', text: 'Interactive Canvas', emoji: '🎨', colorIndex: 3, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] },
          { id: 'node-2-2', text: 'Keyboard Shortcuts', emoji: '⌨️', colorIndex: 3, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] },
          { id: 'node-2-3', text: 'Export to JSON/Markdown', emoji: '💾', colorIndex: 3, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] }
        ]
      },
      {
        id: 'node-3',
        text: 'Design & Branding',
        emoji: '🎨',
        colorIndex: 4,
        expanded: true,
        xOffset: 0,
        yOffset: 0,
        width: null,
        height: null,
        children: [
          { id: 'node-3-1', text: 'Color Palette', emoji: '🌈', colorIndex: 4, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] },
          { id: 'node-3-2', text: 'Typography & Layout', emoji: '✒️', colorIndex: 4, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] }
        ]
      },
      {
        id: 'node-4',
        text: 'Launch Strategy',
        emoji: '🎯',
        colorIndex: 5,
        expanded: true,
        xOffset: 0,
        yOffset: 0,
        width: null,
        height: null,
        children: [
          { id: 'node-4-1', text: 'Social Media Campaign', emoji: '📢', colorIndex: 5, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] },
          { id: 'node-4-2', text: 'Beta Testers Outreach', emoji: '✉️', colorIndex: 5, expanded: true, xOffset: 0, yOffset: 0, width: null, height: null, children: [] }
        ]
      }
    ]
  }
];

// Single mind-map node. Memoized so that panning, typing in another node, or
// selecting something else doesn't re-render every node on the canvas.
// Handlers read the latest App state/functions through `ctx` (a ref) at click time.
const MapNodeBase = ({ coords, isSelected, isEditing, isDragOver, isMatch, editingText, draggedNodeId, ctx, nodeRefs }: any) => {
  const node = coords.data;
  const palette = COLOR_PALETTE[node.colorIndex] || COLOR_PALETTE[1];
  const { x, y, width, height } = coords;

  const textLen = Math.max((node.text || '').length, 1);
  const innerWidth = Math.max(40, width - (node.emoji ? 44 : 24));
  const innerHeight = Math.max(20, height - 14);
  const autoFontSize = Math.max(
    11,
    Math.min(Math.floor(Math.min(Math.sqrt((innerWidth * innerHeight * 1.2) / textLen), innerHeight * 0.55)), 48)
  );
  const calculatedFontSize = node.fontSize || autoFontSize;

  const bgStyle = node.customColor
    ? { backgroundColor: node.customColor, borderColor: 'rgba(255,255,255,0.4)' }
    : {};
  const bgClasses = node.customColor ? '' : `${palette.bg} ${palette.border}`;

  return (
      <div
        key={node.id}
        ref={(el) => (nodeRefs.current[node.id] = el)}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          ...bgStyle
        }}
        onClick={(e) => {
          e.stopPropagation();
          ctx.current.setSelectedNodeId(node.id);
          ctx.current.setSelectedStickyId(null);
          ctx.current.setOpenStickyColorId(null);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          ctx.current.setSelectedNodeId(node.id);
          ctx.current.setEditingText(node.text);
          ctx.current.setEditingNodeId(node.id);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          ctx.current.setSelectedNodeId(node.id);
          if (!node.isLocked) {
            ctx.current.setDraggingNodeId(node.id);
            ctx.current.setDragStartPos({ x: e.clientX, y: e.clientY });
            ctx.current.setInitialNodeOffset({ x: node.xOffset || 0, y: node.yOffset || 0 });
          }
        }}
        draggable={!isEditing && !node.isLocked}
        onDragStart={(e) => {
          if (node.isLocked) {
            e.preventDefault();
            return;
          }
          e.stopPropagation();
          ctx.current.setDraggedNodeId(node.id);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedNodeId && draggedNodeId !== node.id) {
            ctx.current.setDragOverNodeId(node.id);
          }
        }}
        onDragLeave={() => ctx.current.setDragOverNodeId(null)}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedNodeId && draggedNodeId !== node.id) {
            const moveNode = (nodes, sourceId, targetParentId) => {
              let nodeToMove = null;
              const filterTree = (list) => {
                return list
                  .map((n) => {
                    if (n.id === sourceId) {
                      nodeToMove = n;
                      return null;
                    }
                    if (n.children) {
                      return {
                        ...n,
                        children: filterTree(n.children).filter(Boolean)
                      };
                    }
                    return n;
                  })
                  .filter(Boolean);
              };

              const cleanedTree = filterTree(nodes);
              if (!nodeToMove) return nodes;

              const appendToTarget = (list) => {
                return list.map((n) => {
                  if (n.id === targetParentId) {
                    return {
                      ...n,
                      expanded: true,
                      children: [...(n.children || []), nodeToMove]
                    };
                  }
                  if (n.children) {
                    return {
                      ...n,
                      children: appendToTarget(n.children)
                    };
                  }
                  return n;
                });
              };

              return appendToTarget(cleanedTree);
            };

            const newTree = moveNode(ctx.current.rootNodes, draggedNodeId, node.id);
            ctx.current.updateTree(newTree);
          }
          ctx.current.setDraggedNodeId(null);
          ctx.current.setDragOverNodeId(null);
        }}
        className={`absolute pointer-events-auto rounded-2xl border-2 shadow-xl flex items-center justify-between px-3 py-1.5 transition-[background-color,border-color,box-shadow,transform,scale,opacity] duration-150 cursor-pointer ${bgClasses} ${
          isSelected ? 'ring-4 ring-indigo-400 ring-offset-2 ring-offset-slate-950 scale-105 z-20' : 'hover:scale-102 z-10'
        } ${isDragOver ? 'ring-4 ring-emerald-400 scale-105' : ''} ${
          isMatch ? 'ring-4 ring-amber-400 animate-pulse' : ''
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 w-full h-full overflow-hidden text-center">
          {node.isLocked && (
            <Lock className="w-3 h-3 text-rose-300 flex-shrink-0" title="Position Locked" />
          )}
          {node.emoji && (
            <span
              className="flex-shrink-0 select-none"
              style={{ fontSize: `${Math.max(12, calculatedFontSize * 1.1)}px` }}
            >
              {node.emoji}
            </span>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editingText}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => ctx.current.setEditingText(e.target.value)}
              onBlur={() => ctx.current.saveNodeText(node.id)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  ctx.current.saveNodeText(node.id);
                } else if (e.key === 'Escape') {
                  ctx.current.setEditingNodeId(null);
                }
              }}
              className="bg-transparent border-b-2 border-white text-white font-bold outline-none text-center w-full px-1"
              style={{ fontSize: `${calculatedFontSize}px` }}
            />
          ) : (
            <span
              className={`font-semibold text-white tracking-wide leading-tight line-clamp-2 select-none w-full text-center ${
                node.isSmall ? 'text-xs' : ''
              }`}
              style={{
                fontSize: `${calculatedFontSize}px`,
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {node.text}
            </span>
          )}

          {/* Note Badge Indicator */}
          {(node.note || (node.images && node.images.length > 0)) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                ctx.current.setNoteText(node.note || '');
                ctx.current.setNoteImages(node.images || []);
                ctx.current.setEditingNoteNodeId(node.id);
              }}
              className="flex-shrink-0 text-amber-300 hover:text-amber-100 transition flex items-center gap-0.5"
              title={node.note || 'Contains images'}
            >
              <FileText className={node.isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
              {node.images && node.images.length > 0 && (
                <span className="text-[9px] font-bold px-1 bg-amber-500/80 rounded-full text-slate-900">
                  {node.images.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Expand / Collapse Button */}
        {node.children && node.children.length > 0 && (
          <button
            onClick={(e) => ctx.current.toggleExpand(node.id, e)}
            className="ml-0.5 p-0.5 rounded-full hover:bg-white/20 transition text-slate-200 flex-shrink-0 self-center"
            title={node.expanded ? 'Collapse Branch' : 'Expand Branch'}
          >
            {node.expanded ? (
              <ChevronDown className={node.isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
            ) : (
              <div className="flex items-center gap-0.5">
                <ChevronRight className={node.isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
                <span className="text-[9px] font-bold px-1 bg-indigo-500/80 rounded-full">
                  {node.children.length}
                </span>
              </div>
            )}
          </button>
        )}

        {/* Resizing Handle */}
        {isSelected && (
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              ctx.current.setResizingNodeId(node.id);
              ctx.current.setResizeStart({
                w: node.width || (node.isSmall ? 100 : 160),
                h: node.height || (node.isSmall ? 32 : 42),
                x: e.clientX,
                y: e.clientY
              });
            }}
            className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize bg-indigo-400 rounded-br-xl rounded-tl-sm hover:scale-125 transition-transform"
            title="Drag to resize node"
          />
        )}
      </div>
  );
};

const areNodePropsEqual = (a: any, b: any) =>
  a.coords.x === b.coords.x &&
  a.coords.y === b.coords.y &&
  a.coords.width === b.coords.width &&
  a.coords.height === b.coords.height &&
  a.coords.data === b.coords.data &&
  a.isSelected === b.isSelected &&
  a.isEditing === b.isEditing &&
  a.isDragOver === b.isDragOver &&
  a.isMatch === b.isMatch &&
  a.editingText === b.editingText &&
  a.draggedNodeId === b.draggedNodeId;

const MapNode = React.memo(MapNodeBase, areNodePropsEqual);

export default function App() {
  // Multi-Tab Sheet State
  const [tabs, setTabs] = useState([
    { id: 'tab-1', title: 'Main Project Sheet', rootNodes: initialTreeData, stickyNotes: [], history: [initialTreeData], historyIndex: 0 },
    { id: 'tab-2', title: 'Brainstorming Sheet', rootNodes: [createDefaultTreeData('New Brainstorm')], stickyNotes: [], history: [[createDefaultTreeData('New Brainstorm')]], historyIndex: 0 }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingTabTitle, setEditingTabTitle] = useState('');

  // Toggle overlay visibility state
  const [showNodeOverlay, setShowNodeOverlay] = useState(true);

  // Active Tab Derived Root Nodes & Sticky Notes
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const rootNodes = activeTab ? (Array.isArray(activeTab.rootNodes) ? activeTab.rootNodes : [activeTab.rootNodes]) : initialTreeData;
  const stickyNotes = activeTab?.stickyNotes || [];
  const history = activeTab ? activeTab.history : [initialTreeData];
  const historyIndex = activeTab ? activeTab.historyIndex : 0;

  const setRootNodes = (newRootNodes) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, rootNodes: newRootNodes } : tab))
    );
  };

  const setStickyNotes = (updater) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          const currentNotes = tab.stickyNotes || [];
          const nextNotes = typeof updater === 'function' ? updater(currentNotes) : updater;
          return { ...tab, stickyNotes: nextNotes };
        }
        return tab;
      })
    );
  };

  const [selectedNodeId, setSelectedNodeId] = useState('root-1');
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Canvas & UI State
  const [transform, setTransform] = useState({ x: 80, y: 120, scale: 1 });
  // Panning lives in refs so dragging the canvas never re-renders React
  const panRef = useRef({ active: false, startX: 0, startY: 0, x: 0, y: 0, moved: false });
  const canvasLayerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  // Node Dragging, Resizing & Note Modal State
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialNodeOffset, setInitialNodeOffset] = useState({ x: 0, y: 0 });
  const [resizingNodeId, setResizingNodeId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOverNodeId, setDragOverNodeId] = useState(null);
  const [alignmentGuides, setAlignmentGuides] = useState({ x: null, y: null });

  const [editingNoteNodeId, setEditingNoteNodeId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteImages, setNoteImages] = useState([]);

  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  // Sticky Note Interaction States
  const [selectedStickyId, setSelectedStickyId] = useState(null);
  const [draggingStickyId, setDraggingStickyId] = useState(null);
  const [stickyDragStart, setStickyDragStart] = useState({ mouseX: 0, mouseY: 0, noteX: 0, noteY: 0 });
  const [resizingStickyId, setResizingStickyId] = useState(null);
  const [stickyResizeStart, setStickyResizeStart] = useState({ mouseX: 0, mouseY: 0, w: 0, h: 0 });
  const [openStickyColorId, setOpenStickyColorId] = useState(null);
  const [expandedStickyAttachment, setExpandedStickyAttachment] = useState(null); // { stickyId, type: 'image' | 'pdf', index: number }

  // Click-to-place mode state ('parentNode' | 'stickyNote' | null)
  const [pendingPlacementMode, setPendingPlacementMode] = useState(null);

  const updateStickyNote = (id, updates) => {
    setStickyNotes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleStickyImageUpload = (stickyId, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const sticky = stickyNotes.find((s) => s.id === stickyId);
    const currentImages = sticky?.images || [];
    const remainingSlots = 10 - currentImages.length;
    if (remainingSlots <= 0) return;

    files.slice(0, remainingSlots).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStickyNotes((prev) =>
            prev.map((s) => {
              if (s.id !== stickyId) return s;
              const imgs = s.images || [];
              if (imgs.length >= 10) return s;
              return { ...s, images: [...imgs, event.target.result] };
            })
          );
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleStickyPdfUpload = (stickyId, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const sticky = stickyNotes.find((s) => s.id === stickyId);
    const currentPdfs = sticky?.pdfs || [];
    const remainingSlots = 10 - currentPdfs.length;
    if (remainingSlots <= 0) return;

    files.slice(0, remainingSlots).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStickyNotes((prev) =>
            prev.map((s) => {
              if (s.id !== stickyId) return s;
              const pdfs = s.pdfs || [];
              if (pdfs.length >= 10) return s;
              return { ...s, pdfs: [...pdfs, { name: file.name, data: event.target.result }] };
            })
          );
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const deleteStickyNote = (id) => {
    setStickyNotes((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickyId === id) setSelectedStickyId(null);
    if (expandedStickyAttachment?.stickyId === id) setExpandedStickyAttachment(null);
  };

  const openStickyPdfInNewTab = (pdfItem) => {
    if (!pdfItem?.data) return;
    try {
      const base64Parts = pdfItem.data.split(',');
      const base64Content = base64Parts.length > 1 ? base64Parts[1] : base64Parts[0];
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      window.open(pdfItem.data, '_blank', 'noopener,noreferrer');
    }
  };

  // Tab Management Helpers
  const addNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTree = [createDefaultTreeData(`Sheet ${tabs.length + 1}`)];
    setTabs((prev) => [
      ...prev,
      {
        id: newTabId,
        title: `Sheet ${prev.length + 1}`,
        rootNodes: newTree,
        stickyNotes: [],
        history: [newTree],
        historyIndex: 0
      }
    ]);
    setActiveTabId(newTabId);
    setSelectedNodeId(newTree[0].id);
  };

  const closeTab = (tabId, e) => {
    if (e) e.stopPropagation();
    if (tabs.length <= 1) return;
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      setActiveTabId(nextTabs[0].id);
      setSelectedNodeId(nextTabs[0].rootNodes[0]?.id || null);
    }
  };

  // Sticky Note Actions
  const addStickyNote = (customCoords = null) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const centerX = rect ? (rect.width / 2 - transform.x) / transform.scale - 100 : 120;
    const centerY = rect ? (rect.height / 2 - transform.y) / transform.scale - 90 : 120;
    const offsetStagger = (stickyNotes.length % 6) * 24;

    const targetX = customCoords ? customCoords.x - 105 : centerX + offsetStagger;
    const targetY = customCoords ? customCoords.y - 20 : centerY + offsetStagger;

    const newSticky = {
      id: `sticky-${Date.now()}`,
      text: 'Write your sticky note here...',
      x: targetX,
      y: targetY,
      width: 210,
      height: 170,
      fontSize: 13,
      fontFamily: 'sans',
      isExpanded: false,
      prevBounds: null,
      color: '#fef08a',
      borderColor: '#eab308',
      isPinned: false,
      images: [],
      pdfs: []
    };

    setStickyNotes((prev) => [...prev, newSticky]);
    setSelectedStickyId(newSticky.id);
    setSelectedNodeId(null);
  };

  const toggleStickyZoomEnlarge = (sticky) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!sticky.isExpanded) {
      const targetWidth = Math.max(sticky.width, 420);
      const targetHeight = Math.max(sticky.height, 340);
      const targetScale = 1.35;

      updateStickyNote(sticky.id, {
        isExpanded: true,
        prevBounds: {
          width: sticky.width,
          height: sticky.height,
          transform: { ...transform }
        },
        width: targetWidth,
        height: targetHeight
      });

      if (rect) {
        setTransform({
          scale: targetScale,
          x: rect.width / 2 - (sticky.x + targetWidth / 2) * targetScale,
          y: rect.height / 2 - (sticky.y + targetHeight / 2) * targetScale
        });
      }
    } else {
      const prev = sticky.prevBounds;
      updateStickyNote(sticky.id, {
        isExpanded: false,
        width: prev?.width || 210,
        height: prev?.height || 170,
        prevBounds: null
      });
      if (prev?.transform) {
        setTransform(prev.transform);
      }
    }
  };

  const saveTabTitle = (tabId) => {
    if (editingTabTitle.trim()) {
      setTabs((prev) =>
        prev.map((t) => (t.id === tabId ? { ...t, title: editingTabTitle.trim() } : t))
      );
    }
    setEditingTabId(null);
  };

  // Helper to record history changes
  const updateTree = (newTrees) => {
    const treesArray = Array.isArray(newTrees) ? newTrees : [newTrees];
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1);
          newHistory.push(treesArray);
          return {
            ...tab,
            rootNodes: treesArray,
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        }
        return tab;
      })
    );
  };

  const undo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetTree = history[targetIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId ? { ...t, rootNodes: targetTree, historyIndex: targetIndex } : t
        )
      );
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetTree = history[targetIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId ? { ...t, rootNodes: targetTree, historyIndex: targetIndex } : t
        )
      );
    }
  };

  // Multi-Root Tree Helper Functions
  const findNode = (nodes, id) => {
    for (let node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentNode = (nodes, id) => {
    for (const node of nodes) {
      if (!node.children) continue;
      if (node.children.some((child) => child.id === id)) return node;
      const found = findParentNode(node.children, id);
      if (found) return found;
    }
    return null;
  };

  // Recursive state mutators for list of roots
  const modifyNode = (nodes, targetId, updateFn) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return updateFn(node);
      }
      if (node.children) {
        return {
          ...node,
          children: modifyNode(node.children, targetId, updateFn)
        };
      }
      return node;
    });
  };

  // Add new standalone parent node on the same tab
  const addStandaloneParentNode = (customCoords = null) => {
    const newRootId = `root-${Date.now()}`;
    const defaultTopY = rootNodes.reduce((acc, r) => {
      const computeH = (n) => {
        const h = n.height || (n.isSmall ? 32 : 42);
        if (!n.expanded || !n.children || n.children.length === 0) return h + 16;
        return Math.max(h + 16, n.children.reduce((s, c) => s + computeH(c), 0));
      };
      return acc + computeH(r) + 60;
    }, 0);

    const newRootNode = {
      id: newRootId,
      text: 'New Topic Branch',
      emoji: '⭐',
      colorIndex: (rootNodes.length % (COLOR_PALETTE.length - 1)) + 1,
      expanded: true,
      xOffset: customCoords ? customCoords.x - 80 : 0,
      yOffset: customCoords ? customCoords.y - defaultTopY - 21 : 0,
      width: null,
      height: null,
      note: '',
      isSmall: false,
      children: []
    };

    const newTree = [...rootNodes, newRootNode];
    updateTree(newTree);
    setSelectedNodeId(newRootId);
    setEditingText(newRootNode.text);
    setEditingNodeId(newRootId);
  };

  const deleteNode = (nodeId) => {
    // Check if deleting a root node when multiple exist
    const isRootNode = rootNodes.some((r) => r.id === nodeId);
    if (isRootNode && rootNodes.length <= 1) return; // Prevent deleting the last remaining root

    const removeSubtree = (nodes) =>
      nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? removeSubtree(node.children) : []
        }));

    const newTree = removeSubtree(rootNodes);
    setSelectedNodeId(newTree[0]?.id || null);
    updateTree(newTree);
  };

  const saveNodeText = (nodeId) => {
    if (!editingText.trim()) return;
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      text: editingText.trim()
    }));
    updateTree(newTree);
    setEditingNodeId(null);
  };

  const toggleExpand = (nodeId, e) => {
    if (e) e.stopPropagation();
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      expanded: !node.expanded
    }));
    updateTree(newTree);
  };

  const setNodeColor = (nodeId, colorIndex, customHex = null) => {
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      colorIndex: colorIndex,
      customColor: customHex
    }));
    updateTree(newTree);
    setShowColorPicker(false);
  };

  const setNodeEmoji = (nodeId, emoji) => {
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({ ...node, emoji }));
    updateTree(newTree);
    setShowEmojiPicker(false);
  };

  const toggleLockNode = (nodeId) => {
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      isLocked: !node.isLocked
    }));
    updateTree(newTree);
  };

  const updateNodeDimensions = (nodeId, widthVal, heightVal) => {
    const w = parseInt(widthVal, 10);
    const h = parseInt(heightVal, 10);
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      width: !isNaN(w) && w >= 60 ? w : node.width,
      height: !isNaN(h) && h >= 28 ? h : node.height
    }));
    updateTree(newTree);
  };

  const updateNodePositionDirect = (nodeId, targetXVal, targetYVal) => {
    const coords = nodeCoords[nodeId];
    if (!coords) return;
    const node = coords.data;
    if (node.isLocked) return;

    const baseCanvasX = coords.x - (node.xOffset || 0);
    const baseCanvasY = coords.y - (node.yOffset || 0);

    const parsedX = parseInt(targetXVal, 10);
    const parsedY = parseInt(targetYVal, 10);

    const newXOffset = !isNaN(parsedX) ? parsedX - baseCanvasX : (node.xOffset || 0);
    const newYOffset = !isNaN(parsedY) ? parsedY - baseCanvasY : (node.yOffset || 0);

    const newTree = modifyNode(rootNodes, nodeId, (n) => ({
      ...n,
      xOffset: newXOffset,
      yOffset: newYOffset
    }));
    updateTree(newTree);
  };

  const updateNodeFontSizeDirect = (nodeId, fontVal) => {
    if (fontVal === '') {
      resetFontSize(nodeId);
      return;
    }
    const parsed = parseInt(fontVal, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.max(8, Math.min(120, parsed));
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      fontSize: clamped
    }));
    updateTree(newTree);
  };

  // Node Insertion Helpers
  const addChildNode = (parentId, isSmall = false) => {
    const newChildId = `node-${Date.now()}`;
    const parentNode = findNode(rootNodes, parentId);
    const parentColorIndex = parentNode ? parentNode.colorIndex : 1;

    const newChild = {
      id: newChildId,
      text: isSmall ? 'Small note' : 'New Idea',
      emoji: isSmall ? '📌' : '',
      colorIndex: parentColorIndex,
      expanded: true,
      xOffset: 0,
      yOffset: 0,
      width: isSmall ? 100 : null,
      height: isSmall ? 32 : null,
      isSmall: isSmall,
      children: []
    };

    const newTree = modifyNode(rootNodes, parentId, (node) => ({
      ...node,
      expanded: true,
      children: [...(node.children || []), newChild]
    }));

    updateTree(newTree);
    setSelectedNodeId(newChildId);
    setEditingText(newChild.text);
    setEditingNodeId(newChildId);
  };

  const addSiblingNode = (targetId, isSmall = false) => {
    // Siblings only exist between Child nodes, so do nothing on a Parent (root)
    const isTargetRoot = rootNodes.some((r) => r.id === targetId);
    if (isTargetRoot) return;
    const parentNode = findParentNode(rootNodes, targetId);
    if (!parentNode) return;

    const newSiblingId = `node-${Date.now()}`;
    const targetNode = findNode(rootNodes, targetId);
    const colorIndex = targetNode ? targetNode.colorIndex : 1;

    const newSibling = {
      id: newSiblingId,
      text: isSmall ? 'Small note' : 'New Idea',
      emoji: isSmall ? '📌' : '',
      colorIndex: colorIndex,
      expanded: true,
      xOffset: 0,
      yOffset: 0,
      width: isSmall ? 100 : null,
      height: isSmall ? 32 : null,
      isSmall: isSmall,
      children: []
    };

    const insertSibling = (nodes) => {
      return nodes.map((node) => {
        if (node.id === parentNode.id) {
          const targetIndex = node.children.findIndex((c) => c.id === targetId);
          const updatedChildren = [...node.children];
          updatedChildren.splice(targetIndex + 1, 0, newSibling);
          return {
            ...node,
            children: updatedChildren
          };
        }
        if (node.children) {
          return {
            ...node,
            children: insertSibling(node.children)
          };
        }
        return node;
      });
    };

    const newTree = insertSibling(rootNodes);

    updateTree(newTree);
    setSelectedNodeId(newSiblingId);
    setEditingText(newSibling.text);
    setEditingNodeId(newSiblingId);
  };

  // Adjust Font Size Manually
  const changeFontSize = (nodeId, delta) => {
    const node = findNode(rootNodes, nodeId);
    if (!node) return;
    
    // Calculate fallback base size if no custom fontSize exists yet
    const currentWidth = node.width || 160;
    const currentHeight = node.height || 42;
    const textLen = Math.max((node.text || '').length, 1);
    const innerWidth = Math.max(40, currentWidth - (node.emoji ? 44 : 24));
    const innerHeight = Math.max(20, currentHeight - 14);
    const autoFontSize = Math.max(
      11,
      Math.min(Math.floor(Math.min(Math.sqrt((innerWidth * innerHeight * 1.2) / textLen), innerHeight * 0.55)), 48)
    );

    const baseSize = node.fontSize || autoFontSize;
    const newSize = Math.max(10, Math.min(80, baseSize + delta));

    const newTree = modifyNode(rootNodes, nodeId, (n) => ({
      ...n,
      fontSize: newSize
    }));
    updateTree(newTree);
  };

  const resetFontSize = (nodeId) => {
    const newTree = modifyNode(rootNodes, nodeId, (n) => ({
      ...n,
      fontSize: null
    }));
    updateTree(newTree);
  };

  // Writes the final pan position into React state once, when the drag ends
  const commitPan = useCallback(() => {
    const p = panRef.current;
    if (!p.active) return;
    p.active = false;
    if (p.moved) {
      p.moved = false;
      setTransform((prev) => ({ ...prev, x: p.x, y: p.y }));
    }
  }, []);

  // Canvas Panning & Mouse Movement Handlers
  const handleMouseDown = (e) => {
    if (pendingPlacementMode && containerRef.current) {
      e.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - transform.x) / transform.scale;
      const canvasY = (e.clientY - rect.top - transform.y) / transform.scale;

      if (pendingPlacementMode === 'parentNode') {
        addStandaloneParentNode({ x: canvasX, y: canvasY });
      } else if (pendingPlacementMode === 'stickyNote') {
        addStickyNote({ x: canvasX, y: canvasY });
      }
      setPendingPlacementMode(null);
      return;
    }

    if (e.target.dataset?.canvasBackground === 'true' || e.target === containerRef.current) {
      if (editingNodeId) saveNodeText(editingNodeId);
      setSelectedNodeId(null);
      setSelectedStickyId(null);
      setOpenStickyColorId(null);
      panRef.current = {
        active: true,
        startX: e.clientX - transform.x,
        startY: e.clientY - transform.y,
        x: transform.x,
        y: transform.y,
        moved: false
      };
    }
  };

  const handleMouseMove = (e) => {
    if (panRef.current.active) {
      const p = panRef.current;
      p.x = e.clientX - p.startX;
      p.y = e.clientY - p.startY;
      p.moved = true;
      if (canvasLayerRef.current) {
        canvasLayerRef.current.style.transform = `translate(${p.x}px, ${p.y}px) scale(${transform.scale})`;
      }
    } else if (draggingStickyId) {
      const targetSticky = stickyNotes.find((s) => s.id === draggingStickyId);
      if (targetSticky?.isPinned) return;
      const dx = (e.clientX - stickyDragStart.mouseX) / transform.scale;
      const dy = (e.clientY - stickyDragStart.mouseY) / transform.scale;
      updateStickyNote(draggingStickyId, {
        x: stickyDragStart.noteX + dx,
        y: stickyDragStart.noteY + dy
      });
    } else if (resizingStickyId) {
      const dx = (e.clientX - stickyResizeStart.mouseX) / transform.scale;
      const dy = (e.clientY - stickyResizeStart.mouseY) / transform.scale;
      updateStickyNote(resizingStickyId, {
        width: Math.max(130, stickyResizeStart.w + dx),
        height: Math.max(100, stickyResizeStart.h + dy)
      });
    } else if (draggingNodeId) {
      const activeNode = findNode(rootNodes, draggingNodeId);
      if (activeNode?.isLocked) return; // Prevent dragging locked nodes

      const rawDx = (e.clientX - dragStartPos.x) / transform.scale;
      const rawDy = (e.clientY - dragStartPos.y) / transform.scale;

      const newXOffset = initialNodeOffset.x + rawDx;
      const newYOffset = initialNodeOffset.y + rawDy;

      // Soft alignment guides: a visual hint only, the node position is never changed
      const activeCoords = nodeCoords[draggingNodeId];
      if (activeCoords) {
        const GUIDE_THRESHOLD = 8; // canvas px: how close before a guide line appears

        // Base auto-layout position without custom offsets
        const baseCanvasX = activeCoords.x - (activeCoords.data.xOffset || 0);
        const baseCanvasY = activeCoords.y - (activeCoords.data.yOffset || 0);

        const activeCenterX = baseCanvasX + newXOffset + activeCoords.width / 2;
        const activeCenterY = baseCanvasY + newYOffset + activeCoords.height / 2;

        let guideX = null;
        let guideY = null;
        let bestDX = GUIDE_THRESHOLD;
        let bestDY = GUIDE_THRESHOLD;

        // Show a guide for the closest aligned node on each axis
        Object.keys(nodeCoords).forEach((otherId) => {
          if (otherId === draggingNodeId) return;
          const other = nodeCoords[otherId];
          const otherCenterX = other.x + other.width / 2;
          const otherCenterY = other.y + other.height / 2;

          const dx = Math.abs(activeCenterX - otherCenterX);
          const dy = Math.abs(activeCenterY - otherCenterY);
          if (dx < bestDX) { bestDX = dx; guideX = otherCenterX; }
          if (dy < bestDY) { bestDY = dy; guideY = otherCenterY; }
        });

        // Only update state when the guides actually change (avoids extra re-renders)
        setAlignmentGuides((prev) =>
          prev.x === guideX && prev.y === guideY ? prev : { x: guideX, y: guideY }
        );
      }

      const newTree = modifyNode(rootNodes, draggingNodeId, (node) => ({
        ...node,
        xOffset: newXOffset,
        yOffset: newYOffset
      }));
      setRootNodes(newTree);
    } else if (resizingNodeId) {
      const dx = (e.clientX - resizeStart.x) / transform.scale;
      const dy = (e.clientY - resizeStart.y) / transform.scale;

      const newTree = modifyNode(rootNodes, resizingNodeId, (node) => ({
        ...node,
        width: Math.max(80, resizeStart.w + dx),
        height: Math.max(30, resizeStart.h + dy)
      }));
      setRootNodes(newTree);
    }
  };

  const handleMouseUp = () => {
    if (draggingNodeId || resizingNodeId) {
      updateTree(rootNodes);
    }
    commitPan();
    setDraggingNodeId(null);
    setResizingNodeId(null);
    setDraggingStickyId(null);
    setResizingStickyId(null);
    setAlignmentGuides({ x: null, y: null });
  };

  // Ensure dragging/resizing cancels cleanly when mouse is released anywhere on screen
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      commitPan();
      setDraggingNodeId(null);
      setResizingNodeId(null);
      setDraggingStickyId(null);
      setResizingStickyId(null);
      setAlignmentGuides({ x: null, y: null });
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [commitPan]);

  const centerCanvas = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTransform({
      x: rect.width / 2 - 100,
      y: rect.height / 2 - 50,
      scale: 1
    });
  };

  // Note Modal & Image Upload Handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 10 - noteImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNoteImages((prev) => {
            if (prev.length >= 10) return prev;
            return [...prev, event.target.result];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNoteImage = (indexToRemove) => {
    setNoteImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const saveNodeNote = (nodeId, text, images) => {
    const newTree = modifyNode(rootNodes, nodeId, (node) => ({
      ...node,
      note: text.trim(),
      images: images || []
    }));
    updateTree(newTree);
    setEditingNoteNodeId(null);
  };

  // Zoom handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.2), 3);
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setTransform((prev) => ({
        scale: newScale,
        x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
        y: mouseY - (mouseY - prev.y) * (newScale / prev.scale)
      }));
    } else {
      setTransform((prev) => ({
        ...prev,
        scale: newScale
      }));
    }
  };
  // Attach wheel as non-passive so preventDefault() actually works
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => handleWheel(e);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });
  // JSON Import & Export
  const exportJSON = () => {
    const exportPayload = {
      rootNodes,
      stickyNotes
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'mindmap.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target.result);
          if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData.rootNodes) {
            const treesArray = Array.isArray(parsedData.rootNodes) ? parsedData.rootNodes : [parsedData.rootNodes];
            const importedStickies = Array.isArray(parsedData.stickyNotes) ? parsedData.stickyNotes : [];
            setStickyNotes(importedStickies);
            updateTree(treesArray);
            setSelectedNodeId(treesArray[0]?.id || null);
          } else {
            const treesArray = Array.isArray(parsedData) ? parsedData : [parsedData];
            updateTree(treesArray);
            setSelectedNodeId(treesArray[0]?.id || null);
          }
        } catch (err) {
          console.error('Failed to parse JSON file');
        }
      };
    }
  };

  // Markdown Converter
  const generateMarkdown = (node, depth = 0) => {
    const indent = '  '.repeat(depth);
    const emojiStr = node.emoji ? `${node.emoji} ` : '';
    let result = `${indent}- ${emojiStr}${node.text}\n`;
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        result += generateMarkdown(child, depth + 1);
      });
    }
    return result;
  };

  const handleExportMarkdown = () => {
    let md = '';
    rootNodes.forEach((root, idx) => {
      md += `# Mind Map Root ${idx + 1}\n` + generateMarkdown(root, 0) + '\n';
    });
    if (stickyNotes.length > 0) {
      md += `## Sticky Notes\n`;
      stickyNotes.forEach((sticky, idx) => {
        md += `- **Note ${idx + 1}:** ${sticky.text.replace(/\n/g, ' ')}\n`;
      });
    }
    setMarkdownContent(md);
    setShowMarkdownModal(true);
  };

  // Global Keydown Handler for Navigation & Editing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && pendingPlacementMode) {
        e.preventDefault();
        setPendingPlacementMode(null);
        return;
      }

      // Disable shortcuts when editing text, writing a note, or typing in search bar
      if (
        editingNodeId ||
        editingNoteNodeId ||
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Hotkey 'Z' or 'z' toggles overlay pop in/out (without Ctrl/Cmd modifier)
      if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowNodeOverlay((prev) => !prev);
        return;
      }

      // Hotkey 'L' or 'l' toggles position lock on the currently selected node or sticky note
      if (e.key === 'l' || e.key === 'L') {
        if (!e.ctrlKey && !e.metaKey) {
          if (selectedStickyId) {
            e.preventDefault();
            const targetSticky = stickyNotes.find((s) => s.id === selectedStickyId);
            if (targetSticky) updateStickyNote(selectedStickyId, { isPinned: !targetSticky.isPinned });
            return;
          }
          if (selectedNodeId) {
            e.preventDefault();
            toggleLockNode(selectedNodeId);
            return;
          }
        }
      }

      // Undo / Redo shortcuts
	  const zKey = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (zKey === 'z' || zKey === 'y')) {
        e.preventDefault();
        if (zKey === 'y' || e.shiftKey) redo();
        else undo();
        return;
      }

      // Delete selected sticky note
      if (selectedStickyId && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        deleteStickyNote(selectedStickyId);
        return;
      }

      if (!selectedNodeId) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        addChildNode(selectedNodeId);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        addSiblingNode(selectedNodeId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedStickyId, stickyNotes, editingNodeId, editingNoteNodeId, rootNodes, historyIndex, history, pendingPlacementMode]);

  // Tree Layout Engine supporting Multiple Independent Parent Roots on Same Sheet
  const calculateTreeLayout = useCallback(() => {
    const VERTICAL_GAP = 16;
    const HORIZONTAL_GAP = 220;

    // Calculate subtree vertical height for proportional branch distribution
    const computeSubtreeHeight = (node) => {
      const nodeH = node.height || (node.isSmall ? 32 : 42);
      if (!node.expanded || !node.children || node.children.length === 0) {
        return nodeH + VERTICAL_GAP;
      }
      let total = 0;
      node.children.forEach((child) => {
        total += computeSubtreeHeight(child);
      });
      return Math.max(nodeH + VERTICAL_GAP, total);
    };

    const coords = {};
    const lines = [];

    const layoutNode = (node, depth, topY, parentCoords = null) => {
      const nodeW = node.width || (node.isSmall ? 100 : 160);
      const nodeH = node.height || (node.isSmall ? 32 : 42);
      const subtreeH = computeSubtreeHeight(node);

      // Apply user free-position custom offsets on top of computed layout
      const baseX = depth * HORIZONTAL_GAP;
      const baseY = topY + subtreeH / 2 - nodeH / 2;

      const x = baseX + (node.xOffset || 0);
      const y = baseY + (node.yOffset || 0);

      coords[node.id] = { x, y, width: nodeW, height: nodeH, data: node };

      if (parentCoords) {
        lines.push({
          id: `${parentCoords.data.id}-${node.id}`,
          x1: parentCoords.x + parentCoords.width,
          y1: parentCoords.y + parentCoords.height / 2,
          x2: x,
          y2: y + nodeH / 2,
          colorIndex: node.colorIndex,
          customColor: node.customColor
        });
      }

      if (node.expanded && node.children && node.children.length > 0) {
        let currentChildTop = topY;
        node.children.forEach((child) => {
          const childSubtreeH = computeSubtreeHeight(child);
          layoutNode(child, depth + 1, currentChildTop, coords[node.id]);
          currentChildTop += childSubtreeH;
        });
      }
    };

    let currentRootTop = 0;
    rootNodes.forEach((root) => {
      const rootHeight = computeSubtreeHeight(root);
      layoutNode(root, 0, currentRootTop, null);
      currentRootTop += rootHeight + 60; // Padding between independent parent trees
    });

    return { coords, lines };
  }, [rootNodes]);

  const { coords: nodeCoords, lines } = useMemo(() => calculateTreeLayout(), [calculateTreeLayout]);

  // Reset all free-drag offsets back to clean automatic tree alignment
  const resetAutoLayout = () => {
    const clearOffsets = (nodes) =>
      nodes.map((node) => ({
        ...node,
        xOffset: 0,
        yOffset: 0,
        children: node.children ? clearOffsets(node.children) : []
      }));
    updateTree(clearOffsets(rootNodes));
  };

  // Latest state/functions for the memoized MapNode handlers (read at click time)
  const nodeCtx = useRef(null);
  useEffect(() => {
    nodeCtx.current = {
      rootNodes, updateTree, saveNodeText, toggleExpand,
      setSelectedNodeId, setSelectedStickyId, setOpenStickyColorId,
      setEditingText, setEditingNodeId, setDraggingNodeId, setDragStartPos,
      setInitialNodeOffset, setDraggedNodeId, setDragOverNodeId,
      setResizingNodeId, setResizeStart, setNoteText, setNoteImages, setEditingNoteNodeId
    };
  });

  // Search Filter Check
  const isSearchMatch = (node) => {
    if (!searchQuery.trim()) return false;
    return node.text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden select-none font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navigation & Sheet Tabs Header */}
      <div className="flex flex-col border-b border-slate-800 bg-slate-900/95 backdrop-blur-md z-30">
        {/* Main App Bar */}
        <div className="h-14 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Free Map
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </h1>
            </div>
          </div>

          {/* Center Quick Actions */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() =>
                setPendingPlacementMode((prev) => (prev === 'parentNode' ? null : 'parentNode'))
              }
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md ${
                pendingPlacementMode === 'parentNode'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
              title="Click on the canvas to place a new Parent Topic Tree"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {pendingPlacementMode === 'parentNode' ? 'Click Canvas...' : 'Parent Node'}
              </span>
            </button>

            <button
              onClick={() =>
                setPendingPlacementMode((prev) => (prev === 'stickyNote' ? null : 'stickyNote'))
              }
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                pendingPlacementMode === 'stickyNote'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-200 shadow-md'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-200'
              }`}
              title="Click on the canvas to place a Sticky Note"
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {pendingPlacementMode === 'stickyNote' ? 'Click Canvas...' : '+ Sticky Note'}
              </span>
            </button>

            <div className="h-5 w-px bg-slate-800 mx-1" />

            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
			
			<button
			  onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition"
              title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Right Tools: Search, Import/Export, Theme, Help */}
          <div className="flex items-center space-x-1.5">
            <div className="relative hidden md:flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44 transition"
              />
            </div>

            <button
              onClick={exportJSON}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              title="Export Map & Sticky Notes (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Import Map (JSON)"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>

            <button
              onClick={handleExportMarkdown}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              title="Export Markdown Outline"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              title="Toggle Canvas Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              title="Keyboard Shortcuts & Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sheet Tabs Bar */}
        <div className="px-4 py-1.5 flex items-center space-x-1.5 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setSelectedNodeId(tab.rootNodes[0]?.id || null);
                  setSelectedStickyId(null);
                }}
                onDoubleClick={() => {
                  setEditingTabId(tab.id);
                  setEditingTabTitle(tab.title);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer transition ${
                  isActive
                    ? 'bg-indigo-600/25 border border-indigo-500/50 text-indigo-200'
                    : 'hover:bg-slate-800/70 text-slate-400 border border-transparent'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                {editingTabId === tab.id ? (
                  <input
                    type="text"
                    value={editingTabTitle}
                    autoFocus
                    onChange={(e) => setEditingTabTitle(e.target.value)}
                    onBlur={() => saveTabTitle(tab.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTabTitle(tab.id);
                      if (e.key === 'Escape') setEditingTabId(null);
                    }}
                    className="bg-slate-900 text-white px-1 rounded outline-none w-28"
                  />
                ) : (
                  <span>{tab.title}</span>
                )}

                {tabs.length > 1 && (
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    className="p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition ml-1"
                    title="Close tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={addNewTab}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition"
            title="Add New Mind Map Sheet"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        data-canvas-background="true"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 relative overflow-hidden ${
          pendingPlacementMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
        } ${
          darkMode ? 'bg-slate-950' : 'bg-slate-50'
        }`}
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Interactive Click-to-Place Prompt Banner */}
        {pendingPlacementMode && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-indigo-600/95 border border-indigo-400 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in"
          >
            <span>
              Click anywhere on the canvas to place your{' '}
              {pendingPlacementMode === 'parentNode' ? 'new Parent Node' : 'Sticky Note'}
            </span>
            <button
              onClick={() => setPendingPlacementMode(null)}
              className="px-2 py-0.5 rounded-full bg-slate-900/50 hover:bg-slate-900 text-indigo-100 text-[11px] transition flex items-center gap-1"
              title="Cancel placement (Esc)"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}

        {/* Node Toolbar Popover (Locked at the Bottom Section of the Canvas when a Node is Selected) */}
        {showNodeOverlay && selectedNodeId && nodeCoords[selectedNodeId] && (
          <div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col gap-1.5 p-2.5 rounded-2xl border shadow-2xl bg-slate-900/95 border-slate-700/80 text-white backdrop-blur-md transition-all pointer-events-auto max-w-[95vw]"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Row: Primary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-1">
              <button
                onClick={() => addChildNode(selectedNodeId, false)}
                className="px-2.5 py-1.5 rounded-xl hover:bg-indigo-600 bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 hover:text-white transition flex items-center text-xs font-semibold gap-1"
                title="Add Child Node (Tab)"
              >
                <Plus className="w-3.5 h-3.5" /> Child
              </button>
              <button
                onClick={() => addChildNode(selectedNodeId, true)}
                className="px-2 py-1.5 rounded-xl hover:bg-amber-600 bg-amber-600/20 border border-amber-500/40 text-amber-200 hover:text-white transition flex items-center text-xs font-semibold gap-1"
                title="Add Small Sticky Child"
              >
                <StickyNote className="w-3.5 h-3.5" /> Small
              </button>
              <button
                onClick={() => addSiblingNode(selectedNodeId, false)}
                disabled={rootNodes.some((r) => r.id === selectedNodeId)}
                className="px-2 py-1.5 rounded-xl hover:bg-slate-800 bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white transition flex items-center text-xs font-semibold gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Add Sibling Node (Enter) - Child nodes only"
              >
                <ArrowRight className="w-3.5 h-3.5" /> Sibling
              </button>

              <div className="w-px h-5 bg-slate-700/60 mx-0.5" />

              <button
                onClick={() => {
                  const node = findNode(rootNodes, selectedNodeId);
                  if (node) {
                    setNoteText(node.note || '');
                    setNoteImages(node.images || []);
                    setEditingNoteNodeId(selectedNodeId);
                  }
                }}
                className="px-2 py-1.5 rounded-xl hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition flex items-center gap-1 text-xs font-medium"
                title="Add / Edit Note & Images"
              >
                <FileText className="w-3.5 h-3.5" /> Note
              </button>
            </div>

            {/* Bottom Row: Formatting, Styling & Controls */}
            <div className="flex flex-wrap items-center gap-1 justify-between pt-1 border-t border-slate-800">
              <button
                onClick={() => toggleLockNode(selectedNodeId)}
                className={`p-1.5 rounded-xl border transition ${
                  findNode(rootNodes, selectedNodeId)?.isLocked
                    ? 'bg-rose-600/25 border-rose-500/60 text-rose-300'
                    : 'hover:bg-slate-800 border-slate-700/50 text-slate-200'
                }`}
                title="Lock / Unlock Node Position (L)"
              >
                {findNode(rootNodes, selectedNodeId)?.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>

              <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/60">
                <button
                  onClick={() => changeFontSize(selectedNodeId, -2)}
                  className="px-2 py-1 rounded-lg hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <button
                  onClick={() => changeFontSize(selectedNodeId, 2)}
                  className="px-2 py-1 rounded-lg hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                  title="Increase Font Size"
                >
                  A+
                </button>
                {findNode(rootNodes, selectedNodeId)?.fontSize && (
                  <button
                    onClick={() => resetFontSize(selectedNodeId)}
                    className="px-1.5 py-0.5 text-[10px] rounded-md hover:bg-indigo-600/40 text-indigo-300 font-semibold ml-0.5 transition"
                    title="Reset to Auto Font Size"
                  >
                    Auto
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-800 border border-slate-700/50 text-slate-200 transition"
                    title="Node Theme Color"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute bottom-11 left-0 p-2.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col gap-2 z-50 w-52">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Preset Themes</span>
                      <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-0.5">
                        {COLOR_PALETTE.map((col, idx) => (
                          <button
                            key={idx}
                            onClick={() => setNodeColor(selectedNodeId, idx, null)}
                            className="w-7 h-7 rounded-lg border border-white/20 transition hover:scale-110 active:scale-95 shadow-sm"
                            title={col.label}
                            style={{ backgroundColor: col.accent }}
                          />
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Custom Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={findNode(rootNodes, selectedNodeId)?.customColor || '#6366f1'}
                            onChange={(e) => setNodeColor(selectedNodeId, null, e.target.value)}
                            className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                            title="Pick Custom Color"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowColorPicker(false);
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-800 border border-slate-700/50 text-slate-200 transition"
                    title="Node Emoji Icon"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-11 right-0 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl grid grid-cols-4 gap-1 z-50 w-44">
                      <button
                        onClick={() => setNodeEmoji(selectedNodeId, '')}
                        className="col-span-4 py-1 text-[10px] text-slate-400 hover:bg-slate-800 rounded mb-1"
                      >
                        Remove Emoji
                      </button>
                      {EMOJI_PRESETS.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => setNodeEmoji(selectedNodeId, emoji)}
                          className="w-8 h-8 rounded-lg hover:bg-slate-800 text-lg transition flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-5 bg-slate-700/60 mx-0.5" />

                <button
                  onClick={() => {
                    const node = findNode(rootNodes, selectedNodeId);
                    if (node) {
                      setEditingText(node.text);
                      setEditingNodeId(selectedNodeId);
                    }
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-800 border border-slate-700/50 text-slate-200 transition"
                  title="Rename Node"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {(rootNodes.length > 1 || !rootNodes.some((r) => r.id === selectedNodeId)) && (
                  <button
                    onClick={() => deleteNode(selectedNodeId)}
                    className="p-1.5 rounded-xl hover:bg-rose-900/40 border border-rose-800/50 text-rose-300 hover:text-rose-100 transition"
                    title="Delete Node (Delete/Backspace)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Third Row: Precise Measurement Inputs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
              <div className="flex items-center space-x-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-500">X:</span>
                <input
                  type="number"
                  disabled={findNode(rootNodes, selectedNodeId)?.isLocked}
                  value={Math.round(nodeCoords[selectedNodeId]?.x || 0)}
                  onChange={(e) => updateNodePositionDirect(selectedNodeId, e.target.value, Math.round(nodeCoords[selectedNodeId]?.y || 0))}
                  className="w-11 bg-transparent text-slate-200 font-mono text-center outline-none focus:text-indigo-400 disabled:opacity-50"
                  title="Precise X Position (px)"
                />
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-500">Y:</span>
                <input
                  type="number"
                  disabled={findNode(rootNodes, selectedNodeId)?.isLocked}
                  value={Math.round(nodeCoords[selectedNodeId]?.y || 0)}
                  onChange={(e) => updateNodePositionDirect(selectedNodeId, Math.round(nodeCoords[selectedNodeId]?.x || 0), e.target.value)}
                  className="w-11 bg-transparent text-slate-200 font-mono text-center outline-none focus:text-indigo-400 disabled:opacity-50"
                  title="Precise Y Position (px)"
                />
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-500">W:</span>
                <input
                  type="number"
                  value={Math.round(nodeCoords[selectedNodeId]?.width || 160)}
                  onChange={(e) => updateNodeDimensions(selectedNodeId, e.target.value, nodeCoords[selectedNodeId]?.height)}
                  className="w-10 bg-transparent text-slate-200 font-mono text-center outline-none focus:text-indigo-400"
                  title="Precise Width (px)"
                />
                <span className="text-slate-600">px</span>
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-500">H:</span>
                <input
                  type="number"
                  value={Math.round(nodeCoords[selectedNodeId]?.height || 42)}
                  onChange={(e) => updateNodeDimensions(selectedNodeId, nodeCoords[selectedNodeId]?.width, e.target.value)}
                  className="w-10 bg-transparent text-slate-200 font-mono text-center outline-none focus:text-indigo-400"
                  title="Precise Height (px)"
                />
                <span className="text-slate-600">px</span>
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-500">Font:</span>
                <input
                  type="number"
                  placeholder="Auto"
                  value={findNode(rootNodes, selectedNodeId)?.fontSize || ''}
                  onChange={(e) => updateNodeFontSizeDirect(selectedNodeId, e.target.value)}
                  className="w-10 bg-transparent text-slate-200 font-mono text-center outline-none focus:text-indigo-400"
                  title="Precise Font Size (px)"
                />
                <span className="text-slate-600">px</span>
              </div>
            </div>
          </div>
        )}

        {/* Scalable Container for SVG Connecting Lines & Nodes */}
        <div
          ref={canvasLayerRef}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0'
          }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute top-0 left-0 w-[10000px] h-[10000px] overflow-visible pointer-events-none">
            {lines.map((line) => {
              const strokeColor = line.customColor
                ? line.customColor
                : (COLOR_PALETTE[line.colorIndex] || COLOR_PALETTE[1]).accent;
              const deltaX = Math.abs(line.x2 - line.x1) * 0.5;
              const pathData = `M ${line.x1} ${line.y1} C ${line.x1 + deltaX} ${line.y1}, ${line.x2 - deltaX} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <path
                  key={line.id}
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-opacity duration-300 opacity-80 hover:opacity-100"
                />
              );
            })}

            {/* Alignment Guide Lines (Snapped axes while dragging) */}
            {alignmentGuides.x !== null && (
              <line
                x1={alignmentGuides.x}
                y1={-10000}
                x2={alignmentGuides.x}
                y2={10000}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-pulse opacity-90"
              />
            )}
            {alignmentGuides.y !== null && (
              <line
                x1={-10000}
                y1={alignmentGuides.y}
                x2={10000}
                y2={alignmentGuides.y}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-pulse opacity-90"
              />
            )}
          </svg>

          {/* Render All Nodes (memoized) */}
          {Object.values(nodeCoords).map((coords) => {
            const nodeId = coords.data.id;
            return (
              <MapNode
                key={nodeId}
                coords={coords}
                isSelected={selectedNodeId === nodeId}
                isEditing={editingNodeId === nodeId}
                isDragOver={dragOverNodeId === nodeId}
                isMatch={isSearchMatch(coords.data)}
                editingText={editingNodeId === nodeId ? editingText : ''}
                draggedNodeId={draggedNodeId}
                ctx={nodeCtx}
                nodeRefs={nodeRefs}
              />
            );
          })}

          {/* Render Free-Positioning Sticky Notes */}
          {stickyNotes.map((sticky) => {
            const isSelected = selectedStickyId === sticky.id;
            const textColor = getContrastTextColor(sticky.color);
            const isDarkBg = textColor === '#f8fafc';

            return (
              <div
                key={sticky.id}
                style={{
                  left: `${sticky.x}px`,
                  top: `${sticky.y}px`,
                  width: `${sticky.width}px`,
                  height: `${sticky.height}px`,
                  backgroundColor: sticky.color,
                  borderColor: sticky.borderColor || 'rgba(0,0,0,0.18)',
                  color: textColor
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStickyId(sticky.id);
                  setSelectedNodeId(null);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  toggleStickyZoomEnlarge(sticky);
                }}
                className={`absolute pointer-events-auto rounded-xl border-2 shadow-2xl flex flex-col transition-[background-color,border-color,box-shadow,transform,scale,opacity] duration-200 ${
                  isSelected ? 'ring-4 ring-indigo-500/80 z-30' : 'z-20'
                }`}
              >
                {/* Sticky Note Top Drag & Control Bar */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedStickyId(sticky.id);
                    setSelectedNodeId(null);
                    if (!sticky.isPinned) {
                      setDraggingStickyId(sticky.id);
                      setStickyDragStart({
                        mouseX: e.clientX,
                        mouseY: e.clientY,
                        noteX: sticky.x,
                        noteY: sticky.y
                      });
                    }
                  }}
                  className={`h-8 px-2 flex items-center justify-between border-b select-none rounded-t-[10px] ${
                    sticky.isPinned ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                  }`}
                  style={{
                    borderColor: isDarkBg ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                    backgroundColor: isDarkBg ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Pin / Lock Position Toggle & Font Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStickyNote(sticky.id, { isPinned: !sticky.isPinned });
                      }}
                      className={`p-1 rounded-md transition ${
                        sticky.isPinned
                          ? 'bg-rose-600 text-white shadow-sm'
                          : isDarkBg
                          ? 'hover:bg-white/10 text-slate-200'
                          : 'hover:bg-black/10 text-slate-700'
                      }`}
                      title={sticky.isPinned ? 'Unpin Sticky Note (L)' : 'Pin / Lock Sticky Note Position (L)'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    {/* Font Family Selector */}
                    <select
                      value={sticky.fontFamily || 'sans'}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStickyNote(sticky.id, { fontFamily: e.target.value })}
                      className={`text-[10px] font-semibold rounded px-1 py-0.5 outline-none cursor-pointer border ${
                        isDarkBg
                          ? 'bg-slate-800 border-slate-700 text-slate-200'
                          : 'bg-white/70 border-black/15 text-slate-800'
                      }`}
                      title="Font Family"
                    >
                      <option value="sans" className="text-slate-900 bg-white">Sans</option>
                      <option value="serif" className="text-slate-900 bg-white">Serif</option>
                      <option value="mono" className="text-slate-900 bg-white">Mono</option>
                    </select>

                    {/* Font Size Decrease / Increase */}
                    <div className="flex items-center">
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextSize = Math.max(10, (sticky.fontSize || 13) - 2);
                          updateStickyNote(sticky.id, { fontSize: nextSize });
                        }}
                        className={`px-1 py-0.5 rounded text-[10px] font-bold transition ${
                          isDarkBg ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-black/10 text-slate-800'
                        }`}
                        title="Decrease Font Size"
                      >
                        A-
                      </button>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextSize = Math.min(36, (sticky.fontSize || 13) + 2);
                          updateStickyNote(sticky.id, { fontSize: nextSize });
                        }}
                        className={`px-1 py-0.5 rounded text-[10px] font-bold transition ${
                          isDarkBg ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-black/10 text-slate-800'
                        }`}
                        title="Increase Font Size"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* Right Actions: Color Palette, Enlarge/Zoom & Delete */}
                  <div className="flex items-center space-x-0.5 relative">
                    {/* Upload Images (Max 10) */}
                    <label
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        (sticky.images?.length || 0) >= 10
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkBg
                          ? 'hover:bg-white/10 text-slate-200'
                          : 'hover:bg-black/10 text-slate-700'
                      }`}
                      title={`Upload Images (${sticky.images?.length || 0}/10)`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={(sticky.images?.length || 0) >= 10}
                        onChange={(e) => handleStickyImageUpload(sticky.id, e)}
                        className="hidden"
                      />
                    </label>

                    {/* Upload PDFs (Max 10) */}
                    <label
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        (sticky.pdfs?.length || 0) >= 10
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkBg
                          ? 'hover:bg-white/10 text-slate-200'
                          : 'hover:bg-black/10 text-slate-700'
                      }`}
                      title={`Upload PDFs (${sticky.pdfs?.length || 0}/10)`}
                    >
                      <File className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        multiple
                        disabled={(sticky.pdfs?.length || 0) >= 10}
                        onChange={(e) => handleStickyPdfUpload(sticky.id, e)}
                        className="hidden"
                      />
                    </label>

                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenStickyColorId(openStickyColorId === sticky.id ? null : sticky.id);
                      }}
                      className={`p-1 rounded-md transition ${
                        isDarkBg ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-black/10 text-slate-700'
                      }`}
                      title="Change Sticky Note Color"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStickyZoomEnlarge(sticky);
                      }}
                      className={`p-1 rounded-md transition ${
                        sticky.isExpanded
                          ? 'bg-indigo-600 text-white'
                          : isDarkBg
                          ? 'hover:bg-white/10 text-slate-200'
                          : 'hover:bg-black/10 text-slate-700'
                      }`}
                      title={sticky.isExpanded ? 'Restore Sticky Note Size & Zoom' : 'Enlarge & Zoom to Sticky Note (or Double-Click)'}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStickyNote(sticky.id);
                      }}
                      className={`p-1 rounded-md transition ${
                        isDarkBg ? 'hover:bg-rose-500/30 text-rose-300' : 'hover:bg-rose-500/20 text-rose-700'
                      }`}
                      title="Delete Sticky Note"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Sticky Note Color Preset & Custom Color Popover */}
                    {openStickyColorId === sticky.id && (
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-7 right-0 p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 w-44 text-slate-100 flex flex-col gap-2"
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Color Presets
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {STICKY_NOTE_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                updateStickyNote(sticky.id, {
                                  color: preset.bg,
                                  borderColor: preset.border
                                });
                                setOpenStickyColorId(null);
                              }}
                              className="w-7 h-7 rounded-lg border border-white/25 hover:scale-110 transition shadow-sm"
                              style={{ backgroundColor: preset.bg }}
                              title={preset.label}
                            />
                          ))}
                        </div>

                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Any Color
                          </span>
                          <input
                            type="color"
                            value={sticky.color}
                            onChange={(e) =>
                              updateStickyNote(sticky.id, {
                                color: e.target.value,
                                borderColor: e.target.value
                              })
                            }
                            className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
                            title="Pick Any Custom Color"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Note Editable Body */}
                <textarea
                  value={sticky.text}
                  onMouseDown={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    toggleStickyZoomEnlarge(sticky);
                  }}
                  onFocus={() => {
                    setSelectedStickyId(sticky.id);
                    setSelectedNodeId(null);
                  }}
                  onChange={(e) => updateStickyNote(sticky.id, { text: e.target.value })}
                  placeholder="Write sticky note..."
                  className={`flex-1 w-full p-2.5 bg-transparent resize-none outline-none font-medium leading-relaxed ${
                    sticky.fontFamily === 'serif'
                      ? 'font-serif'
                      : sticky.fontFamily === 'mono'
                      ? 'font-mono'
                      : 'font-sans'
                  }`}
                  style={{
                    color: textColor,
                    fontSize: `${sticky.fontSize || 13}px`
                  }}
                />

                {/* Shrunk Attachment Icons Strip (Images & PDFs) */}
                {((sticky.images && sticky.images.length > 0) || (sticky.pdfs && sticky.pdfs.length > 0)) && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                    className="px-2 pb-2 pt-1 flex flex-wrap gap-1.5 border-t"
                    style={{
                      borderColor: isDarkBg ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Small Image Thumbnail Icons */}
                    {(sticky.images || []).map((imgSrc, idx) => (
                      <div
                        key={`img-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedStickyAttachment({ stickyId: sticky.id, type: 'image', index: idx });
                        }}
                        className="relative group w-7 h-7 rounded-md overflow-hidden border border-black/25 cursor-pointer hover:scale-110 transition shadow-sm bg-slate-900/10 flex-shrink-0"
                        title="Click to enlarge image"
                      >
                        <img src={imgSrc} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextImgs = (sticky.images || []).filter((_, i) => i !== idx);
                            updateStickyNote(sticky.id, { images: nextImgs });
                            if (
                              expandedStickyAttachment?.stickyId === sticky.id &&
                              expandedStickyAttachment?.type === 'image' &&
                              expandedStickyAttachment?.index === idx
                            ) {
                              setExpandedStickyAttachment(null);
                            }
                          }}
                          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          title="Remove image"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}

                    {/* Small PDF Icons */}
                    {(sticky.pdfs || []).map((pdfItem, idx) => (
                      <div
                        key={`pdf-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openStickyPdfInNewTab(pdfItem);
                        }}
                        className="relative group h-7 px-1.5 rounded-md border border-rose-500/40 bg-rose-600/15 hover:bg-rose-600/25 cursor-pointer hover:scale-105 transition shadow-sm flex items-center gap-1 max-w-[84px]"
                        title={`${pdfItem.name} (Click to open in new tab)`}
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="text-[9px] font-bold truncate">{pdfItem.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextPdfs = (sticky.pdfs || []).filter((_, i) => i !== idx);
                            updateStickyNote(sticky.id, { pdfs: nextPdfs });
                          }}
                          className="ml-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                          title="Remove PDF"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom-Right Resize Handle */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedStickyId(sticky.id);
                    setResizingStickyId(sticky.id);
                    setStickyResizeStart({
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                      w: sticky.width,
                      h: sticky.height
                    });
                  }}
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 opacity-60 hover:opacity-100"
                  title="Drag corner to resize sticky note"
                >
                  <div
                    className="w-2.5 h-2.5 border-r-2 border-b-2 rounded-br-[2px]"
                    style={{ borderColor: textColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Zoom & Controls Bar */}
        <div className="fixed bottom-6 right-6 flex items-center space-x-2 z-20 pointer-events-auto">
          <button
            onClick={() => setShowNodeOverlay(!showNodeOverlay)}
            className={`px-3 py-2 rounded-xl border shadow-lg backdrop-blur-md transition flex items-center gap-1.5 text-xs font-medium ${
              showNodeOverlay
                ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-indigo-600/90 border-indigo-500 text-white hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
            title="Toggle Node Action Overlay (Shortcut: Z)"
          >
            {showNodeOverlay ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-indigo-200" />}
            <span>{showNodeOverlay ? 'Hide Overlay (Z)' : 'Show Overlay (Z)'}</span>
          </button>

          <button
            onClick={resetAutoLayout}
            className="px-3 py-2 rounded-xl border shadow-lg backdrop-blur-md bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-medium"
            title="Reset Free Node Positions to Auto Tree Alignment"
          >
            <Layout className="w-4 h-4 text-indigo-400" />
            Auto Layout
          </button>

          <div className="flex items-center space-x-1 p-1 rounded-xl border shadow-lg backdrop-blur-md bg-slate-900/90 border-slate-700 text-slate-200">
            <button
              onClick={() => setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }))}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.2) }))}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-700/50 mx-1" />
            <button
              onClick={centerCanvas}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition flex items-center gap-1 text-xs"
              title="Reset View & Center Node"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Help Floating Tip Banner */}
        <div className="fixed bottom-6 left-6 hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl border shadow-lg backdrop-blur-md bg-slate-900/80 border-slate-800 text-xs text-slate-400 z-20 pointer-events-auto">
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">Drag Node</kbd>
            Move Freely
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">Corner Handle</kbd>
            Resize
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">Tab</kbd>
            Child
          </span>
        </div>
      </div>

      {/* Help / Shortcuts Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <HelpCircle className="w-5 h-5 text-indigo-400" /> Free Map Shortcuts
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Add Child Node</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Tab</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Add Sibling Node</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Enter</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Lock / Unlock Node Position</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">L</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Toggle Action Overlay</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Z</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Delete Selected Node</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Delete / Backspace</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Undo / Redo</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Ctrl+Z / Ctrl+Shift+Z</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span>Edit Node Label</span>
                <span className="text-slate-400">Double-Click Node</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span>Re-parent Branch</span>
                <span className="text-slate-400">Drag & Drop onto target node</span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Markdown Export Modal */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-indigo-400" /> Exported Markdown Outline
              </h3>
              <button
                onClick={() => setShowMarkdownModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              readOnly
              value={markdownContent}
              className="w-full h-64 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 focus:outline-none select-all"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(markdownContent);
                  setShowMarkdownModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {editingNoteNodeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-amber-400" /> Topic Note & Images
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const bullet = '• ';
                    setNoteText((prev) => (prev ? `${prev}\n${bullet}` : bullet));
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium transition flex items-center gap-1 border border-slate-700/60"
                  title="Insert Bullet Point"
                >
                  <List className="w-3.5 h-3.5" /> Bullet
                </button>

                {/* Manual Image Upload Button */}
                <label
                  className={`px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium transition flex items-center gap-1 border border-slate-700/60 cursor-pointer ${
                    noteImages.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={noteImages.length >= 10 ? 'Maximum 10 images reached' : 'Upload Images (Max 10)'}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Images ({noteImages.length}/10)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={noteImages.length >= 10}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    setEditingNoteNodeId(null);
                    setNoteImages([]);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Attached Image Previews Grid */}
            {noteImages.length > 0 && (
              <div className="mb-3 grid grid-cols-5 gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                {noteImages.map((imgSrc, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                    <img src={imgSrc} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeNoteImage(idx)}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                      title="Remove Image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  const target = e.target;
                  const selectionStart = target.selectionStart;
                  const textBeforeCursor = noteText.substring(0, selectionStart);
                  const lastNewLineIndex = textBeforeCursor.lastIndexOf('\n');
                  const currentLine = textBeforeCursor.substring(lastNewLineIndex + 1);

                  // Check if current line starts with bullet marker
                  if (/^\s*•\s*/.test(currentLine)) {
                    e.preventDefault();
                    if (/^\s*•\s*$/.test(currentLine)) {
                      const textAfterCursor = noteText.substring(selectionStart);
                      const updatedText = noteText.substring(0, lastNewLineIndex + 1) + textAfterCursor;
                      setNoteText(updatedText);
                    } else {
                      const textAfterCursor = noteText.substring(selectionStart);
                      const bulletPrefix = '\n• ';
                      const updatedText = textBeforeCursor + bulletPrefix + textAfterCursor;
                      setNoteText(updatedText);
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = selectionStart + bulletPrefix.length;
                      }, 0);
                    }
                  } else if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    saveNodeNote(editingNoteNodeId, noteText, noteImages);
                  }
                }
              }}
              autoFocus
              placeholder="Write detailed notes, links, or sub-bullets for this node... (Press 'Images' to attach up to 10 photos manually)"
              className="w-full h-36 p-3 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-y"
            />
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => saveNodeNote(editingNoteNodeId, '', [])}
                className="px-3 py-1.5 rounded-xl hover:bg-rose-950/40 text-rose-400 text-xs transition"
              >
                Clear All
              </button>
              <button
                onClick={() => saveNodeNote(editingNoteNodeId, noteText, noteImages)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                Save Note & Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Sticky Note Attachment Viewer Modal (Image or PDF) */}
      {expandedStickyAttachment && (() => {
        const targetSticky = stickyNotes.find((s) => s.id === expandedStickyAttachment.stickyId);
        if (!targetSticky) return null;
        const isImage = expandedStickyAttachment.type === 'image';
        const imageSrc = isImage ? targetSticky.images?.[expandedStickyAttachment.index] : null;
        const pdfObj = !isImage ? targetSticky.pdfs?.[expandedStickyAttachment.index] : null;
        if (isImage && !imageSrc) return null;
        if (!isImage && !pdfObj) return null;

        return (
          <div
            onClick={() => setExpandedStickyAttachment(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Viewer Header with Dedicated Shrink Button */}
              <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 truncate">
                  {isImage ? (
                    <>
                      <ImageIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>Image {expandedStickyAttachment.index + 1} of {targetSticky.images.length}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span className="truncate">{pdfObj.name}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setExpandedStickyAttachment(null)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md"
                  title="Shrink back to icon"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Shrink</span>
                </button>
              </div>

              {/* Viewer Body */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-900">
                {isImage ? (
                  <img
                    src={imageSrc}
                    alt="Enlarged attachment"
                    className="max-w-full max-h-[76vh] object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  <iframe
                    src={pdfObj.data}
                    title={pdfObj.name}
                    className="w-full h-[76vh] rounded-lg border border-slate-800 bg-white"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}