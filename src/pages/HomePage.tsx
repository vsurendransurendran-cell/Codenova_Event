import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  FileCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { api } from '../utils/api.ts';
import { EventItem } from '../types/index.ts';
import { EventCard } from '../components/EventCard.tsx';

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [eventsRes, catRes] = await Promise.all([
          api.getEvents({ limit: 6, sort: 'date_asc' }),
          api.getCategories(),
        ]);
        if (eventsRes.success) {
          setEvents(eventsRes.events);
        }
        if (catRes.success) {
          setCategories(catRes.categories);
        }
      } catch (err) {
        console.error('Failed to load home page events:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Hero Section */}
      <section className="relative bg-white border-b border-stone-200 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-stone-100 text-stone-700 rounded-sm text-xs font-semibold mb-6 border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Academic & Technical Event Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find your next opportunity to connect, learn, and participate.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              EVENTFLOW provides verified registration and capacity management for collegiate hackathons, engineering symposiums, and professional masterclasses with real-time seat accounting.
            </p>

            {/* Quick Search & Discovery Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-2 bg-stone-50 border border-stone-300 rounded-lg shadow-xs flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by topic, keyword, or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-stone-700"
              >
                <option value="all">All Disciplines</option>
                {categories.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category} ({cat.count})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-md shadow-xs transition-colors shrink-0"
              >
                Explore Events
              </button>
            </form>

            {/* System Trust Pillars */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600 font-medium">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Zero Overbooking Guarantee</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                <span>Duplicate Registration Protection</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-teal-700" />
                <span>Instant Verified Credential</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Live Opportunities
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Upcoming Events & Masterclasses
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select an event to inspect its curriculum, capacity status, and reserve a seat.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 hover:text-teal-800 transition-colors"
          >
            <span>View All Events Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 bg-stone-100 rounded-lg animate-pulse border border-stone-200"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-lg p-8">
            <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No events scheduled at this moment</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Our academic administrators are preparing the next cycle of workshops and hackathons.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* How Registration Works (Requirement 5.E) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200 rounded-lg p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Protocol & Workflow
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              How Event Registration Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              A transparent, high-integrity registration workflow protected by database-enforced consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-md">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-xs">
                Step 01
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-3">Discover an Event</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Filter by academic discipline, format, schedule, and live capacity status in our catalog.
              </p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-md">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-xs">
                Step 02
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-3">Review Details</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Inspect speaker credentials, prerequisites, venue information, and remaining seat counts.
              </p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-md">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-xs">
                Step 03
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-3">Submit Registration</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Provide your institutional affiliation and domain interests. Normalized email prevents duplicate attempts.
              </p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-md">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-xs">
                Step 04
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-3">Receive Confirmation</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Obtain your unique registration reference code (<code className="text-slate-900 font-semibold">EVF-...</code>) with immediate database verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
