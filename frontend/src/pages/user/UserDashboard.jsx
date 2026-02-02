import { useState, useEffect } from 'react';
import { Activity, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import axios from '../../utils/axios';

const UserDashboard = () => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        allowedRequests: 0,
        blockedRequests: 0,
        balance: 10000
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Mock data for now - we'll add real endpoints later
            setStats({
                totalRequests: 45,
                allowedRequests: 42,
                blockedRequests: 3,
                balance: 10000
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Account Balance',
            value: `$${stats.balance.toLocaleString()}`,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/50'
        },
        {
            title: 'Total API Requests',
            value: stats.totalRequests,
            icon: Activity,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/50'
        },
        {
            title: 'Allowed Requests',
            value: stats.allowedRequests,
            icon: Shield,
            color: 'from-teal-500 to-green-600',
            bgColor: 'bg-teal-500/10',
            borderColor: 'border-teal-500/50'
        },
        {
            title: 'Blocked Requests',
            value: stats.blockedRequests,
            icon: AlertTriangle,
            color: 'from-red-500 to-orange-600',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/50'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome to your Secure API Gateway client portal</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 backdrop-blur-sm animate-slide-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2">Client Simulation via Secure API Gateway</h3>
                        <p className="text-gray-300 text-sm mb-3">
                            You're accessing financial APIs through our secure gateway with built-in rate limiting and fraud protection.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                                Protected
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                                Rate Limited
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
                                JWT Secured
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                        <h3 className="text-white font-semibold">Make Payment</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Transfer funds through the secure API gateway</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <h3 className="text-white font-semibold">Check Balance</h3>
                    </div>
                    <p className="text-gray-400 text-sm">View your current account balance</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 transition cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <h3 className="text-white font-semibold">Test Rate Limits</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Simulate spam attacks to see blocking in action</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
