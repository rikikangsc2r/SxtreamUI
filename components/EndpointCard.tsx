
import React, { useState, useEffect, useCallback } from 'react';
import type { Endpoint } from '../types';
import ResponseDisplay from './ResponseDisplay';

interface EndpointDetailProps {
    endpoint: Endpoint;
}

interface ParamValues {
    [key: string]: string;
}

const EndpointCard: React.FC<EndpointDetailProps> = ({ endpoint }) => {
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
        setUrlPreview(`https://api.sxtream.xyz${endpoint.url}${queryString ? `?${queryString}` : ''}`);
    }, [endpoint, params, model, style]);

    useEffect(() => {
        // Reset state when endpoint changes
        setParams({});
        setModel(endpoint.model ? endpoint.model[0] : '');
        setStyle(endpoint.style ? endpoint.style[0] : '');
        setResponse(null);
        setError(null);
        setIsLoading(false);
        setResponseTime(null);
    }, [endpoint]);

    useEffect(() => {
        updateUrlPreview();
    }, [params, model, style, updateUrlPreview]);

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
                const errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || `Request failed with status ${res.status}`);
                } catch {
                     throw new Error(errorText || `Request failed with status ${res.status}`);
                }
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
    
    return (
        <div className="h-full overflow-y-auto custom-scrollbar lg:p-8 p-4 animate-slide-in space-y-6">
            <div className="space-y-6">
                {endpoint.param && (
                    <div className="space-y-2">
                         <h4 className="font-medium text-slate-300 flex items-center gap-2">
                            <i className="fas fa-cogs text-emerald-400"></i> Parameters
                        </h4>
                         <div className={`grid gap-4 ${endpoint.param.split(',').length > 1 ? 'lg:grid-cols-2' : ''}`}>
                            {endpoint.param.split(',').map(p => {
                                const key = p.trim();
                                return (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-2 text-slate-300">{key} <span className="text-red-400">*</span></label>
                                        <input 
                                            type="text" 
                                            placeholder={`Enter ${key}...`} 
                                            value={params[key] || ''}
                                            onChange={(e) => handleParamChange(key, e.target.value)}
                                            className="w-full glass-effect border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 transition" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {endpoint.model && (
                    <div>
                         <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                            <i className="fas fa-cube text-blue-400"></i> Model
                        </label>
                        <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full glass-effect border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 transition appearance-none bg-transparent bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em'}}>
                            {endpoint.model.map(m => <option key={m} value={m} className="bg-slate-800">{m}</option>)}
                        </select>
                    </div>
                )}
                 {endpoint.style && (
                    <div>
                         <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                            <i className="fas fa-palette text-purple-400"></i> Style
                        </label>
                        <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full glass-effect border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 transition appearance-none bg-transparent bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em'}}>
                            {endpoint.style.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                        </select>
                    </div>
                )}
                
                <div className="glass-effect p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300 flex items-center gap-2"><i className="fas fa-link text-yellow-400"></i> Request URL</span>
                    </div>
                    <code className="text-sm text-emerald-400 break-all block bg-slate-800/50 p-3 rounded overflow-x-auto max-w-full custom-scrollbar">{urlPreview}</code>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <button onClick={handleExecute} disabled={isLoading} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                        ) : (
                            <i className="fas fa-play"></i>
                        )}
                        {isLoading ? 'Executing...' : 'Execute Request'}
                    </button>
                    {responseTime !== null && !isLoading && (
                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-700/50 px-3 py-1.5 rounded-full">
                           <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-400' : 'bg-green-400'}`}></div>
                           <span>{responseTime}ms</span>
                        </div>
                    )}
                </div>
                
                <ResponseDisplay response={response} isLoading={isLoading} error={error} mediaType={endpoint.media_type} />
            </div>
        </div>
    );
};

export default EndpointCard;
