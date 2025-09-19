import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                userButtonRef.current &&
                !userButtonRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <header className="glass-effect border-b border-gray-700/50 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button id="hamburger" className="lg:hidden flex flex-col cursor-pointer" onClick={toggleSidebar}>
                    <span className="w-[25px] h-[3px] bg-emerald-400 my-[3px] transition-all rounded-sm"></span>
                    <span className="w-[25px] h-[3px] bg-emerald-400 my-[3px] transition-all rounded-sm"></span>
                    <span className="w-[25px] h-[3px] bg-emerald-400 my-[3px] transition-all rounded-sm"></span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-lg flex items-center justify-center">
                        <i className="fas fa-code text-sm text-white"></i>
                    </div>
                    <h1 className="hidden sm:block text-xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        API Playground
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-4 relative">
                <a href="https://whatsapp.com/channel/0029Vavzy6tIiRordrPfQ13d" target="_blank" rel="noopener noreferrer"
                    className="hidden sm:flex w-11 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl items-center justify-center transition shadow-lg hover:shadow-emerald-500/25">
                    <i className="fab fa-whatsapp text-lg"></i>
                </a>
                <div ref={userButtonRef} onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer">
                    <i className="fas fa-user text-sm text-white"></i>
                </div>
                {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute top-12 right-0 mt-2 w-40 bg-[#1e293b] glass-effect shadow-lg rounded-xl py-2 z-50">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50">Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700/50">Logout</a>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;