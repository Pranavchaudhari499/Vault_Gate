import { useState } from 'react';
import { Zap, AlertTriangle, Play, StopCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from '../../utils/axios';

const SpamRequests = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        success: 0,
        rateLimited: 0,
        blocked: 0
    });

    const sendSpamRequests = async () => {
        setIsRunning(true);
        setRequests([]);
        setStats({ total: 0, success: 0, rateLimited: 0, blocked: 0 });

        const requestCount = 15; // Send 15 requests to trigger rate limiting

        for (let i = 1; i <= requestCount; i++) {
            const startTime = Date.now();
            try {
                const response = await axios.get('/api/balance');
                const duration = Date.now() - startTime;

                const newRequest = {
                    id: i,
                    status: 'success',
                    message: 'Request allowed',
                    statusCode: response.status,
                    timestamp: new Date().toLocaleTimeString(),
                    duration
                };

                setRequests(prev => [newRequest, ...prev]);
                setStats(prev => ({
                    ...prev,
                    total: prev.total + 1,
                    success: prev.success + 1
                }));
            } catch (error) {
                const duration = Date.now() - startTime;
                let status = 'error';
                let message = error.response?.data?.message || 'Request failed';

                if (error.response?.status === 429) {
                    status = 'rate-limited';
                    message = 'Rate limit exceeded';
                    setStats(prev => ({
                        ...prev,
                        total: prev.total + 1,
                        rateLimited: prev.rateLimited + 1
                    }));
                } else {
                    setStats(prev => ({ ...prev, total: prev.total + 1 }));
                }

                const newRequest = {
                    id: i,
                    status,
                    message,
                    statusCode: error.response?.status || 500,
                    timestamp: new Date().toLocaleTimeString(),
                    duration
                };

                setRequests(prev => [newRequest, ...prev]);
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        setIsRunning(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'rate-limited':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'blocked':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <XCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success':
                return 'bg-green-500/10 border-green-500/50 text-green-400';
            case 'rate-limited':
                return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400';
            case 'blocked':
                return 'bg-red-500/10 border-red-500/50 text-red-400';
            default:
                return 'bg-gray-500/10 border-gray-500/50 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Attack Simulation</h1>
                <p className="text-gray-400">Test rate limiting by sending rapid API requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Requests</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Allowed</p>
                    <p className="text-2xl font-bold text-green-400">{stats.success}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Rate Limited</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.rateLimited}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Blocked</p>
                    <p className="text-2xl font-bold text-red-400">{stats.blocked}</p>
                </div>
            </div>

            {/* Control Panel */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Zap className="w-6 h-6 text-orange-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-white">Spam Attack Simulator</h2>
                            <p className="text-sm text-gray-400">Send 15 rapid requests to /api/balance to trigger rate limiting</p>
                        </div>
                    </div>
                    <button
                        onClick={sendSpamRequests}
                        disabled={isRunning}
                        className={`px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:transform-none flex items-center space-x-2 ${isRunning
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white'
                            }`}
                    >
                        {isRunning ? (
                            <>
                                <StopCircle className="w-5 h-5" />
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                <span>Start Attack</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Request Log */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Request Log</h3>

                {requests.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Click "Start Attack" to begin the simulation</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColor(req.status)}`}
                            >
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(req.status)}
                                    <div>
                                        <p className="text-sm font-medium">Request #{req.id}</p>
                                        <p className="text-xs opacity-75">{req.message}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-mono">Status: {req.statusCode}</p>
                                    <p className="text-xs opacity-75">{req.timestamp}</p>
                                    <p className="text-xs opacity-75">{req.duration}ms</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-sm text-orange-300">
                    <strong>What happens:</strong> The first 10 requests usually succeed (200 OK), then you'll see 429 Rate Limit Exceeded errors. The gateway blocks further requests for 15 minutes.
                </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-2">Proper use</h4>
                <p className="text-xs text-gray-300">
                    This simulator is only for demonstrating rate limiting in a safe, controlled way. Use it during demos or testing, not in production traffic. If you need to resume normal usage, wait 15 minutes for the block to clear.
                </p>
            </div>
        </div>
    );
};

export default SpamRequests;
