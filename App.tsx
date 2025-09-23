
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import EndpointCard from './components/EndpointCard';
import type { Endpoint, GroupedEndpoints } from './types';

const App: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [allEndpoints, setAllEndpoints] = useState<Endpoint[]>([]);
    const [groupedEndpoints, setGroupedEndpoints] = useState<GroupedEndpoints>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterAndGroupEndpoints = useCallback((endpoints: Endpoint[]) => {
        const grouped: GroupedEndpoints = {};
        endpoints.forEach(item => {
            const cat = item.category.toUpperCase();
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
        });
        setGroupedEndpoints(grouped);
    }, []);

    useEffect(() => {
        const fetchEndpoints = async () => {
            try {
                const res = await fetch('https://api.sxtream.xyz/lol/routes');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: Endpoint[] = await res.json();
                setAllEndpoints(data);
                filterAndGroupEndpoints(data);
            } catch (err: any) {
                setError(`Failed to load endpoints: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchEndpoints();
    }, [filterAndGroupEndpoints]);

    const categories = useMemo(() => Object.keys(groupedEndpoints).sort(), [groupedEndpoints]);

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
        setSelectedEndpoint(null);
        setSearchQuery('');
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const handleSelectEndpoint = (endpoint: Endpoint) => {
        setSelectedEndpoint(endpoint);
    };

    const handleBack = () => {
        if (selectedEndpoint) {
            setSelectedEndpoint(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        }
    };
    
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const filteredEndpoints = useMemo(() => {
        if (!selectedCategory) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();
        return groupedEndpoints[selectedCategory]?.filter(endpoint =>
            endpoint.nama.toLowerCase().includes(lowerCaseQuery)
        ) || [];
    }, [searchQuery, selectedCategory, groupedEndpoints]);


    const getHeaderTitle = () => {
        if (selectedEndpoint) return selectedEndpoint.nama;
        if (selectedCategory) return selectedCategory;
        return 'API Playground';
    };

    return (
        <div className="flex h-screen bg-slate-900">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                categories={categories}
                onSelectCategory={handleSelectCategory}
                selectedCategory={selectedCategory}
                loading={loading}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    toggleSidebar={toggleSidebar}
                    title={getHeaderTitle()}
                    showBack={!!selectedCategory}
                    onBack={handleBack}
                />
                <div className="flex-1 overflow-hidden relative">
                    <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${selectedCategory ? '-translate-x-full' : 'translate-x-0'}`}>
                        <MainContent
                            onSearchChange={setSearchQuery}
                            searchValue={searchQuery}
                            showWelcome={true}
                        />
                    </div>
                    <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${selectedCategory && !selectedEndpoint ? 'translate-x-0' : 'translate-x-full'} ${!selectedCategory ? 'translate-x-full' : ''}`}>
                         {selectedCategory && (
                            <MainContent
                                onSearchChange={setSearchQuery}
                                searchValue={searchQuery}
                                endpoints={filteredEndpoints}
                                onSelectEndpoint={handleSelectEndpoint}
                            />
                         )}
                    </div>
                     <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${selectedEndpoint ? 'translate-x-0' : 'translate-x-full'}`}>
                        {selectedEndpoint && <EndpointCard endpoint={selectedEndpoint} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
