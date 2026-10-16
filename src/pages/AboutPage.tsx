import React from 'react';
import {
  ShieldCheck,
  Database,
  Layers,
  Cpu,
  Lock,
  GitBranch,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-900">
      {/* Title & Introduction */}
      <div className="border-b border-stone-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
          Technical Specification & Internship Report
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          CodeNova Full Stack Development Internship
        </h1>
        <p className="text-sm font-semibold text-stone-500 mt-1">
          Task 3: Production-Minded Event Registration & Management Platform (EVENTFLOW)
        </p>
      </div>

      {/* Executive Summary */}
      <section className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-800" />
          <span>1. Architecture & Engineering Overview</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          EVENTFLOW is engineered as a full-stack MERN application that rejects superficial UI mockups in favor of database-enforced integrity. The system solves the classical overbooking and duplicate-entry challenges endemic to high-demand campus hackathons and technical masterclasses through transactional atomic operations and database indexing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-md border border-stone-200">
            <span className="font-bold text-slate-900 block">Frontend Stack</span>
            <span className="text-stone-600 mt-1 block">React 19, TypeScript, Vite, Tailwind CSS, React Router v7</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-md border border-stone-200">
            <span className="font-bold text-slate-900 block">Backend Stack</span>
            <span className="text-stone-600 mt-1 block">Node.js, Express.js, RESTful Architecture, Centralized Error Middleware</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-md border border-stone-200">
            <span className="font-bold text-slate-900 block">Database Layer</span>
            <span className="text-stone-600 mt-1 block">MongoDB & Mongoose, Compound Unique Indexes, Atomic Updates</span>
          </div>
        </div>
      </section>

      {/* Key Architectural Guarantees */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          2. Mandatory Implementation Guarantees
        </h2>

        {/* Compound Index & Duplicate Prevention */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                A. Database-Level Duplicate Registration Prevention
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Rather than relying solely on client-side state or vulnerable check-then-insert queries, the Mongoose schema establishes a strict compound unique index:
              </p>
              <pre className="mt-3 p-3 bg-stone-900 text-teal-400 font-mono text-[11px] rounded-md overflow-x-auto">
{`RegistrationSchema.index(
  { eventId: 1, normalizedEmail: 1 }, 
  { unique: true }
);`}
              </pre>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Before reaching the database, participant emails are normalized (trimmed and case-folded). If a concurrent attempt violates uniqueness, MongoDB rejects it with error code <code>11000</code>, which our centralized error middleware translates to <code>HTTP 409 Conflict</code>:
              </p>
              <pre className="mt-2 p-3 bg-stone-900 text-stone-200 font-mono text-[11px] rounded-md overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "DUPLICATE_REGISTRATION",
    "message": "This email address is already registered for this event."
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Race Condition Safety */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                B. Race-Condition-Safe Capacity Management
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                When two participants register for the final seat simultaneously, standard application-level counters fail. EVENTFLOW executes atomic test-and-increment operations directly in MongoDB:
              </p>
              <pre className="mt-3 p-3 bg-stone-900 text-teal-400 font-mono text-[11px] rounded-md overflow-x-auto">
{`const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    status: { $in: ['upcoming', 'ongoing'] },
    registrationDeadline: { $gte: new Date() },
    $expr: { $lt: ['$confirmedRegistrationsCount', '$maxCapacity'] }
  },
  { $inc: { confirmedRegistrationsCount: 1 } },
  { new: true }
);`}
              </pre>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Only the request that successfully reserves capacity can insert the participant document. If document creation fails or triggers a duplicate index violation, the capacity increment is immediately and atomically rolled back with <code>$inc: {`{ confirmedRegistrationsCount: -1 }`}</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Admin Authentication & Security */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                C. Secure Administrator Authentication & Session Isolation
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Administrative endpoints are guarded by server-side verification:
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                <li>Passwords hashed with <strong>bcrypt</strong> (10 salt rounds); password hashes never returned in API payloads.</li>
                <li>Session tokens signed via JWT and stored in <strong>HTTP-only, SameSite='lax' cookies</strong> to mitigate XSS extraction.</li>
                <li>Live database statistics aggregated in real time across events, confirmed participants, and remaining quotas.</li>
                <li>Capacity edit safety: administrators cannot reduce an event's capacity below the number of already-confirmed attendees.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Demo Credentials */}
      <section className="bg-stone-50 border border-stone-300 rounded-lg p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Administrator Evaluation Access
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          For grading and technical assessment of Task 3, pre-provisioned administrative credentials are configured:
        </p>
        <div className="p-4 bg-white border border-stone-200 rounded-md text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-stone-500">Email:</span> <strong className="text-slate-900">admin@eventflow.dev</strong>
          </div>
          <div>
            <span className="text-stone-500">Password:</span> <strong className="text-slate-900">AdminPass123!</strong>
          </div>
          <Link
            to="/admin/login"
            className="px-3 py-1.5 bg-slate-900 text-white rounded-md font-sans text-xs font-semibold text-center hover:bg-slate-800"
          >
            Access Admin Portal
          </Link>
        </div>
      </section>
    </div>
  );
};
