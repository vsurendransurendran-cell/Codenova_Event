import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Calendar,
} from 'lucide-react';
import { api } from '../utils/api.ts';
import { RegistrationItem, EventItem, Pagination } from '../types/index.ts';
import { AdminSidebar } from '../components/AdminSidebar.tsx';
import { formatEventDateTime } from '../utils/registrationRules.ts';

export const AdminRegistrationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryEventId = searchParams.get('eventId') || 'all';
  const queryStatus = searchParams.get('status') || 'all';
  const queryQ = searchParams.get('q') || '';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(queryQ);
  const [selectedAttendee, setSelectedAttendee] = useState<RegistrationItem | null>(null);

  // Load events list for filter dropdown
  useEffect(() => {
    api.getAdminEvents({ limit: 100 }).then((res) => {
      if (res.success) setEventsList(res.events);
    }).catch(console.error);
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getAdminRegistrations({
        eventId: queryEventId,
        status: queryStatus,
        q: queryQ,
        page: queryPage,
        limit: 20,
      });

      if (res.success) {
        setRegistrations(res.registrations);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to retrieve registrations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [queryEventId, queryStatus, queryQ, queryPage]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', searchInput.trim());
  };

  const handleStatusChange = async (
    reg: RegistrationItem,
    newStatus: 'confirmed' | 'cancelled' | 'waitlisted'
  ) => {
    const confirmPrompt =
      newStatus === 'cancelled'
        ? `Cancel registration for ${reg.fullName}? This will restore 1 seat to the event capacity.`
        : `Change status to "${newStatus}" for ${reg.fullName}?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      const res = await api.updateRegistrationStatus(reg._id, newStatus);
      if (res.success) {
        setActionSuccess(`Registration for ${reg.fullName} updated to ${newStatus}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchRegistrations();
        if (selectedAttendee?._id === reg._id) {
          setSelectedAttendee(res.registration);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Registrations & Attendance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Participant Registry
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Inspect verified participant credentials, enforce attendance, and export reports.
            </p>
          </div>

          <div>
            <a
              href={api.getExportRegistrationsUrl(queryEventId, queryStatus)}
              download
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-stone-300 rounded-md hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV (Current Filter)</span>
            </a>
          </div>
        </div>

        {/* Feedback alerts */}
        {actionSuccess && (
          <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-md text-xs text-teal-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="mt-6 bg-white border border-stone-200 rounded-lg p-4 shadow-2xs flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by participant name, email, organization, or ref code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </form>

          {/* Event Filter */}
          <select
            value={queryEventId}
            onChange={(e) => updateParam('eventId', e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md text-stone-800 focus:bg-white max-w-xs"
          >
            <option value="all">All Events</option>
            {eventsList.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={queryStatus}
            onChange={(e) => updateParam('status', e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md text-stone-800 focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Registrations Table */}
        <div className="mt-6 bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      Loading participant registry...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No registrations found matching active filters.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => {
                    const eventTitle =
                      typeof reg.eventId === 'object' && reg.eventId !== null
                        ? (reg.eventId as any).title
                        : 'Event';

                    return (
                      <tr key={reg._id} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {reg.registrationRef}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{reg.fullName}</div>
                          <div className="text-[11px] text-stone-500">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4 max-w-[180px]">
                          <span className="font-medium text-stone-800 truncate block">
                            {eventTitle}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{reg.organization}</td>
                        <td className="py-3 px-4 text-stone-500">
                          {formatEventDateTime(reg.registeredAt)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                              reg.status === 'confirmed'
                                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                : reg.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAttendee(reg)}
                            className="inline-flex items-center p-1 text-stone-600 hover:text-slate-900 hover:bg-stone-100 rounded-md"
                            title="Inspect Participant"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {reg.status === 'confirmed' ? (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(reg, 'cancelled')}
                              className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md"
                              title="Cancel registration and restore capacity"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(reg, 'confirmed')}
                              className="px-2 py-0.5 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md"
                              title="Re-confirm attendee"
                            >
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} registrations)
              </span>
              <div className="space-x-1">
                <button
                  type="button"
                  onClick={() => updateParam('page', (pagination.page - 1).toString())}
                  disabled={pagination.page <= 1}
                  className="px-2.5 py-1 bg-white border border-stone-300 rounded-md disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateParam('page', (pagination.page + 1).toString())}
                  disabled={pagination.page >= pagination.pages}
                  className="px-2.5 py-1 bg-white border border-stone-300 rounded-md disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Participant Details Modal */}
        {selectedAttendee && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-lg w-full overflow-hidden p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                    Registration Record
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedAttendee.fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAttendee(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-md flex justify-between items-center">
                  <span className="text-stone-500 font-semibold uppercase text-[10px]">Reference</span>
                  <span className="font-mono font-bold text-slate-900">{selectedAttendee.registrationRef}</span>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Email:</span>
                  <p className="font-semibold text-slate-900">{selectedAttendee.email}</p>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Affiliation / College:</span>
                  <p className="font-semibold text-slate-900">{selectedAttendee.organization}</p>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Domain Interests:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(selectedAttendee.domainInterests || []).map((dom) => (
                      <span key={dom} className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded-xs text-stone-800 font-medium">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Status:</span>
                  <p className="font-bold text-slate-900 uppercase mt-0.5">{selectedAttendee.status}</p>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Registered At:</span>
                  <p className="text-stone-700">{formatEventDateTime(selectedAttendee.registeredAt)}</p>
                </div>

                {selectedAttendee.notes && (
                  <div>
                    <span className="text-stone-500 font-medium">Notes:</span>
                    <p className="text-stone-700 bg-stone-50 p-2 rounded-md border border-stone-200 mt-1">
                      {selectedAttendee.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedAttendee(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
