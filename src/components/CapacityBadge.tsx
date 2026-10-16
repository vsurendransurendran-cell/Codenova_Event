import React from 'react';

interface CapacityBadgeProps {
  maxCapacity: number;
  confirmedCount: number;
  remainingCapacity: number;
  status?: string;
  isPastDeadline?: boolean;
  size?: 'sm' | 'md';
}

export const CapacityBadge: React.FC<CapacityBadgeProps> = ({
  maxCapacity,
  confirmedCount,
  remainingCapacity,
  status = 'upcoming',
  isPastDeadline = false,
  size = 'md',
}) => {
  const isFull = remainingCapacity <= 0;
  const isCancelled = status === 'cancelled';
  const isCompleted = status === 'completed';

  const percent = maxCapacity > 0 ? Math.min(100, Math.round((confirmedCount / maxCapacity) * 100)) : 0;
  const isFillingFast = !isFull && percent >= 80;

  if (isCancelled) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        Event Cancelled
      </span>
    );
  }

  if (isCompleted) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
        Event Concluded
      </span>
    );
  }

  if (isPastDeadline) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        Deadline Passed
      </span>
    );
  }

  if (isFull) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
        Capacity Reached (0 left)
      </span>
    );
  }

  if (isFillingFast) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        Filling Fast ({remainingCapacity} left)
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-sm font-semibold border ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
    } bg-teal-50 text-teal-800 border-teal-200`}>
      {remainingCapacity} of {maxCapacity} seats available
    </span>
  );
};
