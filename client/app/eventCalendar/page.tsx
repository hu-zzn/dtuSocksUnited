"use client";

import React, { useState } from 'react';

// Define the TypeScript type for an Event object.
type Event = {
  societyName: string;
  eventDate: string;
  venue: string;
  time: string;
  isNew: boolean;
};

// This is the main component for your Event Calendar page.
// It displays a grid-like table with 4 columns: Society Name, Event Date, Time, and Venue.
const App = () => {
  // Initial state for the events data, with an 'isNew' property added to highlight new events.
  const initialEvents: Event[] = [
    { societyName: "AUV", eventDate: "03-08-2025", venue: "ONLINE MODE", time: "7:30 pm", isNew: true },
    { societyName: "EHAX", eventDate: "11-08-2025", venue: "SPS-11", time: "4:00 pm", isNew: true },
    { societyName: "AIMS-DTU", eventDate: "18-08-2025", venue: "BR Audi", time: "2:00 pm", isNew: true },
  ];

  // State for the list of events, now explicitly typed as an array of Event objects.
  const [events, setEvents] = useState<Event[]>(initialEvents);

  // Function to sort events by date, with explicit types for the parameters.
  const sortEventsByDate = (a: Event, b: Event): number => {
    if (a.eventDate === 'TBA') return 1;
    if (b.eventDate === 'TBA') return -1;
    const [dayA, monthA, yearA] = a.eventDate.split('-').map(Number);
    const [dayB, monthB, yearB] = b.eventDate.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime(); // Using getTime() for robust comparison
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Society Orientations
        </h1>

        {/* Table/Grid Container */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="shadow overflow-hidden border border-gray-200 rounded-lg">
              {/* Grid Header */}
              <div className="grid grid-cols-4 gap-1 bg-gray-50 py-3 px-6 border-b border-gray-200 text-sm md:text-base">
                <div className="font-semibold text-gray-700">Society Name</div>
                <div className="font-semibold text-gray-700">Event Date</div>
                <div className="font-semibold text-gray-700">Time</div>
                <div className="font-semibold text-gray-700">Venue</div>
              </div>

              {/* Grid Body */}
              <div className="divide-y divide-gray-200">
                {events.sort(sortEventsByDate).map((event, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 gap-1 py-4 px-6 text-sm md:text-base ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
