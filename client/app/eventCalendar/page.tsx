"use client";

import React, { useEffect, useState } from "react";
import { orientationApi } from "../../lib/apis";
import type { Orientation } from "../../types";

const formatDate = (iso: string): string => {
  if (!iso) return "TBA";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}-${month}-${year}`;
};

const sortOrientationsByDate = (a: Orientation, b: Orientation): number => {
  if (!a.eventDate) return 1;
  if (!b.eventDate) return -1;
  return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
};

const App = () => {
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await orientationApi.getAll();
        if (!active) return;
        setOrientations(res.orientations ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load orientations.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const sorted = [...orientations].sort(sortOrientationsByDate);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Society Orientations and Recruitment
        </h1>

        {loading && (
          <p className="text-center text-gray-600">Loading orientations…</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-600">{error}</p>
        )}
        {!loading && !error && sorted.length === 0 && (
          <p className="text-center text-gray-600">No orientations posted yet.</p>
        )}

        {!loading && !error && sorted.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="grid grid-cols-4 bg-gray-50 py-3 px-6 border border-gray-200 text-sm md:text-base font-semibold text-gray-700 rounded-t-lg">
                <div>Society Name</div>
                <div>Event Date</div>
                <div>Time</div>
                <div>Venue</div>
              </div>

              <div className="divide-y divide-gray-200 border border-t-0 border-gray-200 rounded-b-lg">
                {sorted.map((event, index) => (
                  <div
                    key={event._id}
                    className={`grid grid-cols-4 gap-2 py-4 px-6 text-sm md:text-base ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    <div className="text-gray-900">
                      {event.socName ?? "—"}
                      {event.isNew && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-gray-900">{formatDate(event.eventDate)}</div>
                    <div className="text-gray-900">{event.time}</div>
                    <div className="text-gray-900">{event.venue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Accordion View */}
            <div className="md:hidden space-y-3">
              {sorted.map((event, index) => (
                <div
                  key={event._id}
                  className="border border-gray-300 rounded-lg bg-white shadow-sm"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 text-left text-gray-900 font-semibold"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  >
                    <span>
                      {event.socName ?? "—"}
                      {event.isNew && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </span>
                    <span
                      className={`transform transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {openIndex === index && (
                    <div className="p-4 border-t border-gray-300 text-sm space-y-1 text-gray-700">
                      <p>
                        <span className="font-semibold text-gray-800">Date:</span>{" "}
                        {formatDate(event.eventDate)}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">Time:</span>{" "}
                        {event.time}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">Venue:</span>{" "}
                        {event.venue}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
