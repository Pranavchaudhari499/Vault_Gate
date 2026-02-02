import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Zap, Lock, ArrowRight, Server, Users, BarChart3 } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Secure by Design',
        description: 'JWT authentication, API key validation, and role-based access control built-in.'
    },
    {
        icon: Activity,
        title: 'Real-Time Monitoring',
        description: 'Track traffic, detect suspicious activity, and monitor health at a glance.'
    },
    {
        icon: Zap,
        title: 'Rate Limiting',
        description: 'Prevent abuse with smart throttling and automatic blocking for bad actors.'
    }
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Navigation - Fixed at top for better UX */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Left: Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-bold text-lg">V</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Vault Gate</span>
                    </div>

                    {/* Right: Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-300 hover:text-white transition"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] -z-10" />
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Enterprise-grade API security</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                            Protect your financial APIs with
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Vault Gate</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                            The modern gateway for fintech. Monitor usage, stop bad actors, and deploy 
                            bulletproof authentication in minutes, not months.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all transform hover:-translate-y-0.5"
                            >
                                <span>Start Building for Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6">Platform Security Stack</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'JWT + API Key Validation', color: 'bg-emerald-500' },
                                    { label: 'Real-time Rate Limiting', color: 'bg-amber-500' },
                                    { label: 'Suspicious Behavior Detection', color: 'bg-blue-500' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                        <span className="text-slate-300 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Robust infrastructure built to handle millions of requests without breaking a sweat.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/50 transition-all"
                            >
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works / Steps */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mt-8">
                            <Server className="text-blue-400 mb-4" />
                            <h5 className="font-bold">Connect Origin</h5>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <Users className="text-cyan-400 mb-4" />
                            <h5 className="font-bold">Define Roles</h5>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <BarChart3 className="text-purple-400 mb-4" />
                            <h5 className="font-bold">Monitor Logs</h5>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 -mt-8">
                            <Zap className="text-amber-400 mb-4" />
                            <h5 className="font-bold">Auto-Scale</h5>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl font-bold mb-6">Simple Integration</h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Vault Gate sits between your users and your services. Just point your domain to our edge, 
                            configure your rules in the dashboard, and you're protected. No code changes required.
                        </p>
                        <ul className="space-y-4">
                            {['Zero-latency overhead', 'Global edge network', 'Automated SSL management'].map((li) => (
                                <li key={li} className="flex items-center space-x-3 text-slate-200">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    </div>
                                    <span>{li}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2 opacity-50">
                        <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold">V</div>
                        <span className="text-sm">© 2026 Vault Gate. All rights reserved.</span>
                    </div>
                    <div className="flex space-x-8 text-sm text-slate-400">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;