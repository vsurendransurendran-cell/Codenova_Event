import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
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
    <article className="bg-white border border-stone-200 rounded-lg flex flex-col justify-between overflow-hidden shadow-xs hover:border-stone-300 hover:shadow-sm transition-all duration-150">
      {/* Optional Top Visual Banner / Image */}
      {event.imageUrl && (
        <div className="relative h-44 w-full bg-stone-100 overflow-hidden border-b border-stone-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white rounded-xs backdrop-blur-xs">
              {event.category}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/95 text-stone-800 rounded-xs shadow-2xs backdrop-blur-xs">
              {event.format}
            </span>
          </div>
          {event.status === 'cancelled' && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-xs">
                Cancelled
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {!event.imageUrl && (
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 rounded-xs border border-stone-200">
              {event.category}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-stone-50 text-stone-600 rounded-xs border border-stone-200">
              {event.format}
            </span>
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-slate-800 transition-colors">
          <Link to={`/events/${event._id}`}>
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed flex-1">
          {event.shortDescription}
        </p>

        {/* Schedule & Venue Metadata */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
          <div className="flex items-start space-x-2">
            <Calendar className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span className="font-medium text-stone-800">
              {formatEventDateTime(event.startDate, event.timeZone)}
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span className="text-stone-500">
              Deadline: {formatEventDateTime(event.registrationDeadline, event.timeZone)}
            </span>
          </div>
        </div>

        {/* Real-time Capacity Progress Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-stone-700 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>Registrations</span>
            </span>
            <span className="font-semibold text-slate-900">
              {event.confirmedRegistrationsCount} / {event.maxCapacity} ({percentFilled}%)
            </span>
          </div>
          {/* Progress track */}
          <div className="w-full bg-stone-100 h-2 rounded-xs overflow-hidden border border-stone-200/60">
            <div
              className={`h-full transition-all duration-300 ${
                isFull
                  ? 'bg-rose-500'
                  : percentFilled >= 80
                  ? 'bg-amber-500'
                  : 'bg-slate-800'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
          <div className="mt-2">
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
      <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-500">
          {isRegistrationOpen ? 'Registration Open' : 'Closed'}
        </span>
        <Link
          to={`/events/${event._id}`}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            isRegistrationOpen
              ? 'bg-slate-900 text-white hover:bg-slate-800'
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
