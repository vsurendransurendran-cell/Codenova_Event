import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { EventItem } from '../types/index.ts';
import { CapacityBadge } from './CapacityBadge.tsx';
import { formatEventDateTime } from '../utils/registrationRules.ts';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const remaining = event.remainingCapacity !== undefined
    ? event.remainingCapacity
    : Math.max(0, event.maxCapacity - (event.confirmedRegistrationsCount || 0));

  const isFull = remaining <= 0;
  const isPastDeadline = new Date() > new Date(event.registrationDeadline);
  const isRegistrationOpen =
    (event.status === 'upcoming' || event.status === 'ongoing') && !isFull && !isPastDeadline;

  const percentFilled = event.maxCapacity > 0
    ? Math.min(100, Math.round(((event.confirmedRegistrationsCount || 0) / event.maxCapacity) * 100))
    : 0;

  return (
    <article className="group bg-white border border-stone-200/90 rounded-xl flex flex-col justify-between overflow-hidden shadow-2xs hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-200">
      {/* Top Banner / Image */}
      {event.imageUrl && (
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-stone-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
          {/* Subtle gradient overlay at bottom of image for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white rounded-md backdrop-blur-md border border-white/10 shadow-xs">
              {event.category}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/95 text-blue-900 rounded-md shadow-2xs backdrop-blur-md">
              {event.format}
            </span>
          </div>

          {event.status === 'cancelled' && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xs flex items-center justify-center">
              <span className="px-3.5 py-1 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md">
                Cancelled
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {!event.imageUrl && (
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 rounded-md border border-blue-200/60">
              {event.category}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 text-stone-600 rounded-md border border-stone-200">
              {event.format}
            </span>
          </div>
        )}

        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
          <Link to={`/events/${event._id}`}>
            {event.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed flex-1 font-normal">
          {event.shortDescription}
        </p>

        {/* Schedule & Venue Metadata */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 space-y-2 text-xs text-stone-600">
          <div className="flex items-start space-x-2.5">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="font-semibold text-slate-800">
              {formatEventDateTime(event.startDate, event.timeZone)}
            </span>
          </div>
          <div className="flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span className="text-stone-500">
              Deadline: {formatEventDateTime(event.registrationDeadline, event.timeZone)}
            </span>
          </div>
        </div>

        {/* Real-time Capacity Progress Bar with Blue Gradient */}
        <div className="mt-4 pt-3.5 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-stone-700 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Registrations</span>
            </span>
            <span className="font-bold text-slate-900">
              {event.confirmedRegistrationsCount} / {event.maxCapacity} ({percentFilled}%)
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200/60 p-px">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull
                  ? 'bg-rose-500'
                  : percentFilled >= 80
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          <div className="mt-2.5">
            <CapacityBadge
              maxCapacity={event.maxCapacity}
              confirmedCount={event.confirmedRegistrationsCount}
              remainingCapacity={remaining}
              status={event.status}
              isPastDeadline={isPastDeadline}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-gradient-to-r from-stone-50 to-blue-50/30 border-t border-stone-200/80 flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-500">
          {isRegistrationOpen ? (
            <span className="text-blue-700 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Open</span>
            </span>
          ) : (
            'Closed'
          )}
        </span>
        <Link
          to={`/events/${event._id}`}
          className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            isRegistrationOpen
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xs shadow-blue-500/20'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <span>{isRegistrationOpen ? 'Register Now' : 'View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
