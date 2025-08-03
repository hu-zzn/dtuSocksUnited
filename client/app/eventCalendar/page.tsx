"use client";

import React, { useState } from "react";

// Define the TypeScript type for an Event object.
type Event = {
  societyName: string;
  eventDate: string;
  venue: string;
  time: string;
  isNew: boolean;
};

const App = () => {
  const initialEvents: Event[] = [
    { societyName: "AUV", eventDate: "03-08-2025", venue: "Online Mode", time: "7:30 pm", isNew: true },
    { societyName: "EHAX", eventDate: "11-08-2025", venue: "SPS-11", time: "4:00 pm", isNew: true },
    { societyName: "AIMS-DTU", eventDate: "18-08-2025", venue: "BR Audi", time: "2:00 pm", isNew: true },
    { societyName: "IPI-DTU", eventDate: "13-08-2025", venue: "SPS-13", time: "2:00 pm", isNew: true },
  ];

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sortEventsByDate = (a: Event, b: Event): number => {
    if (a.eventDate === "TBA") return 1;
    if (b.eventDate === "TBA") return -1;
    const [dayA, monthA, yearA] = a.eventDate.split("-").map(Number);
    const [dayB, monthB, yearB] = b.eventDate.split("-").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Society Orientations and Recruitment
        </h1>

        {/* ✅ Desktop Table View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 bg-gray-50 py-3 px-6 border border-gray-200 text-sm md:text-base font-semibold text-gray-700 rounded-t-lg">
            <div>Society Name</div>
            <div>Event Date</div>
            <div>Time</div>
            <div>Venue</div>
          </div>

          <div className="divide-y divide-gray-200 border border-t-0 border-gray-200 rounded-b-lg">
            {events.sort(sortEventsByDate).map((event, index) => (
              <div
                key={index}
                className={`grid grid-cols-4 gap-2 py-4 px-6 text-sm md:text-base ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <div className="text-gray-900">
                  {event.societyName}
                  {event.isNew && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <div className="text-gray-900">{event.eventDate}</div>
                <div className="text-gray-900">{event.time}</div>
                <div className="text-gray-900">{event.venue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Mobile Accordion View */}
        <div className="md:hidden space-y-3">
          {events.sort(sortEventsByDate).map((event, index) => (
            <div key={index} className="border border-gray-300 rounded-lg bg-white shadow-sm">
              {/* Accordion Header */}
              <button
                className="w-full flex justify-between items-center p-4 text-left text-gray-900 font-semibold"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>
                  {event.societyName}
                  {event.isNew && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                </span>
                <span className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {/* Accordion Content (Updated Transparency) */}
              {openIndex === index && (
                <div className="p-4 border-t border-gray-300 text-sm space-y-1 text-gray-700">
                  <p>
                    <span className="font-semibold text-gray-800">Date:</span> {event.eventDate}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Time:</span> {event.time}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Venue:</span> {event.venue}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
