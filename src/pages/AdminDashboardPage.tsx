import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  UserX,
  PieChart,
  PlusCircle,
  Download,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { api } from '../utils/api.ts';
import { DashboardStats, EventItem } from '../types/index.ts';
import { AdminSidebar } from '../components/AdminSidebar.tsx';
import { CapacityBadge } from '../components/CapacityBadge.tsx';
import { formatEventDateTime } from '../utils/registrationRules.ts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminEvents({ limit: 5, sort: 'date_asc' }),
        ]);

        if (statsRes.success) {
          setStats(statsRes.stats);
        }
        if (eventsRes.success) {
          setRecentEvents(eventsRes.events);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Unable to load administrative dashboard.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Operations Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Platform Overview & Metrics
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Real-time database aggregates calculated across all active records.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={api.getExportRegistrationsUrl()}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 transition-colors shadow-2xs"
              download
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All CSV</span>
            </a>
            <Link
              to="/admin/events/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all shadow-sm shadow-blue-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Aggregates Metrics Row */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 bg-white border border-stone-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Events */}
            <div className="bg-white border border-stone-200/90 border-t-2 border-t-blue-600 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Events</span>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.totalEvents}</span>
                <span className="text-xs text-blue-700 font-bold">
                  ({stats.upcomingEvents} active)
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {stats.completedEvents} completed • {stats.cancelledEvents} cancelled
              </p>
            </div>

            {/* Confirmed Registrations */}
            <div className="bg-white border border-stone-200/90 border-t-2 border-t-indigo-600 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Attendees</span>
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {stats.totalConfirmedRegistrations}
                </span>
                <span className="text-xs text-stone-500 font-medium">participants</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {stats.occupancyRate}% global capacity allocated
              </p>
            </div>

            {/* Remaining Capacity */}
            <div className="bg-white border border-stone-200/90 border-t-2 border-t-cyan-500 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Open Seat Quota</span>
                <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.remainingCapacity}</span>
                <span className="text-xs text-stone-500">of {stats.totalCapacity} total</span>
              </div>
              <p className="text-[11px] text-blue-700 font-semibold mt-1">
                Atomic reservation active
              </p>
            </div>

            {/* Cancelled Registrations */}
            <div className="bg-white border border-stone-200/90 border-t-2 border-t-stone-400 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Cancelled Records</span>
                <div className="p-1.5 bg-stone-100 text-stone-500 rounded-md">
                  <UserX className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-stone-700">
                  {stats.totalCancelledRegistrations}
                </span>
                <span className="text-xs text-stone-500">released</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Seats automatically restored to capacity
              </p>
            </div>
          </div>
        ) : null}

        {/* Two Column Grid: Category Breakdown vs Recent Events */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution (1 Col) */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 pb-4 border-b border-stone-100">
              <PieChart className="w-4 h-4 text-slate-700" />
              <span>Disciplines & Attendance</span>
            </h2>

            {stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? (
              <div className="mt-4 space-y-4">
                {stats.categoryDistribution.map((item) => {
                  const percent =
                    stats.totalConfirmedRegistrations > 0
                      ? Math.round(
                          (item.confirmedRegistrations / stats.totalConfirmedRegistrations) * 100
                        )
                      : 0;

                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-stone-800">{item.category}</span>
                        <span className="text-stone-500 font-medium">
                          {item.confirmedRegistrations} attendees ({item.eventsCount} events)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-xs overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-xs transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-500 mt-4">No registration distribution data yet.</p>
            )}
          </div>

          {/* Recent Upcoming Events Table (2 Cols) */}
          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-lg p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4 text-slate-700" />
                  <span>Recent Events Schedule</span>
                </h2>
                <Link
                  to="/admin/events"
                  className="text-xs font-semibold text-slate-900 hover:text-teal-800 transition-colors flex items-center space-x-1"
                >
                  <span>Manage All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Capacity</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentEvents.map((ev) => (
                      <tr key={ev._id} className="hover:bg-stone-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-900 max-w-[180px] truncate">
                          {ev.title}
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          <span className="px-1.5 py-0.5 bg-stone-100 rounded-xs border border-stone-200 text-[10px] font-semibold">
                            {ev.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-500">
                          {formatEventDateTime(ev.startDate, ev.timeZone)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-900">
                            {ev.confirmedRegistrationsCount}
                          </span>{' '}
                          / {ev.maxCapacity}
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <Link
                            to={`/admin/events/${ev._id}/edit`}
                            className="text-slate-900 font-semibold hover:underline"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/admin/registrations?eventId=${ev._id}`}
                            className="text-teal-800 font-semibold hover:underline"
                          >
                            Attendees
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-stone-500">
              <span>Showing {recentEvents.length} events</span>
              <Link to="/admin/events" className="font-semibold text-slate-900 hover:underline">
                View all scheduled events →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
