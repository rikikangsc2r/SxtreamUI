
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
        const textToCopy = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        });
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full loading-spinner"></div>
                    <span className="ml-3 text-gray-400">Processing request...</span>
                </div>
            );
        }
        if (error) {
            return (
                 <div className="response-content text-red-400 bg-red-500/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span className="text-sm font-medium">Error Response</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words">{error}</pre>
                </div>
            );
        }
        if (!response) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-gray-600 min-h-[120px]">
                    <i className="fas fa-code text-3xl mb-2 opacity-50"></i>
                    <p>No response yet</p>
                    <p className="text-xs mt-1">Execute the request to see results here</p>
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
            <div className="relative p-4 font-mono text-sm">
                 <div className="flex items-center justify-between mb-2 sticky top-0 bg-[#1e293b]/90 pb-2 border-b border-gray-700">
                    <span className="text-xs text-gray-400 font-medium">JSON Response</span>
                    <button onClick={copyToClipboard} className={`text-xs ${copyStatus === 'Copied!' ? 'text-green-400' : 'text-gray-400 hover:text-emerald-400'} transition flex items-center gap-1`}>
                        <i className={`fas ${copyStatus === 'Copied!' ? 'fa-check' : 'fa-copy'}`}></i> {copyStatus}
                    </button>
                </div>
                <pre className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: formatJSON(response) }} />
            </div>
        );
    };

    return (
        <div className="glass-effect rounded-lg">
             <div className="flex items-center gap-2 p-4 border-b border-gray-600/30">
                <i className="fas fa-terminal text-cyan-400"></i>
                <span className="font-medium text-gray-300">Response</span>
            </div>
            <div className="response-container max-h-[400px] overflow-auto custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResponseDisplay;
