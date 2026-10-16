import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Users,
  LogOut,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events Management', href: '/admin/events', icon: CalendarDays },
    { name: 'Create Event', href: '/admin/events/new', icon: PlusCircle },
    { name: 'Registrations & Attendees', href: '/admin/registrations', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/events/new') return location.pathname === '/admin/events/new';
    if (path === '/admin/events') return location.pathname === '/admin/events' || (location.pathname.startsWith('/admin/events/') && !location.pathname.includes('/new'));
    return location.pathname === path;
  };

  return (
    <aside className="w-full md:w-64 bg-stone-900 text-stone-200 flex flex-col justify-between shrink-0 border-r border-stone-800">
      <div>
        {/* Admin Brand Header */}
        <div className="p-5 border-b border-stone-800">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-7 h-7 bg-teal-500 text-slate-950 flex items-center justify-center rounded-md font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                EVENTFLOW ADMIN
              </span>
              <span className="text-[10px] text-teal-400 font-medium">Control Center</span>
            </div>
          </div>
          {user && (
            <div className="mt-3 px-2 py-1.5 bg-stone-800/80 rounded-md text-xs text-stone-300">
              <p className="font-semibold text-white truncate">{user.fullName || user.username}</p>
              <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1" aria-label="Administrator navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  active
                    ? 'bg-stone-800 text-white font-bold'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-stone-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-stone-800 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800/50 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Portal</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
