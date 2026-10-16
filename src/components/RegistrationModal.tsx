import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { EventItem } from '../types/index.ts';
import { api } from '../utils/api.ts';
import { validateRegistrationInput } from '../utils/registrationRules.ts';
import { RegistrationSuccess } from './RegistrationSuccess.tsx';

interface RegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DOMAIN_OPTIONS = [
  'Frontend Development',
  'Cloud & DevOps',
  'Cybersecurity',
  'AI & Machine Learning',
  'UI/UX Design',
  'Systems & Architecture',
  'Product Management',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [domainInterests, setDomainInterests] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverErrorCode, setServerErrorCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  if (!isOpen) return null;

  const toggleDomain = (domain: string) => {
    setDomainInterests((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
    if (fieldErrors.domainInterests) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.domainInterests;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setServerErrorCode(null);

    // 1. Client-side validation check
    const validation = validateRegistrationInput({
      fullName,
      email,
      organization,
      domainInterests,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);

    try {
      const res = await api.registerForEvent(event._id, {
        fullName,
        email,
        organization,
        domainInterests,
        notes,
      });

      if (res.success && res.registration) {
        setSuccessData({
          registration: res.registration,
          event: res.event || event,
        });
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error('[Registration submit error]', err);
      const code = err.code || 'UNKNOWN_ERROR';
      setServerErrorCode(code);

      if (code === 'DUPLICATE_REGISTRATION') {
        setServerError('You have already registered for this event with this email address.');
      } else if (code === 'CAPACITY_REACHED') {
        setServerError('Sorry, this event just reached maximum capacity.');
      } else if (code === 'DEADLINE_PASSED') {
        setServerError('Registration is closed: the deadline has passed.');
      } else if (err.details) {
        setFieldErrors(err.details);
      } else {
        setServerError(err.message || 'Registration failed. Please check your details and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="relative bg-white w-full max-w-xl rounded-lg shadow-xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-stone-200 bg-stone-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              Registration Form
            </span>
            <h3 id="modal-headline" className="text-lg font-bold text-slate-900 mt-0.5">
              {event.title}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Capacity: {event.maxCapacity - (event.confirmedRegistrationsCount || 0)} seats remaining
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition-colors"
            aria-label="Close registration modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body: If successful, show confirmation */}
        {successData ? (
          <div className="p-6">
            <RegistrationSuccess
              registration={successData.registration}
              event={successData.event}
              onClose={onClose}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Global Server Error Alert */}
            {serverError && (
              <div
                className={`p-4 rounded-md border flex items-start space-x-3 text-sm ${
                  serverErrorCode === 'DUPLICATE_REGISTRATION'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-current" />
                <div className="flex-1">
                  <p className="font-semibold text-xs uppercase tracking-wider">
                    {serverErrorCode === 'DUPLICATE_REGISTRATION' ? 'Duplicate Registration' : 'Registration Error'}
                  </p>
                  <p className="text-xs mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className={`mt-1 block w-full px-3 py-2 text-sm bg-white border rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                  fieldErrors.fullName ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-300'
                }`}
                disabled={isSubmitting}
                required
              />
              {fieldErrors.fullName && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jane@institution.edu"
                className={`mt-1 block w-full px-3 py-2 text-sm bg-white border rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                  fieldErrors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-300'
                }`}
                disabled={isSubmitting}
                required
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Normalized and indexed by database to prevent duplicate submissions.
              </p>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* College / Organization */}
            <div>
              <label htmlFor="organization" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                College or Organization <span className="text-rose-600">*</span>
              </label>
              <input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Institute of Technology or Tech Corp"
                className={`mt-1 block w-full px-3 py-2 text-sm bg-white border rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                  fieldErrors.organization ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-300'
                }`}
                disabled={isSubmitting}
                required
              />
              {fieldErrors.organization && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.organization}</p>
              )}
            </div>

            {/* Domain Interests */}
            <div>
              <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                Domain Interests <span className="text-rose-600">*</span> (Select all that apply)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-stone-50 border border-stone-200 rounded-md">
                {DOMAIN_OPTIONS.map((domain) => {
                  const isChecked = domainInterests.includes(domain);
                  return (
                    <label
                      key={domain}
                      className={`flex items-center space-x-2 text-xs p-1.5 rounded-sm cursor-pointer select-none transition-colors ${
                        isChecked ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDomain(domain)}
                        className="rounded-xs text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                      />
                      <span>{domain}</span>
                    </label>
                  );
                })}
              </div>
              {fieldErrors.domainInterests && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.domainInterests}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Optional Notes or Questions
              </label>
              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special accommodations or dietary requests..."
                className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-md shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <span>Confirm Registration</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
