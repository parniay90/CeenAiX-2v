import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, LogOut, Settings, CircleUser as UserCircle } from 'lucide-react';

export default function PharmacyTopNav() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', message: 'New prescription from Dr. Ahmed Al Rashidi', time: '5 min ago', unread: true },
    { id: '2', message: 'Insurance claim approved for Omar Al Fahad', time: '1 hour ago', unread: true },
    { id: '3', message: 'Low stock alert: Amoxicillin 500mg', time: '2 hours ago', unread: true },
    { id: '4', message: 'Staff member Omar Hassan DHA expires in 7 days', time: '3 hours ago', unread: true },
    { id: '5', message: 'Daily report ready for download', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              Rx
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">CeenAiX</span>
            <span className="text-gray-400 hidden sm:block">|</span>
            <span className="text-sm text-gray-600 hidden sm:block">Pharmacy Portal</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Al Shifa Pharmacy</h1>
            <p className="text-sm text-gray-600">Al Barsha, Dubai</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => {}}
          >
            <Search className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Search...</span>
            <kbd className="px-2 py-0.5 bg-white rounded text-xs text-gray-500 border border-gray-300">
              ⌘K
            </kbd>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-600">{unreadCount} unread</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 ${
                        notification.unread ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'
                      }`}
                      onClick={() => navigate('/pharmacy/notifications')}
                    >
                      <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/pharmacy/notifications')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                SA
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">Sara Al Mansoori</p>
                <p className="text-xs text-gray-600">Head Pharmacist</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">Sara Al Mansoori</p>
                  <p className="text-sm text-gray-600">Head Pharmacist</p>
                  <p className="text-xs text-gray-500 mt-1">EMP-001</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => navigate('/pharmacy/profile')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">My Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/pharmacy/settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-1">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
