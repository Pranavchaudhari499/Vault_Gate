import { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from '../../utils/axios';

const RiskSecurityEngine = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [riskData, setRiskData] = useState(null);

    useEffect(() => {
        const fetchRiskDashboard = async () => {
            try {
                const response = await axios.get('/api/admin/risk-dashboard');
                setRiskData(response.data);
                setError('');
            } catch (err) {
                setError('Failed to load risk data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRiskDashboard();
        const interval = setInterval(fetchRiskDashboard, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const getRiskColor = (level) => {
        switch (level) {
            case 'LOW':
                return 'text-emerald-400';
            case 'MEDIUM':
                return 'text-yellow-400';
            case 'HIGH':
                return 'text-red-400';
            default:
                return 'text-slate-400';
        }
    };

    const getRiskBgColor = (level) => {
        switch (level) {
            case 'LOW':
                return 'bg-emerald-500/10 border-emerald-500/20';
            case 'MEDIUM':
                return 'bg-yellow-500/10 border-yellow-500/20';
            case 'HIGH':
                return 'bg-red-500/10 border-red-500/20';
            default:
                return 'bg-slate-700/10 border-slate-500/20';
        }
    };

    const getRiskIcon = (level) => {
        switch (level) {
            case 'LOW':
                return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'MEDIUM':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'HIGH':
                return <AlertTriangle className="w-5 h-5 text-red-400" />;
            default:
                return <Shield className="w-5 h-5 text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center justify-center h-64">
                <p className="text-slate-400">Loading risk analysis...</p>
            </div>
        );
    }

    if (error || !riskData) {
        return (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <p className="text-red-400">{error || 'No risk data available'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {/* Total Users Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-white">{riskData.summary.totalUsers}</p>
                </div>

                {/* High Risk Card */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-300 text-sm mb-2">High Risk</p>
                    <p className="text-3xl font-bold text-red-400">{riskData.summary.highRiskCount}</p>
                </div>

                {/* Medium Risk Card */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-300 text-sm mb-2">Medium Risk</p>
                    <p className="text-3xl font-bold text-yellow-400">{riskData.summary.mediumRiskCount}</p>
                </div>

                {/* Average Risk Score Card */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-300 text-sm mb-2">Avg Risk Score</p>
                    <p className="text-3xl font-bold text-blue-400">{riskData.summary.averageRiskScore}</p>
                </div>
            </div>

            {/* Risk Details Title */}
            <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Risk-Based Security Analysis</h2>
            </div>

            {/* Users Risk Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-900/50">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Account Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Policy</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Risk Score</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Risk Factors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riskData.users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                                        No user risk data available
                                    </td>
                                </tr>
                            ) : (
                                riskData.users.map((user) => (
                                    <tr key={user.userId} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                                        <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded text-sm font-medium ${user.accountType === 'SAVINGS'
                                                    ? 'bg-blue-500/20 text-blue-300'
                                                    : 'bg-purple-500/20 text-purple-300'
                                                }`}>
                                                {user.accountType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">{user.policyMode}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-white">{user.riskScore}</span>
                                            <span className="text-slate-400 text-sm"> / 100</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {getRiskIcon(user.riskLevel)}
                                                <span className={`font-semibold ${getRiskColor(user.riskLevel)}`}>
                                                    {user.riskLevel}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">{user.action}</td>
                                        <td className="px-6 py-4 text-xs">
                                            {user.topRiskFactors.length > 0 ? (
                                                <div className="space-y-1">
                                                    {user.topRiskFactors.map((factor, idx) => (
                                                        <div key={idx} className="text-slate-300">
                                                            • {factor.factor} (+{factor.contribution})
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">No risk factors</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300 text-sm">
                    <strong>Risk Score:</strong> A rule-based security intelligence metric (0-100) calculated from user behavior patterns.
                    <strong className="ml-3">Policy Mode:</strong> Conservative (Savings) or High-Throughput (Current) determines security sensitivity.
                    Admin-only feature - users never see numeric risk values.
                </p>
            </div>
        </div>
    );
};

export default RiskSecurityEngine;
