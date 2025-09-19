
import React, { useState } from 'react';
import type { Endpoint } from '../types';
import EndpointCard from './EndpointCard';

interface EndpointCategoryProps {
    category: string;
    endpoints: Endpoint[];
}

const categoryIcons: { [key: string]: string } = {
    'ARTIFICIAL INTELLIGENCE': 'fas fa-brain text-purple-500',
    'AI IMAGE': 'fas fa-image text-indigo-400',
    'DOWNLOADER': 'fas fa-download text-blue-400',
    'TOOLS': 'fas fa-wrench text-amber-500',
    'STALKER': 'fas fa-user-secret text-red-500',
    'NSFW': 'fas fa-eye-slash text-rose-500',
    'GAMES': 'fas fa-gamepad text-green-500',
    'SEARCH': 'fas fa-search text-yellow-400',
    'GALLERY': 'fas fa-images text-pink-400',
    'MAKER': 'fas fa-pen text-fuchsia-500',
    'AUDIO': 'fas fa-music text-sky-500',
    'RANDOM TEXT': 'fas fa-random text-lime-500'
};

const EndpointCategory: React.FC<EndpointCategoryProps> = ({ category, endpoints }) => {
    const [isExpanded, setExpanded] = useState(false);
    const categoryIcon = categoryIcons[category] || 'fas fa-folder text-gray-400';

    return (
        <div className="glass-effect border border-gray-600/30 rounded-xl overflow-hidden">
            <div
                className="category-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition group"
                onClick={() => setExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className={categoryIcon}></i>
                    </div>
                    <span className="font-semibold text-lg">{category}</span>
                    <span className="bg-gray-700/50 text-gray-400 text-xs px-2 py-1 rounded-full">{endpoints.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400 transition-transform`}></i>
                </div>
            </div>
            {isExpanded && (
                 <div className="border-t border-gray-600/30 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {endpoints.map((endpoint, index) => (
                        <EndpointCard key={`${category}-${endpoint.nama}-${index}`} endpoint={endpoint} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EndpointCategory;
