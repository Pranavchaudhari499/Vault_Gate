import { useState, useEffect } from 'react';
import { Wallet, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';
import axios from '../../utils/axios';

const CheckBalance = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBalance = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/balance');
            setBalance(response.data.balance);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch balance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Check Balance</h1>
                <p className="text-gray-400">View your current account balance via API Gateway</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Balance Display */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Wallet className="w-6 h-6 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Account Balance</h2>
                        </div>
                        <button
                            onClick={fetchBalance}
                            disabled={loading}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-green-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {error ? (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : balance !== null ? (
                        <div className="space-y-4">
                            <div className="flex items-baseline space-x-2">
                                <DollarSign className="w-8 h-8 text-green-400" />
                                <span className="text-5xl font-bold text-white">
                                    {balance.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">Available Balance</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
                            <p>Loading balance...</p>
                        </div>
                    )}
                </div>

                {/* Info Panel */}
                <div className="space-y-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">API Information</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Endpoint</p>
                                <code className="text-sm text-green-400">GET /api/balance</code>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Authentication</p>
                                <code className="text-sm text-blue-400">Bearer JWT Token</code>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Rate Limit</p>
                                <code className="text-sm text-yellow-400">10 requests / minute</code>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">Protected by Gateway</h4>
                        <p className="text-xs text-gray-300">
                            This balance check is routed through the Secure API Gateway with automatic rate limiting and fraud detection.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <div>
                                        <p className="text-sm text-white">Balance Check</p>
                                        <p className="text-xs text-gray-400">Just now</p>
                                    </div>
                                </div>
                                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Success</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckBalance;
