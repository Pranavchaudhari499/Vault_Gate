import { useState, useEffect } from 'react';
import { History, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import axios from '../../utils/axios';

const ActivityHistory = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, success, failed, rate-limited

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await axios.get('/api/user/activity?limit=50');
            setActivities(response.data.activities || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'rate-limited':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            success: 'bg-green-500/10 text-green-400 border-green-500/30',
            failed: 'bg-red-500/10 text-red-400 border-red-500/30',
            'rate-limited': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        };
        return badges[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        return activity.status === filter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Activity History</h1>
                <p className="text-gray-400">View all your API gateway interactions</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Activities</p>
                    <p className="text-2xl font-bold text-white">{activities.length}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Successful</p>
                    <p className="text-2xl font-bold text-green-400">
                        {activities.filter(a => a.status === 'success').length}
                    </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Failed</p>
                    <p className="text-2xl font-bold text-red-400">
                        {activities.filter(a => a.status === 'failed').length}
                    </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Rate Limited</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {activities.filter(a => a.status === 'rate-limited').length}
                    </p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('success')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    Success
                </button>
                <button
                    onClick={() => setFilter('failed')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'failed'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    Failed
                </button>
                <button
                    onClick={() => setFilter('rate-limited')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'rate-limited'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    Rate Limited
                </button>
            </div>

            {/* Activity List */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <History className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No activities found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition border border-transparent hover:border-slate-600"
                            >
                                <div className="flex items-center space-x-4">
                                    {getIcon(activity.status)}
                                    <div>
                                        <h3 className="text-white font-medium">{activity.action}</h3>
                                        <p className="text-sm text-gray-400">{activity.details}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatTimestamp(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityHistory;
