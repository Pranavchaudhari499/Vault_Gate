import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const impactStyles = {
    LOW: {
        label: 'LOW',
        text: 'text-green-400',
        border: 'border-green-500/40',
        bg: 'bg-green-500/10',
        icon: CheckCircle2
    },
    MEDIUM: {
        label: 'MEDIUM',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        bg: 'bg-yellow-500/10',
        icon: AlertTriangle
    },
    HIGH: {
        label: 'HIGH',
        text: 'text-red-400',
        border: 'border-red-500/40',
        bg: 'bg-red-500/10',
        icon: ShieldAlert
    }
};

const SimulationResultCard = ({ result }) => {
    if (!result) return null;

    const impact = impactStyles[result.estimatedImpact] || impactStyles.LOW;
    const ImpactIcon = impact.icon;

    return (
        <div className="space-y-4">
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-300">Simulation only – no rules enforced</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-5">
                    <p className="text-sm text-gray-400">Affected users</p>
                    <p className="text-3xl font-semibold text-white mt-2">{result.affectedUsers}</p>
                    <p className="text-xs text-gray-500 mt-2">Users active in recent traffic window.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-5">
                    <p className="text-sm text-gray-400">Throttled percentage</p>
                    <p className="text-3xl font-semibold text-white mt-2">{result.throttledPercentage}%</p>
                    <p className="text-xs text-gray-500 mt-2">Hypothetical throttling under new limit.</p>
                </div>

                <div className={`${impact.bg} ${impact.border} border rounded-xl p-5`}
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-slate-900/60">
                            <ImpactIcon className={`w-5 h-5 ${impact.text}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Estimated impact</p>
                            <p className={`text-2xl font-semibold ${impact.text}`}>{impact.label}</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Risk threshold and rate limit projection.</p>
                </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">Restricted users (risk threshold)</span>
                <span className="text-lg font-semibold text-white">{result.restrictedUsers}</span>
            </div>
        </div>
    );
};

export default SimulationResultCard;
