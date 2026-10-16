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
  Sparkles,
  Zap,
  Ticket,
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
      {/* Premium Blue Gradient Hero Section */}
      <section className="relative bg-hero-gradient bg-hero-radial text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden border-b border-blue-900/60 shadow-xl">
        {/* Subtle geometric grid backdrop overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-500/10 text-blue-200 rounded-md text-xs font-semibold mb-6 border border-blue-400/25 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span className="tracking-wide">Academic & Technical Event Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Find your next opportunity to{' '}
              <span className="text-gradient-blue drop-shadow-xs">connect, learn, and lead.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-blue-100/85 leading-relaxed font-normal max-w-2xl">
              EVENTFLOW delivers verified registration and real-time capacity management for collegiate hackathons, engineering symposia, and cutting-edge tech masterclasses with concurrency guarantees.
            </p>

            {/* Search & Filter Box with Glassmorphism */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-10 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-blue-200/70" />
                <input
                  type="text"
                  placeholder="Search by topic, speaker, or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white text-slate-900 placeholder:text-stone-400 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 text-sm bg-white text-stone-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 rounded-lg shadow-md shadow-blue-900/40 transition-all shrink-0 flex items-center justify-center space-x-2"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* System Trust Pillars */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-blue-200/90 font-medium">
              <span className="flex items-center space-x-2 bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-500/20 backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>Zero Overbooking Guarantee</span>
              </span>
              <span className="flex items-center space-x-2 bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-500/20 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                <span>Duplicate Prevention Protocol</span>
              </span>
              <span className="flex items-center space-x-2 bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-500/20 backdrop-blur-xs">
                <FileCheck className="w-4 h-4 text-cyan-300" />
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
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider border border-blue-200/60 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Upcoming Events & Masterclasses
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select an event to inspect its curriculum, capacity status, and reserve a seat.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
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

      {/* How Registration Works Section with Gradient Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/60 rounded-xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-sm bg-blue-100 text-blue-900 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Protocol & Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How Event Registration Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              A transparent, high-integrity registration workflow protected by database-enforced consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-4">Discover an Event</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Filter by academic discipline, format, schedule, and live capacity status in our catalog.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-4">Review Details</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Inspect speaker credentials, prerequisites, venue information, and remaining seat counts.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-4">Submit Registration</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Provide your institutional affiliation and domain interests. Normalized email prevents duplicate attempts.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-4">Receive Confirmation</h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Obtain your unique registration reference code (<code className="text-blue-900 font-semibold">EVF-...</code>) with immediate database verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
