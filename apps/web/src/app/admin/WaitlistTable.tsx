"use client";

// Waitlist functionality has been removed
// This component is deprecated and no longer used

export function WaitlistTable({ entries }: { entries?: any[] }) {
  return (
    <div className="p-8 text-center text-gray-500">
      <p>Waitlist functionality has been removed.</p>
      <p>Users can now sign up directly at /sign-up</p>
    </div>
  );
}
