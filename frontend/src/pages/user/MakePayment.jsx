import { useState } from 'react';
import { Send, DollarSign, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from '../../utils/axios';

const MakePayment = () => {
    const [formData, setFormData] = useState({
        recipient: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const res = await axios.post('/api/payment', {
                recipient: formData.recipient,
                amount: parseFloat(formData.amount)
            });

            setResponse({
                success: true,
                message: res.data.message || 'Payment successful',
                data: res.data
            });

            // Reset form
            setFormData({ recipient: '', amount: '' });
        } catch (error) {
            setResponse({
                success: false,
                message: error.response?.data?.message || 'Payment failed',
                status: error.response?.status
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Make Payment</h1>
                <p className="text-gray-400">Transfer funds through the Secure API Gateway</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Form */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <DollarSign className="w-6 h-6 text-green-400" />
                        <h2 className="text-xl font-semibold text-white">Payment Details</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recipient Username
                            </label>
                            <input
                                type="text"
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter recipient username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Send Payment</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Response Panel */}
                <div className="space-y-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Response</h3>

                        {response ? (
                            <div className={`p-4 rounded-lg border ${response.success
                                    ? 'bg-green-500/10 border-green-500/50'
                                    : 'bg-red-500/10 border-red-500/50'
                                }`}>
                                <div className="flex items-start space-x-3">
                                    {response.success ? (
                                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className={`font-semibold mb-2 ${response.success ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {response.success ? 'Success' : 'Failed'}
                                        </p>
                                        <p className="text-gray-300 text-sm mb-2">{response.message}</p>
                                        {response.status && (
                                            <p className="text-xs text-gray-400">Status: {response.status}</p>
                                        )}
                                        {response.data && (
                                            <div className="mt-3 p-3 bg-slate-900/50 rounded">
                                                <pre className="text-xs text-gray-300 overflow-auto">
                                                    {JSON.stringify(response.data, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Make a payment to see the response</p>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-sm text-blue-300">
                            <strong>API Endpoint:</strong> POST /api/payment
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            This request goes through the Secure API Gateway with rate limiting protection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakePayment;
