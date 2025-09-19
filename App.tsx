
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';

const App: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            <div className="lg:grid lg:grid-cols-[280px_1fr] min-h-screen">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="min-h-screen flex flex-col">
                    <Header toggleSidebar={toggleSidebar} />
                    <MainContent />
                </div>
            </div>
            <a
                href="https://whatsapp.com/channel/0029Vavzy6tIiRordrPfQ13d"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-5 right-5 sm:hidden w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-full flex items-center justify-center shadow-lg transition z-50"
            >
                <i className="fab fa-whatsapp text-xl"></i>
            </a>
        </>
    );
};

export default App;
