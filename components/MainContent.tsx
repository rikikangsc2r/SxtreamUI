
import React, { useState, useEffect, useCallback } from 'react';
import type { Endpoint, GroupedEndpoints } from '../types';
import Stats from './Stats';
import EndpointCategory from './EndpointCategory';

const MainContent: React.FC = () => {
    const [allEndpoints, setAllEndpoints] = useState<Endpoint[]>([]);
    const [groupedEndpoints, setGroupedEndpoints] = useState<GroupedEndpoints>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterAndGroupEndpoints = useCallback((endpoints: Endpoint[], query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = endpoints.filter(item =>
            item.nama.toLowerCase().includes(lowerCaseQuery) ||
            item.category.toLowerCase().includes(lowerCaseQuery)
        );

        const grouped: GroupedEndpoints = {};
        filtered.forEach(item => {
            const cat = item.category.toUpperCase();
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
        });
        setGroupedEndpoints(grouped);
    }, []);

    useEffect(() => {
        const fetchEndpoints = async () => {
            try {
                const res = await fetch('/lol/routes');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: Endpoint[] = await res.json();
                setAllEndpoints(data);
                filterAndGroupEndpoints(data, '');
            } catch (err: any) {
                setError(`Failed to load endpoints: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchEndpoints();
    }, [filterAndGroupEndpoints]);

    useEffect(() => {
        filterAndGroupEndpoints(allEndpoints, searchQuery);
    }, [searchQuery, allEndpoints, filterAndGroupEndpoints]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <main className="flex-1 lg:p-8 p-4 custom-scrollbar overflow-y-auto">
            <div className="text-center mt-10 mb-10">
                <div className="inline-block mb-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                        <i className="fas fa-bolt mr-2"></i>SXTREAM API PLAYGROUND
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                    Test & Integrate <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">API Endpoints</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Powerful API testing interface with real-time results and comprehensive documentation
                </p>
            </div>

            <Stats />

            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <input
                        id="searchInput"
                        type="text"
                        placeholder="Search endpoints... (Ctrl+K)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full glass-effect border border-gray-600/50 rounded-xl px-6 py-4 pl-12 focus:outline-none focus:border-emerald-400 transition text-lg" />
                    <i className="fas fa-search absolute left-4 top-5 text-gray-400"></i>
                </div>
            </div>

            <div id="menuContainer" className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full loading-spinner mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading endpoints...</p>
                    </div>
                ) : error ? (
                     <div className="text-center py-12">
                        <i className="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                        <p className="text-red-400 text-lg">{error}</p>
                    </div>
                ) : (
                    Object.entries(groupedEndpoints).map(([category, endpoints]) => (
                        <EndpointCategory key={category} category={category} endpoints={endpoints} />
                    ))
                )}
            </div>
            <footer className="text-center text-sm text-gray-400 mt-12 mb-8">
                <p>© 2025 SXTREAM API</p>
                <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
            </footer>
        </main>
    );
};

export default MainContent;
