/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center mt-20">
      <h1>Something went wrong</h1>

      <button onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}