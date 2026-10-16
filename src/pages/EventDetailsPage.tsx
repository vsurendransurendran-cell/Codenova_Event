import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Share2,
  Tag,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { api } from '../utils/api.ts';
import { EventItem } from '../types/index.ts';
import { CapacityBadge } from '../components/CapacityBadge.tsx';
import { RegistrationModal } from '../components/RegistrationModal.tsx';
import { formatEventDateTime } from '../utils/registrationRules.ts';

export const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchEvent = async (isSilent = false) => {
    if (!eventId) return;
    if (!isSilent) {
      setIsLoading(true);
      setErrorMessage(null);
    }

    try {
      const res = await api.getEventById(eventId);
      if (res.success && res.event) {
        setEvent(res.event);
      } else if (!isSilent) {
        setErrorMessage('Event could not be found.');
      }
    } catch (err: any) {
      if (!isSilent) {
        setErrorMessage(err.message || 'Unable to retrieve event details.');
      }
    } finally {
      if (!isSilent) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="h-10 bg-stone-200 w-1/3 mx-auto rounded-md animate-pulse mb-6" />
        <div className="h-4 bg-stone-100 w-2/3 mx-auto rounded-md animate-pulse mb-3" />
        <div className="h-64 bg-stone-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (errorMessage || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-white border border-stone-200 rounded-lg">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
          <p className="text-xs text-stone-500 mt-2">
            {errorMessage || 'The requested event does not exist or may have been removed.'}
          </p>
          <Link
            to="/events"
            className="mt-6 inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Events Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const remaining = event.remainingCapacity !== undefined
    ? event.remainingCapacity
    : Math.max(0, event.maxCapacity - (event.confirmedRegistrationsCount || 0));

  const isFull = remaining <= 0;
  const isPastDeadline = new Date() > new Date(event.registrationDeadline);
  const isCancelled = event.status === 'cancelled';
  const isCompleted = event.status === 'completed';
  const isRegistrationOpen =
    (event.status === 'upcoming' || event.status === 'ongoing') && !isFull && !isPastDeadline;

  const percentFilled = event.maxCapacity > 0
    ? Math.min(100, Math.round(((event.confirmedRegistrationsCount || 0) / event.maxCapacity) * 100))
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs">
        {/* Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 rounded-xs border border-stone-200">
              {event.category}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-stone-50 text-stone-600 rounded-xs border border-stone-200">
              {event.format}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Event'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {event.title}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
          {event.shortDescription}
        </p>

        {/* Schedule & Logistics Bar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-50 border border-stone-200 rounded-md text-xs">
          <div className="flex items-start space-x-2.5">
            <Calendar className="w-4 h-4 text-slate-900 mt-0.5 shrink-0" />
            <div>
              <span className="text-stone-500 font-semibold block uppercase text-[10px]">Date & Time</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {formatEventDateTime(event.startDate, event.timeZone)}
              </p>
              <p className="text-stone-500">to {formatEventDateTime(event.endDate, event.timeZone)}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-slate-900 mt-0.5 shrink-0" />
            <div>
              <span className="text-stone-500 font-semibold block uppercase text-[10px]">Location / Venue</span>
              <p className="font-bold text-slate-900 mt-0.5">{event.venue}</p>
              <p className="text-stone-500">{event.format} Session</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Clock className="w-4 h-4 text-slate-900 mt-0.5 shrink-0" />
            <div>
              <span className="text-stone-500 font-semibold block uppercase text-[10px]">Registration Deadline</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {formatEventDateTime(event.registrationDeadline, event.timeZone)}
              </p>
              <p className="text-stone-500">
                {isPastDeadline ? 'Deadline has expired' : 'Registrations close strictly on schedule'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Detailed Description vs Capacity Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Full Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Full Description */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-stone-100 pb-3 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-teal-800" />
              <span>Event Overview & Syllabus</span>
            </h2>
            <div className="prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
              {event.fullDescription.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Speaker / Facilitator Info */}
          {event.speakerInfo?.name && (
            <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 border-b border-stone-100 pb-3 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-teal-800" />
                <span>Featured Speaker & Instructor</span>
              </h2>
              <div className="mt-4 flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-bold text-base rounded-md shrink-0">
                  {event.speakerInfo.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{event.speakerInfo.name}</h3>
                  <p className="text-xs text-teal-800 font-semibold">
                    {event.speakerInfo.role} {event.speakerInfo.company && `at ${event.speakerInfo.company}`}
                  </p>
                  {event.speakerInfo.bio && (
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {event.speakerInfo.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prerequisites & Requirements */}
          {event.prerequisites && (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                Requirements & Prerequisites
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-md border border-stone-200">
                {event.prerequisites}
              </p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-xs border border-stone-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Live Capacity & Registration Action */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-900" />
              <span>Participant Capacity</span>
            </h3>

            {/* Live Numbers */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Max Capacity:</span>
                <span className="font-bold text-slate-900">{event.maxCapacity} seats</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Confirmed Attendees:</span>
                <span className="font-bold text-slate-900">{event.confirmedRegistrationsCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Available Remaining:</span>
                <span className="font-bold text-teal-800 text-sm">{remaining} seats</span>
              </div>

              {/* Meter */}
              <div className="pt-2">
                <div className="w-full bg-stone-100 h-2.5 rounded-xs overflow-hidden border border-stone-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isFull ? 'bg-rose-500' : percentFilled >= 80 ? 'bg-amber-500' : 'bg-slate-900'
                    }`}
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                  <span>{percentFilled}% Filled</span>
                  <span>{event.maxCapacity} Max</span>
                </div>
              </div>

              <div className="pt-2">
                <CapacityBadge
                  maxCapacity={event.maxCapacity}
                  confirmedCount={event.confirmedRegistrationsCount}
                  remainingCapacity={remaining}
                  status={event.status}
                  isPastDeadline={isPastDeadline}
                />
              </div>
            </div>

            {/* Registration Action Trigger */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              {isRegistrationOpen ? (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Register for this Event</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-100 border border-stone-200 rounded-md cursor-not-allowed text-center"
                  >
                    Registration Closed
                  </button>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-600 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-1">
                      Why is registration unavailable?
                    </span>
                    {isCancelled && 'This event has been officially cancelled by administration.'}
                    {isCompleted && 'This event has already taken place and concluded.'}
                    {!isCancelled && !isCompleted && isPastDeadline && (
                      'The registration cutoff deadline for this event has passed.'
                    )}
                    {!isCancelled && !isCompleted && !isPastDeadline && isFull && (
                      'All seats have been confirmed. Maximum capacity has been reached.'
                    )}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-stone-500 mt-3 text-center leading-normal">
                Strict single-registration enforcement by email. Concurrency protected against race conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <RegistrationModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            // Silently re-fetch event to update live capacity numbers in background!
            fetchEvent(true);
          }}
        />
      )}
    </div>
  );
};
