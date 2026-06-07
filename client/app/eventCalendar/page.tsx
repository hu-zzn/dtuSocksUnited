"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { orientationApi, societyApi } from "../../lib/apis";
import { useAuth } from "../../context/auth-context";
import type { Orientation, Society } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

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

type AddDraft = {
  socId: string;
  name: string;
  eventDate: string;
  venue: string;
  time: string;
  isNew: boolean;
};

const emptyAddDraft = (): AddDraft => ({
  socId: "",
  name: "",
  eventDate: "",
  venue: "",
  time: "",
  isNew: false,
});

const App = () => {
  const { user } = useAuth();
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [managedSocs, setManagedSocs] = useState<Society[]>([]);
  const [socsLoading, setSocsLoading] = useState(false);
  const [draft, setDraft] = useState<AddDraft>(emptyAddDraft());
  const [creating, setCreating] = useState(false);

  const loadOrientations = async () => {
    try {
      const res = await orientationApi.getAll();
      setOrientations(res.orientations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orientations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await orientationApi.getAll();
        if (!active) return;
        setOrientations(res.orientations ?? []);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load orientations."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const sorted = useMemo(
    () => [...orientations].sort(sortOrientationsByDate),
    [orientations]
  );

  const canAddOrientation = Boolean(
    user && (user.isSocAdmin || user.role === "Admin")
  );

  const openAddDialog = async () => {
    setDraft(emptyAddDraft());
    setDialogOpen(true);
    setSocsLoading(true);
    try {
      const res = await societyApi.managed();
      const socs = res.socs ?? [];
      setManagedSocs(socs);
      if (socs.length === 1) {
        setDraft((d) => ({ ...d, socId: socs[0]._id }));
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load your societies."
      );
    } finally {
      setSocsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!draft.socId) return toast.error("Pick a society.");
    if (!draft.eventDate) return toast.error("Event date is required.");
    if (!draft.venue.trim()) return toast.error("Venue is required.");
    if (!draft.time.trim()) return toast.error("Time is required.");

    setCreating(true);
    try {
      const res = await orientationApi.create({
        socId: draft.socId,
        name: draft.name.trim() || undefined,
        eventDate: draft.eventDate,
        venue: draft.venue.trim(),
        time: draft.time.trim(),
        isNew: draft.isNew,
      });
      toast.success(res.message || "Orientation added.");
      setDialogOpen(false);
      setDraft(emptyAddDraft());
      await loadOrientations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Society Orientations and Recruitment
          </h1>
          {canAddOrientation && (
            <Button onClick={openAddDialog} className="self-start sm:self-auto">
              <Plus className="w-4 h-4 mr-1" /> Add orientation
            </Button>
          )}
        </div>

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
                <div>Society / Event</div>
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
                      <div className="font-semibold">
                        {event.socName ?? "—"}
                        {event.isNew && (
                          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      {event.name && (
                        <div className="text-sm text-gray-700 mt-1 italic">
                          {event.name}
                        </div>
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
                    <span className="flex flex-col items-start">
                      <span>
                        {event.socName ?? "—"}
                        {event.isNew && (
                          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            NEW
                          </span>
                        )}
                      </span>
                      {event.name && (
                        <span className="text-sm font-normal text-gray-700 italic mt-1">
                          {event.name}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an orientation</DialogTitle>
            <DialogDescription>
              Posted to the public orientation calendar.
            </DialogDescription>
          </DialogHeader>

          {socsLoading ? (
            <p className="text-sm text-muted-foreground">Loading your societies…</p>
          ) : managedSocs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You aren&apos;t a soc admin of any society yet. Ask the platform
              admin to grant you access.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-soc">Society</Label>
                <select
                  id="add-soc"
                  value={draft.socId}
                  onChange={(e) =>
                    setDraft({ ...draft, socId: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a society…</option>
                  {managedSocs.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.socName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="add-name">Name (optional)</Label>
                <Input
                  id="add-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Auditions Round 1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="add-date">Date</Label>
                  <Input
                    id="add-date"
                    type="date"
                    value={draft.eventDate}
                    onChange={(e) =>
                      setDraft({ ...draft, eventDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-venue">Venue</Label>
                  <Input
                    id="add-venue"
                    value={draft.venue}
                    onChange={(e) =>
                      setDraft({ ...draft, venue: e.target.value })
                    }
                    placeholder="e.g. BR Auditorium"
                  />
                </div>
                <div>
                  <Label htmlFor="add-time">Time</Label>
                  <Input
                    id="add-time"
                    value={draft.time}
                    onChange={(e) =>
                      setDraft({ ...draft, time: e.target.value })
                    }
                    placeholder="e.g. 4:00 pm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isNew}
                  onChange={(e) =>
                    setDraft({ ...draft, isNew: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Highlight as <span className="font-semibold">NEW</span>
              </label>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || socsLoading || managedSocs.length === 0}
            >
              {creating ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
