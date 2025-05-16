"use client";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
