import { useState, useEffect } from 'react';
import { Shield, Activity, Users, AlertTriangle, TrendingUp, Globe } from 'lucide-react';
import axios from '../../utils/axios';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalRequests: 0,
        allowedRequests: 0,
        blockedRequests: 0,
        rateLimitedRequests: 0,
        activeUsers: 0,
        suspiciousActivities: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get('/api/admin/metrics');
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
            // Mock data for demo
            setMetrics({
                totalRequests: 1247,
                allowedRequests: 1098,
                blockedRequests: 89,
                rateLimitedRequests: 60,
                activeUsers: 42,
                suspiciousActivities: 15
            });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total API Requests',
            value: metrics.totalRequests.toLocaleString(),
            icon: Globe,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/50',
            change: '+12.5%'
        },
        {
            title: 'Allowed Requests',
            value: metrics.allowedRequests.toLocaleString(),
            icon: Shield,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/50',
            change: '+8.2%'
        },
        {
            title: 'Blocked Requests',
            value: metrics.blockedRequests,
            icon: AlertTriangle,
            color: 'from-red-500 to-orange-600',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/50',
            change: '-3.1%'
        },
        {
            title: 'Rate Limited',
            value: metrics.rateLimitedRequests,
            icon: Activity,
            color: 'from-yellow-500 to-orange-600',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/50',
            change: '+5.7%'
        },
        {
            title: 'Active Users',
            value: metrics.activeUsers,
            icon: Users,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/50',
            change: '+18.3%'
        },
        {
            title: 'Suspicious Activities',
            value: metrics.suspiciousActivities,
            icon: AlertTriangle,
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/50',
            change: '-11.2%'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Monitor and control the Secure API Gateway</p>
                </div>
                <button
                    onClick={fetchMetrics}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center space-x-2"
                >
                    <Activity className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 backdrop-blur-sm animate-slide-up`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${stat.change.startsWith('+')
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">System Health</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-300">API Gateway</span>
                            </div>
                            <span className="text-green-400 font-semibold">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-300">Rate Limiter</span>
                            </div>
                            <span className="text-green-400 font-semibold">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-300">Authentication</span>
                            </div>
                            <span className="text-green-400 font-semibold">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-300">Database</span>
                            </div>
                            <span className="text-yellow-400 font-semibold">Degraded</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Request Distribution</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Allowed</span>
                                <span className="text-sm text-green-400 font-semibold">
                                    {((metrics.allowedRequests / metrics.totalRequests) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                    style={{ width: `${(metrics.allowedRequests / metrics.totalRequests) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Rate Limited</span>
                                <span className="text-sm text-yellow-400 font-semibold">
                                    {((metrics.rateLimitedRequests / metrics.totalRequests) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                                    style={{ width: `${(metrics.rateLimitedRequests / metrics.totalRequests) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Blocked</span>
                                <span className="text-sm text-red-400 font-semibold">
                                    {((metrics.blockedRequests / metrics.totalRequests) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-orange-600 rounded-full"
                                    style={{ width: `${(metrics.blockedRequests / metrics.totalRequests) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <div>
                        <h3 className="text-white font-semibold mb-2">Security Operator Dashboard</h3>
                        <p className="text-gray-300 text-sm">
                            Monitor all API traffic, detect suspicious patterns, and manage rate limiting policies in real-time.
                            This dashboard provides comprehensive insights into the security and performance of your API Gateway.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
