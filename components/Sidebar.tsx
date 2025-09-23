import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string) => void;
    loading: boolean;
}

const categoryIcons: { [key: string]: string } = {
    'ARTIFICIAL INTELLIGENCE': 'fas fa-brain',
    'AI IMAGE': 'fas fa-image',
    'DOWNLOADER': 'fas fa-download',
    'TOOLS': 'fas fa-wrench',
    'STALKER': 'fas fa-user-secret',
    'NSFW': 'fas fa-eye-slash',
    'GAMES': 'fas fa-gamepad',
    'SEARCH': 'fas fa-search',
    'GALLERY': 'fas fa-images',
    'MAKER': 'fas fa-pen',
    'AUDIO': 'fas fa-music',
    'RANDOM TEXT': 'fas fa-random'
};

const NavLink: React.FC<{ href: string; icon: string; text: string; target?: string; }> = ({ href, icon, text, target }) => (
    <a 
        href={href} 
        target={target} 
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-slate-700/50 transition group text-slate-300 hover:text-white"
    >
        <i className={`${icon} w-5 text-center text-lg text-emerald-400 group-hover:scale-110 transition-transform`}></i>
        <span className="font-medium">{text}</span>
    </a>
);

const CategoryLink: React.FC<{ category: string; onSelect: () => void; isSelected: boolean; }> = ({ category, onSelect, isSelected }) => {
    const icon = categoryIcons[category] || 'fas fa-folder';
    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg text-left transition group ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
        >
            <i className={`${icon} w-5 text-center text-lg ${isSelected ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
            <span className="font-medium">{category}</span>
        </button>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, categories, selectedCategory, onSelectCategory, loading }) => {
    const sidebarClasses = `
        fixed left-0 top-0 w-72 h-full bg-slate-900/80 backdrop-blur-lg border-r border-slate-700/50 z-50 transform transition-transform duration-300 ease-in-out
        lg:sticky lg:transform-none lg:w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <aside className={sidebarClasses}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 h-[73px] border-b border-slate-700/50">
                    <div className="bg-gradient-to-r from-emerald-400 to-blue-400 p-0.5 rounded-lg">
                        <div className="bg-slate-800 px-4 py-2 rounded-[0.6rem]">
                            <h1 className="text-xl font-bold text-emerald-400">SXTREAM</h1>
                        </div>
                    </div>
                    <button className="lg:hidden text-slate-400 hover:text-white" onClick={toggleSidebar}>
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div className="p-4">
                    <nav className="space-y-2">
                        <NavLink href="/" icon="fas fa-home" text="Home" />
                        <NavLink href="/docs" icon="fas fa-book" text="Documentation" />
                        <NavLink href="/contributors" icon="fas fa-info-circle" text="Contributor" />
                        <NavLink href="https://api.sxtream.xyz/contact" icon="fab fa-whatsapp" text="Contact" target="_blank" />
                    </nav>
                </div>

                <div className="px-6 py-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">API Categories</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-4">
                             <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full loading-spinner mx-auto"></div>
                        </div>
                    ) : (
                        categories.map(cat => (
                            <CategoryLink
                                key={cat}
                                category={cat}
                                onSelect={() => onSelectCategory(cat)}
                                isSelected={selectedCategory === cat}
                            />
                        ))
                    )}
                </nav>

                <div className="mt-auto p-6 border-t border-slate-700/50 text-center">
                    <p className="text-sm text-slate-400">© 2025 SXTREAM API</p>
                    <p className="text-xs text-slate-500 mt-1">v1.0.0</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;