"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, UserCog, Save } from "lucide-react";
import { societyApi } from "../../../lib/apis";
import { useAuth } from "../../../context/auth-context";
import type { Society, SocKeyEvent } from "../../../types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";

type TeamMember = { role: string; name: string };

export default function ManageSocietyEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, loading: authLoading } = useAuth();

  const [society, setSociety] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const [socAbout, setSocAbout] = useState("");
  const [socHighlights, setSocHighlights] = useState<string[]>([]);
  const [socKeyEvents, setSocKeyEvents] = useState<SocKeyEvent[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [linktree, setLinktree] = useState("");

  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || !id) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await societyApi.getForEdit(id);
        if (!active) return;

        const found = res.soc;
        setSociety(found);
        setSocAbout(found.socAbout ?? "");
        setSocHighlights(found.socHighlights ?? []);
        setSocKeyEvents(found.socKeyEvents ?? []);
        setTeam(found.socContact?.team ?? []);
        setInstagram(found.socContact?.socSocials?.instagram ?? "");
        setLinkedin(found.socContact?.socSocials?.linkedin ?? "");
        setLinktree(found.socContact?.socSocials?.linktree ?? "");
      } catch (err) {
        if (!active) return;
        const msg =
          err instanceof Error
            ? err.message
            : "You don't have permission to edit this society.";
        toast.error(msg);
        router.replace("/manage-society");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, id, router]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await societyApi.edit(id, {
        socAbout,
        socHighlights: socHighlights.filter((h) => h.trim().length > 0),
        socKeyEvents: socKeyEvents.filter(
          (e) => e.name.trim() || e.description.trim()
        ),
        socContact: {
          team: team.filter((m) => m.name.trim() || m.role.trim()),
          email: society?.socContact?.email ?? "",
          socSocials: {
            instagram: instagram.trim() || "_",
            linkedin: linkedin.trim() || "_",
            linktree: linktree.trim() || "_",
          },
        },
      });
      toast.success(res.message || "Society updated.");
      setSociety(res.soc);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleTransfer = async () => {
    if (!id) return;
    const email = newAdminEmail.trim();
    if (!email) {
      toast.error("Enter the new admin's email.");
      return;
    }
    if (
      !confirm(
        `Transfer soc admin to ${email}? You will lose admin access to this society.`
      )
    ) {
      return;
    }
    setTransferring(true);
    try {
      const res = await societyApi.transferAdmin(id, { newAdminEmail: email });
      toast.success(res.message || "Soc admin transferred.");
      router.replace("/manage-society");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to transfer.";
      toast.error(msg);
    } finally {
      setTransferring(false);
    }
  };

  if (authLoading || loading || !society) {
    return (
      <section className="bg-background text-foreground min-h-screen py-16">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background text-foreground min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-4">
            <Link href="/manage-society">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold text-primary">
            {society.socName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Edit the fields below and save your changes.
          </p>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>A short description of the society.</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={socAbout}
              onChange={(e) => setSocAbout(e.target.value)}
              rows={6}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell people about your society…"
            />
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Bullet points shown on the society card.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSocHighlights((prev) => [...prev, ""])}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {socHighlights.length === 0 && (
              <p className="text-sm text-muted-foreground">No highlights yet.</p>
            )}
            {socHighlights.map((h, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={h}
                  onChange={(e) => {
                    const next = [...socHighlights];
                    next[idx] = e.target.value;
                    setSocHighlights(next);
                  }}
                  placeholder={`Highlight ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSocHighlights((prev) => prev.filter((_, i) => i !== idx))
                  }
                  aria-label="Remove highlight"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Key Events</CardTitle>
                <CardDescription>Flagship events your society runs.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSocKeyEvents((prev) => [
                    ...prev,
                    { name: "", description: "" },
                  ])
                }
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {socKeyEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">No events yet.</p>
            )}
            {socKeyEvents.map((event, idx) => (
              <div
                key={idx}
                className="border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`event-name-${idx}`}>Name</Label>
                      <Input
                        id={`event-name-${idx}`}
                        value={event.name}
                        onChange={(e) => {
                          const next = [...socKeyEvents];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setSocKeyEvents(next);
                        }}
                        placeholder="Event name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`event-desc-${idx}`}>Description</Label>
                      <textarea
                        id={`event-desc-${idx}`}
                        value={event.description}
                        onChange={(e) => {
                          const next = [...socKeyEvents];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setSocKeyEvents(next);
                        }}
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Describe the event"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSocKeyEvents((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                    aria-label="Remove event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription>Council members and their roles.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setTeam((prev) => [...prev, { name: "", role: "" }])
                }
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {team.length === 0 && (
              <p className="text-sm text-muted-foreground">No team members yet.</p>
            )}
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={member.name}
                  onChange={(e) => {
                    const next = [...team];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setTeam(next);
                  }}
                  placeholder="Name"
                />
                <Input
                  value={member.role}
                  onChange={(e) => {
                    const next = [...team];
                    next[idx] = { ...next[idx], role: e.target.value };
                    setTeam(next);
                  }}
                  placeholder="Role (e.g. President)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTeam((prev) => prev.filter((_, i) => i !== idx))}
                  aria-label="Remove team member"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Socials</CardTitle>
            <CardDescription>
              Public links for the society. Leave blank to hide a link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={instagram === "_" ? "" : instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/…"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedin === "_" ? "" : linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/…"
              />
            </div>
            <div>
              <Label htmlFor="linktree">Linktree</Label>
              <Input
                id="linktree"
                value={linktree === "_" ? "" : linktree}
                onChange={(e) => setLinktree(e.target.value)}
                placeholder="https://linktr.ee/…"
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full shadow-lg"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save changes
              </>
            )}
          </Button>
        </div>

        <Card className="border border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Transfer soc admin
            </CardTitle>
            <CardDescription>
              The new admin must already have an account. Once transferred, you
              will lose admin access to this society.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="new-admin-email">New admin email</Label>
              <Input
                id="new-admin-email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <Button
              variant="destructive"
              onClick={handleTransfer}
              disabled={transferring || !newAdminEmail.trim()}
              className="rounded-full"
            >
              {transferring ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Transfer admin"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
