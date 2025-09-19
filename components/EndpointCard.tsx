
import React, { useState, useEffect, useCallback } from 'react';
import type { Endpoint } from '../types';
import ResponseDisplay from './ResponseDisplay';

interface EndpointCardProps {
    endpoint: Endpoint;
}

interface ParamValues {
    [key: string]: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint }) => {
    const [isExpanded, setExpanded] = useState(false);
    const [params, setParams] = useState<ParamValues>({});
    const [model, setModel] = useState(endpoint.model ? endpoint.model[0] : '');
    const [style, setStyle] = useState(endpoint.style ? endpoint.style[0] : '');
    
    const [urlPreview, setUrlPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);

    const updateUrlPreview = useCallback(() => {
        const queryParams = new URLSearchParams();
        if (endpoint.param) {
            endpoint.param.split(',').forEach(p => {
                const key = p.trim();
                if (params[key]) {
                    queryParams.append(key, params[key]);
                }
            });
        }
        if (endpoint.model && model) queryParams.append('model', model);
        if (endpoint.style && style) queryParams.append('style', style);
        
        const queryString = queryParams.toString();
        setUrlPreview(`${window.location.origin}${endpoint.url}${queryString ? `?${queryString}` : ''}`);
    }, [endpoint, params, model, style]);

    useEffect(() => {
        updateUrlPreview();
    }, [updateUrlPreview]);

    const handleParamChange = (key: string, value: string) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const handleExecute = async () => {
        setIsLoading(true);
        setResponse(null);
        setError(null);
        setResponseTime(null);
        const start = Date.now();

        try {
            const fetchOptions: RequestInit = { method: endpoint.method };
            if (endpoint.method === 'POST') {
                fetchOptions.headers = { 'Content-Type': 'application/json' };
                const body: { [key: string]: string } = {};
                 if (endpoint.param) {
                    endpoint.param.split(',').forEach(p => {
                        const key = p.trim();
                        if (params[key]) body[key] = params[key];
                    });
                }
                 if (endpoint.model && model) body.model = model;
                 if (endpoint.style && style) body.style = style;
                fetchOptions.body = JSON.stringify(body);
            }
            
            const res = await fetch(urlPreview, fetchOptions);
            const end = Date.now();
            setResponseTime(end - start);

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            if (endpoint.media_type && endpoint.media_type !== 'json') {
                 const blob = await res.blob();
                 setResponse(URL.createObjectURL(blob));
            } else {
                const data = await res.json();
                setResponse(data);
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const methodClass = endpoint.method === 'GET' 
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' 
      : 'bg-blue-500/20 text-blue-400 border-blue-400/30';

    return (
        <div className="p-6 border-b border-gray-600/20 last:border-b-0">
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <span className={`${methodClass} px-3 py-1 rounded-lg text-sm font-mono border`}>
                        {endpoint.method}
                    </span>
                    <span className="font-medium text-lg">{endpoint.nama}</span>
                </div>
                <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400 transition-transform group-hover:text-white`}></i>
            </div>

            {isExpanded && (
                <div className="mt-6 space-y-6">
                    {endpoint.param && (
                        <div className="space-y-2">
                             <h4 className="font-medium text-gray-300 flex items-center gap-2">
                                <i className="fas fa-cogs text-emerald-400"></i> Parameters
                            </h4>
                             <div className={`grid gap-4 ${endpoint.param.split(',').length > 1 ? 'lg:grid-cols-2' : ''}`}>
                                {endpoint.param.split(',').map(p => {
                                    const key = p.trim();
                                    return (
                                        <div key={key}>
                                            <label className="block text-sm font-medium mb-2 text-gray-300">{key} <span className="text-red-400">*</span></label>
                                            <input 
                                                type="text" 
                                                placeholder={`Enter ${key}...`} 
                                                value={params[key] || ''}
                                                onChange={(e) => handleParamChange(key, e.target.value)}
                                                className="w-full glass-effect border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 transition" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {endpoint.model && (
                        <div>
                             <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                                <i className="fas fa-cube text-blue-400"></i> Model
                            </label>
                            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full glass-effect border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 transition">
                                {endpoint.model.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    )}
                     {endpoint.style && (
                        <div>
                             <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                                <i className="fas fa-palette text-purple-400"></i> Style
                            </label>
                            <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full glass-effect border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 transition">
                                {endpoint.style.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    
                    <div className="glass-effect p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300 flex items-center gap-2"><i className="fas fa-link text-yellow-400"></i> Request URL</span>
                        </div>
                        <code className="text-sm text-emerald-400 break-all block bg-gray-800/50 p-3 rounded overflow-x-auto max-w-full custom-scrollbar">{urlPreview}</code>
                    </div>

                    <div className="flex items-center justify-between">
                        <button onClick={handleExecute} disabled={isLoading} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                            ) : (
                                <i className="fas fa-play"></i>
                            )}
                            {isLoading ? 'Executing...' : 'Execute Request'}
                        </button>
                        {responseTime !== null && !isLoading && (
                            <span className="text-sm text-gray-400 flex items-center gap-2">
                                <i className={`fas fa-clock ${error ? 'text-red-400' : 'text-green-400'}`}></i> {responseTime}ms
                            </span>
                        )}
                    </div>
                    
                    <ResponseDisplay response={response} isLoading={isLoading} error={error} mediaType={endpoint.media_type} />
                </div>
            )}
        </div>
    );
};

export default EndpointCard;

