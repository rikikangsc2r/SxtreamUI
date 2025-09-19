import React, { useState, useEffect } from 'react';
import type { StatsData } from '../types';

interface StatCardProps {
    iconClass: string;
    iconBgClass: string;
    value: string;
    label: string;
    valueColorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ iconClass, iconBgClass, value, label, valueColorClass }) => (
    <div className="glass-effect p-6 rounded-xl text-center transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-2xl">
        <div className={`w-12 h-12 ${iconBgClass} rounded-lg flex items-center justify-center mx-auto mb-3`}>
            <i className={`${iconClass} text-xl`}></i>
        </div>
        <div className={`${valueColorClass} text-2xl font-bold break-all`}>{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
    </div>
);

const Stats: React.FC = () => {
    const [stats, setStats] = useState<StatsData>({});
    const [ip, setIp] = useState('...');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/data/api');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Stats error:', err);
            }
        };

        fetchStats();
        const statsInterval = setInterval(fetchStats, 5000);
        return () => clearInterval(statsInterval);
    }, []);

    useEffect(() => {
        const fetchIp = async () => {
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                if (res.ok) {
                    const data = await res.json();
                    setIp(data.ip);
                }
            } catch (err) {
                console.error('IP error:', err);
            }
        };
        fetchIp();
    }, []);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timeInterval);
    }, []);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard iconClass="fas fa-chart-line text-emerald-400" iconBgClass="bg-emerald-500/20" value={stats.Request || '0'} label="Requests Today" valueColorClass="text-emerald-400" />
            <StatCard iconClass="fas fa-clock text-blue-400" iconBgClass="bg-blue-500/20" value={stats.runtime || '0s'} label="Server Uptime" valueColorClass="text-blue-400" />
            <StatCard iconClass="fas fa-globe text-purple-400" iconBgClass="bg-purple-500/20" value={ip} label="Your IP Address" valueColorClass="text-purple-400" />
            <StatCard iconClass="fas fa-calendar-day text-orange-400" iconBgClass="bg-orange-500/20" value={currentTime} label="Current Time" valueColorClass="text-orange-400" />
        </div>
    );
};

export default Stats;