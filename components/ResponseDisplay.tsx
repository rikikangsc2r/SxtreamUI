import React, { useState } from 'react';

interface ResponseDisplayProps {
    response: any;
    isLoading: boolean;
    error: string | null;
    mediaType?: 'jpeg' | 'png' | 'gif' | 'mp4' | 'json';
}

const formatJSON = (obj: any): string => {
  const jsonString = JSON.stringify(obj, null, 2);
  return jsonString
    .replace(/(".*?")(\s*:\s*)/g, '<span class="json-key">$1</span>$2')
    .replace(/:\s*(".*?")/g, ': <span class="json-string">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');
};

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading, error, mediaType = 'json' }) => {
    const [copyStatus, setCopyStatus] = useState('Copy');
    
    const copyToClipboard = () => {
        const textToCopy = mediaType === 'json' ? JSON.stringify(response, null, 2) : response;
        if (typeof textToCopy === 'string') {
             navigator.clipboard.writeText(textToCopy).then(() => {
                setCopyStatus('Copied!');
                setTimeout(() => setCopyStatus('Copy'), 2000);
            });
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-8 min-h-[150px]">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full loading-spinner"></div>
                    <span className="ml-3 text-slate-400">Processing request...</span>
                </div>
            );
        }
        if (error) {
            return (
                 <div className="p-4">
                    <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 font-medium">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>Error Response</span>
                        </div>
                        <pre className="whitespace-pre-wrap break-words text-sm">{error}</pre>
                    </div>
                </div>
            );
        }
        if (!response) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-slate-600 min-h-[150px]">
                    <i className="fas fa-code text-4xl mb-3 opacity-50"></i>
                    <p className="font-medium">No response yet</p>
                    <p className="text-sm mt-1">Execute the request to see results</p>
                </div>
            );
        }

        if (mediaType === 'jpeg' || mediaType === 'png' || mediaType === 'gif') {
            return (
                <div className="p-4 text-center">
                    <img src={response} alt="Result" className="rounded-lg shadow-lg max-w-full h-auto mx-auto" />
                </div>
            );
        }
        if (mediaType === 'mp4') {
             return (
                <div className="p-4 text-center">
                    <video controls className="rounded-lg shadow-lg max-w-full h-auto mx-auto">
                        <source src={response} type="video/mp4" />
                    </video>
                </div>
            );
        }
        
        // Default to JSON
        return (
            <div className="relative font-mono text-sm">
                 <div className="flex items-center justify-between mb-2 sticky top-0 bg-slate-800/90 p-4 border-b border-slate-700">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">JSON Response</span>
                    <button onClick={copyToClipboard} className={`text-xs ${copyStatus === 'Copied!' ? 'text-green-400' : 'text-slate-400 hover:text-emerald-400'} transition flex items-center gap-1.5`}>
                        <i className={`fas ${copyStatus === 'Copied!' ? 'fa-check' : 'fa-copy'}`}></i> {copyStatus}
                    </button>
                </div>
                <pre className="whitespace-pre-wrap break-words p-4" dangerouslySetInnerHTML={{ __html: formatJSON(response) }} />
            </div>
        );
    };

    return (
        <div className="glass-effect rounded-lg overflow-hidden">
             <div className="flex items-center gap-3 p-4 border-b border-slate-600/50 bg-slate-700/20">
                <i className="fas fa-terminal text-cyan-400"></i>
                <span className="font-medium text-slate-300">Response</span>
            </div>
            <div className="response-container max-h-[500px] overflow-auto custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResponseDisplay;
