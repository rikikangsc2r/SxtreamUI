import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
    toggleSidebar: () => void;
    title: string;
    showBack: boolean;
    onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title, showBack, onBack }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <header className="glass-effect border-b border-slate-700/50 px-4 sm:px-6 h-[73px] flex-shrink-0 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button id="hamburger" className="lg:hidden text-slate-300 text-xl" onClick={toggleSidebar}>
                   <i className="fas fa-bars"></i>
                </button>
                 {showBack && (
                     <button onClick={onBack} className="text-slate-300 hover:text-white transition text-xl">
                         <i className="fas fa-arrow-left"></i>
                     </button>
                 )}
                <h1 className="text-lg sm:text-xl font-semibold text-slate-100 truncate">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4 relative">
                <div ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-transparent hover:ring-purple-400/50 transition">
                        <i className="fas fa-user text-sm text-white"></i>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 glass-effect shadow-lg rounded-xl py-2 z-50 animate-fade-in">
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition">
                                <i className="fas fa-user-circle w-4 text-center text-slate-400"></i>
                                <span>Profile</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition">
                                <i className="fas fa-sign-out-alt w-4 text-center"></i>
                                <span>Logout</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
