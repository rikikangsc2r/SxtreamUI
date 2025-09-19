
import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const sidebarClasses = `
        fixed left-0 top-0 w-72 h-full glass-effect z-50 transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:sticky lg:top-0 lg:h-screen lg:w-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <aside className={sidebarClasses}>
            <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                    <div style={{ padding: '1px' }} className="bg-gradient-to-r from-emerald-400 to-blue-400 rounded-lg">
                        <div className="bg-[#1e293b] px-4 py-2 rounded-[0.6875rem]">
                            <h1 className="text-xl font-bold text-emerald-400">SXTREAM</h1>
                        </div>
                    </div>
                    <button className="lg:hidden text-gray-400 hover:text-white" onClick={toggleSidebar}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <nav className="space-y-2 flex-1">
                    <a href="#" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700/50 transition group">
                        <i className="fas fa-home text-emerald-400 group-hover:scale-110 transition-transform"></i>
                        <span>Home</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700/50 transition group">
                        <i className="fas fa-book text-blue-400 group-hover:scale-110 transition-transform"></i>
                        <span>Documentation</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700/50 transition group">
                        <i className="fas fa-info-circle text-purple-400 group-hover:scale-110 transition-transform"></i>
                        <span>Contributor</span>
                    </a>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-700">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">© 2025 SXTREAM API</p>
                        <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
