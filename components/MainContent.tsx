import React, { useRef, useEffect } from 'react';
import type { Endpoint } from '../types';
import Stats from './Stats';

interface MainContentProps {
    onSearchChange: (query: string) => void;
    searchValue: string;
    endpoints?: Endpoint[];
    onSelectEndpoint?: (endpoint: Endpoint) => void;
    showWelcome?: boolean;
}

const EndpointListItem: React.FC<{ endpoint: Endpoint; onClick: () => void }> = ({ endpoint, onClick }) => {
    const methodClass = endpoint.method === 'GET'
        ? 'bg-emerald-500/10 text-emerald-400'
        : 'bg-blue-500/10 text-blue-400';

    return (
        <button onClick={onClick} className="w-full text-left p-4 flex items-center justify-between glass-effect rounded-lg hover:bg-slate-700/50 transition-colors duration-200 group">
            <div className="flex items-center gap-4 min-w-0">
                <span className={`px-3 py-1 rounded-md text-sm font-mono font-bold ${methodClass}`}>
                    {endpoint.method}
                </span>
                <span className="font-medium text-slate-200 truncate group-hover:text-white">{endpoint.nama}</span>
            </div>
            <i className="fas fa-chevron-right text-slate-500 group-hover:text-emerald-400 transition-colors"></i>
        </button>
    );
};


const MainContent: React.FC<MainContentProps> = ({ onSearchChange, searchValue, endpoints, onSelectEndpoint, showWelcome = false }) => {
    
    const animatedBadgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const badge = animatedBadgeRef.current;
        if (!badge) return;

        let animationFrameId: number;
        const tilt = { x: 0, y: 0 };

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const { beta, gamma } = event; // beta: front-back, gamma: left-right
            if (beta === null || gamma === null) return;
            
            // Cap and scale the tilt for a subtle effect
            tilt.x = Math.max(-20, Math.min(20, beta));
            tilt.y = Math.max(-20, Math.min(20, gamma));
        };

        const animate = (time: number) => {
            if (badge) {
                // Creates the bouncing/"mengenjot" effect
                const bounce = Math.sin(time / 400) * 8; // Adjust speed and height
                badge.style.transform = `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${bounce}px)`;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('deviceorientation', handleOrientation);
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar lg:p-8 p-4">
             {showWelcome && (
                <div className="text-center mt-10 mb-10 animate-fade-in">
                    <div className="perspective-container mb-4">
                        <div 
                            ref={animatedBadgeRef} 
                            className="inline-block"
                            style={{ willChange: 'transform', transition: 'transform 0.05s linear' }}
                        >
                            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                                <i className="fas fa-bolt mr-2"></i>SXTREAM API PLAYGROUND
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        Test & Integrate <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent animated-gradient-text">API Endpoints</span>
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                        Powerful API testing interface with real-time results and comprehensive documentation
                    </p>
                </div>
            )}
            
            {showWelcome && <Stats />}

            {endpoints && (
                <div className="mb-6 sticky top-0 lg:-top-8 bg-slate-900/80 backdrop-blur-md py-4 z-10">
                    <div className="relative max-w-xl mx-auto">
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Search endpoints..."
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-emerald-400 transition text-base sm:text-lg" />
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                    </div>
                </div>
            )}
            
            {endpoints && (
                <div className="space-y-3 max-w-xl mx-auto animate-fade-in">
                    {endpoints.map((endpoint) => (
                         <EndpointListItem key={endpoint.url} endpoint={endpoint} onClick={() => onSelectEndpoint?.(endpoint)} />
                    ))}
                    {endpoints.length === 0 && searchValue && (
                        <div className="text-center py-12 text-slate-500">
                            <i className="fas fa-search text-4xl mb-4"></i>
                            <p className="font-medium">No results for "{searchValue}"</p>
                            <p className="text-sm">Try searching for something else.</p>
                        </div>
                    )}
                </div>
            )}

            {showWelcome && (
                 <footer className="text-center text-sm text-gray-400 mt-12 mb-8">
                    <p>© 2025 SXTREAM API</p>
                    <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
                </footer>
            )}
        </div>
    );
};

export default MainContent;