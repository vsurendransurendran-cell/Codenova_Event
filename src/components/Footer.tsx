import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-white text-slate-900 flex items-center justify-center rounded-md font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">EVENTFLOW</span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Enterprise event registration and capacity management platform engineered for university symposiums, engineering hackathons, and technical masterclasses.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-2">
              <span className="inline-flex items-center space-x-1.5 text-stone-300">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <span>MongoDB & Mongoose</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Atomic Concurrency</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Compound Unique Indexes</span>
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-stone-200 uppercase">Platform Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-stone-400 hover:text-white transition-colors">
                  Explore Events Directory
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-white transition-colors">
                  Architecture & Technical Specs
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-stone-400 hover:text-white transition-colors">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Internship Meta */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-stone-200 uppercase">Internship Program</h4>
            <div className="text-xs text-stone-400 space-y-2 leading-relaxed">
              <p className="font-medium text-stone-300">CodeNova Full Stack Development</p>
              <p>Task 3: Event Registration & Management System</p>
              <p className="text-stone-500">
                Implements end-to-end data modeling, server-side duplicate prevention (HTTP 409), race-condition-safe capacity reservation, and role-based administration.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {currentYear} EVENTFLOW. All rights reserved. Built for CodeNova Technical Evaluation.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="text-stone-400">Strict Data Privacy & Email Normalization Policy</span>
            <span className="text-teal-400 font-medium">REST API v1.0 Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
