import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Calendar, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatEventDateTime } from '../utils/registrationRules.ts';

interface RegistrationSuccessProps {
  registration: {
    registrationRef: string;
    fullName: string;
    email: string;
    organization: string;
    domainInterests: string[];
    status: string;
    registeredAt: string;
  };
  event: {
    id?: string;
    title: string;
    startDate?: string;
    endDate?: string;
    timeZone?: string;
    venue?: string;
    format?: string;
  };
  onClose?: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  registration,
  event,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(registration.registrationRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 max-w-xl mx-auto shadow-sm text-slate-900">
      {/* Success Banner */}
      <div className="flex items-center space-x-3 pb-6 border-b border-stone-200">
        <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Registration Confirmed
          </span>
          <h2 className="text-xl font-bold text-slate-900">You're officially registered!</h2>
        </div>
      </div>

      {/* Registration Reference Box */}
      <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-md">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Official Registration Reference
        </span>
        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-mono font-bold text-slate-900 tracking-wider">
            {registration.registrationRef}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-100 transition-colors"
            title="Copy reference code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-teal-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-stone-500 mt-2">
          Keep this reference code for check-in at the entrance or for looking up your credentials.
        </p>
      </div>

      {/* Event Details Summary */}
      <div className="mt-6 space-y-3 border-t border-stone-100 pt-5 text-sm">
        <div>
          <span className="text-xs text-stone-500 font-medium">Event:</span>
          <p className="font-bold text-slate-900 text-base">{event.title}</p>
        </div>

        {event.startDate && (
          <div className="flex items-start space-x-2 text-stone-700 text-xs">
            <Calendar className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>{formatEventDateTime(event.startDate, event.timeZone)}</span>
          </div>
        )}

        {event.venue && (
          <div className="flex items-start space-x-2 text-stone-700 text-xs">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>{event.venue}</span>
          </div>
        )}

        <div className="flex items-start space-x-2 text-stone-700 text-xs">
          <UserCheck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            Participant: <strong className="text-slate-900">{registration.fullName}</strong> ({registration.email})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-5 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Done
          </button>
        )}
        <Link
          to="/events"
          className="w-full sm:flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
        >
          <span>Explore More Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
