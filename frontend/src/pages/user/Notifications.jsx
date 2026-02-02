import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import axios from '../../utils/axios';

const NotificationsPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/user/notifications');
            const notifs = response.data.notifications || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/api/notifications/${notificationId}/read`);
            setNotifications(
                notifications.map(n =>
                    n._id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert':
                return <AlertTriangle className="w-5 h-5 text-orange-400" />;
            case 'suspicious':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            case 'blocked':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'info':
            default:
                return <Bell className="w-5 h-5 text-blue-400" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500/20 border-red-500/50 text-red-400';
            case 'high':
                return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
            case 'medium':
                return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            case 'low':
            default:
                return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                    <p className="text-gray-400">Security alerts and admin messages</p>
                </div>
                {unreadCount > 0 && (
                    <div className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                        {unreadCount} new
                    </div>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`p-4 rounded-lg border transition ${notif.read
                                ? 'bg-slate-800/30 border-slate-700'
                                : 'bg-slate-800/50 border-slate-600'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    {getIcon(notif.type)}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-white font-semibold">{notif.title}</h3>
                                            {notif.actionRequired && (
                                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/50">
                                                    Action Required
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 text-xs rounded border ${getSeverityColor(notif.severity)}`}>
                                                {notif.severity}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-2">{notif.message}</p>
                                        {notif.details && (
                                            <div className="text-xs text-gray-500 space-y-1 mb-2">
                                                {notif.details.endpoint && <p>Endpoint: {notif.details.endpoint}</p>}
                                                {notif.details.reason && <p>Reason: {notif.details.reason}</p>}
                                                {notif.details.ipAddress && <p>IP: {notif.details.ipAddress}</p>}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-600">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {!notif.read && (
                                    <button
                                        onClick={() => markAsRead(notif._id)}
                                        className="ml-2 p-1 hover:bg-slate-700 rounded transition"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
