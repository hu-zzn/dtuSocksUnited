"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Save } from "lucide-react";
import { orientationApi } from "../lib/apis";
import type { Orientation } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

type Draft = {
  name: string;
  eventDate: string;
  venue: string;
  time: string;
  isNew: boolean;
};

const emptyDraft = (): Draft => ({
  name: "",
  eventDate: "",
  venue: "",
  time: "",
  isNew: false,
});

const draftFromOrientation = (o: Orientation): Draft => ({
  name: o.name ?? "",
  eventDate: o.eventDate ?? "",
  venue: o.venue ?? "",
  time: o.time ?? "",
  isNew: o.isNew ?? false,
});

const validateDraft = (d: Draft): string | null => {
  if (!d.eventDate) return "Event date is required.";
  if (!d.venue.trim()) return "Venue is required.";
  if (!d.time.trim()) return "Time is required.";
  return null;
};

export default function OrientationsManager({ socId }: { socId: string }) {
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newDraft, setNewDraft] = useState<Draft | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orientationApi.managed();
      const mine = (res.orientations ?? []).filter((o) => o.socId === socId);
      setOrientations(mine);
      setDrafts(
        Object.fromEntries(mine.map((o) => [o._id, draftFromOrientation(o)]))
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load orientations.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socId]);

  const handleFieldChange = (
    id: string,
    field: keyof Draft,
    value: Draft[keyof Draft]
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const err = validateDraft(draft);
    if (err) {
      toast.error(err);
      return;
    }
    setSavingId(id);
    try {
      const res = await orientationApi.update(id, draft);
      toast.success(res.message || "Orientation updated.");
      setOrientations((prev) =>
        prev.map((o) => (o._id === id ? res.orientation : o))
      );
      setDrafts((prev) => ({
        ...prev,
        [id]: draftFromOrientation(res.orientation),
      }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this orientation? This can't be undone.")) return;
    setDeletingId(id);
    try {
      const res = await orientationApi.delete(id);
      toast.success(res.message || "Orientation deleted.");
      setOrientations((prev) => prev.filter((o) => o._id !== id));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async () => {
    if (!newDraft) return;
    const err = validateDraft(newDraft);
    if (err) {
      toast.error(err);
      return;
    }
    setCreating(true);
    try {
      const res = await orientationApi.create({ socId, ...newDraft });
      toast.success(res.message || "Orientation added.");
      setOrientations((prev) => [...prev, res.orientation]);
      setDrafts((prev) => ({
        ...prev,
        [res.orientation._id]: draftFromOrientation(res.orientation),
      }));
      setNewDraft(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Orientations</CardTitle>
            <CardDescription>
              Public orientation/recruitment events. Shown on the calendar page.
            </CardDescription>
          </div>
          {!newDraft && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setNewDraft(emptyDraft())}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading orientations…</p>
        )}

        {!loading && orientations.length === 0 && !newDraft && (
          <p className="text-sm text-muted-foreground">
            No orientations yet. Click <span className="font-medium">Add</span> to
            create one.
          </p>
        )}

        {!loading &&
          orientations.map((o) => {
            const d = drafts[o._id] ?? draftFromOrientation(o);
            return (
              <div
                key={o._id}
                className="border border-border rounded-xl p-4 space-y-3"
              >
                <div>
                  <Label htmlFor={`name-${o._id}`}>Name (optional)</Label>
                  <Input
                    id={`name-${o._id}`}
                    value={d.name}
                    onChange={(e) =>
                      handleFieldChange(o._id, "name", e.target.value)
                    }
                    placeholder="e.g. Auditions Round 1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`date-${o._id}`}>Date</Label>
                    <Input
                      id={`date-${o._id}`}
                      type="date"
                      value={d.eventDate}
                      onChange={(e) =>
                        handleFieldChange(o._id, "eventDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`venue-${o._id}`}>Venue</Label>
                    <Input
                      id={`venue-${o._id}`}
                      value={d.venue}
                      onChange={(e) =>
                        handleFieldChange(o._id, "venue", e.target.value)
                      }
                      placeholder="e.g. BR Auditorium"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`time-${o._id}`}>Time</Label>
                    <Input
                      id={`time-${o._id}`}
                      value={d.time}
                      onChange={(e) =>
                        handleFieldChange(o._id, "time", e.target.value)
                      }
                      placeholder="e.g. 4:00 pm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={d.isNew}
                      onChange={(e) =>
                        handleFieldChange(o._id, "isNew", e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    Highlight as <span className="font-semibold">NEW</span>
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSave(o._id)}
                      disabled={savingId === o._id}
                    >
                      {savingId === o._id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" /> Save
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(o._id)}
                      disabled={deletingId === o._id}
                      aria-label="Delete orientation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

        {newDraft && (
          <div className="border border-dashed border-primary/40 rounded-xl p-4 space-y-3 bg-muted/20">
            <div>
              <Label htmlFor="new-name">Name (optional)</Label>
              <Input
                id="new-name"
                value={newDraft.name}
                onChange={(e) =>
                  setNewDraft({ ...newDraft, name: e.target.value })
                }
                placeholder="e.g. Auditions Round 1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="new-date">Date</Label>
                <Input
                  id="new-date"
                  type="date"
                  value={newDraft.eventDate}
                  onChange={(e) =>
                    setNewDraft({ ...newDraft, eventDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="new-venue">Venue</Label>
                <Input
                  id="new-venue"
                  value={newDraft.venue}
                  onChange={(e) =>
                    setNewDraft({ ...newDraft, venue: e.target.value })
                  }
                  placeholder="e.g. BR Auditorium"
                />
              </div>
              <div>
                <Label htmlFor="new-time">Time</Label>
                <Input
                  id="new-time"
                  value={newDraft.time}
                  onChange={(e) =>
                    setNewDraft({ ...newDraft, time: e.target.value })
                  }
                  placeholder="e.g. 4:00 pm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newDraft.isNew}
                  onChange={(e) =>
                    setNewDraft({ ...newDraft, isNew: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Highlight as <span className="font-semibold">NEW</span>
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewDraft(null)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreate}
                  disabled={creating}
                >
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
