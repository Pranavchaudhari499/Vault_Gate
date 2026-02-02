import { useState } from 'react';
import { X, User, Mail, Clock, AlertTriangle, Send } from 'lucide-react';
import axios from '../utils/axios';

const InvestigateModal = ({ activity, onClose, onNotificationSent }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [notificationForm, setNotificationForm] = useState({
        title: 'Suspicious Activity Alert',
        message: ''
    });

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`/api/admin/user/${activity.userId}`);
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        if (activity.userId) {
            fetchUserInfo();
        }
    }, [activity.userId]);

    const handleSendNotification = async () => {
        if (!notificationForm.message.trim()) {
            alert('Please enter a message');
            return;
        }

        setSending(true);
        try {
            await axios.post('/api/admin/notify', {
                userId: activity.userId,
                title: notificationForm.title,
                message: notificationForm.message,
                type: 'alert',
                severity: activity.severity,
                actionRequired: true,
                details: {
                    endpoint: activity.details,
                    ipAddress: activity.ip,
                    timestamp: activity.timestamp
                }
            });

            alert('Notification sent successfully!');
            setNotificationForm({ title: 'Suspicious Activity Alert', message: '' });
            onNotificationSent?.();
        } catch (error) {
            alert('Error sending notification: ' + (error.response?.data?.message || error.message));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                        <h2 className="text-xl font-semibold text-white">Investigate Activity</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-700 rounded transition"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Activity Info */}
                    <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-300 mb-3">Suspicious Activity</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p><strong>Action:</strong> {activity.action}</p>
                            <p><strong>Type:</strong> {activity.type}</p>
                            <p><strong>Severity:</strong> {activity.severity}</p>
                            <p><strong>Details:</strong> {activity.details}</p>
                            <p><strong>IP Address:</strong> {activity.ip}</p>
                            <p><strong>Time:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* User Info */}
                    {loading ? (
                        <div className="text-center py-6">
                            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : userInfo ? (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-300 mb-3">User Information</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-blue-400" />
                                    <p><strong>Username:</strong> {userInfo.user?.username}</p>
                                </div>
                                <p><strong>Role:</strong> {userInfo.user?.role}</p>
                                <p><strong>Member Since:</strong> {new Date(userInfo.user?.createdAt).toLocaleDateString()}</p>
                                <p><strong>Recent API Calls:</strong> {userInfo.recentLogs?.length || 0}</p>
                            </div>
                        </div>
                    ) : null}

                    {/* Send Notification */}
                    <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-300 mb-3">Send Alert to User</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={notificationForm.title}
                                    onChange={(e) =>
                                        setNotificationForm({ ...notificationForm, title: e.target.value })
                                    }
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Alert subject"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Message</label>
                                <textarea
                                    value={notificationForm.message}
                                    onChange={(e) =>
                                        setNotificationForm({ ...notificationForm, message: e.target.value })
                                    }
                                    rows="3"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe the suspicious activity and recommended action..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-slate-700 bg-slate-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-700 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSendNotification}
                        disabled={sending || !notificationForm.message.trim()}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 flex items-center space-x-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>{sending ? 'Sending...' : 'Send Alert'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestigateModal;
