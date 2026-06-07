"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { societyApi } from "../../lib/apis";
import { useAuth } from "../../context/auth-context";
import type { Society } from "../../types";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Pencil } from "lucide-react";

export default function ManageSocietyListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [managed, setManaged] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await societyApi.managed();
        if (active) setManaged(res.socs ?? []);
      } catch {
        if (active) setManaged([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (authLoading || !user) {
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
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-primary">
            Manage Societies
          </h1>
          <p className="text-muted-foreground mt-2">
            Societies where you are the soc admin.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading societies…</p>
        ) : managed.length === 0 ? (
          <div className="border border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">
              You aren&apos;t the soc admin of any society yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managed.map((soc) => (
              <Card
                key={soc._id}
                className="border border-border bg-muted/20 rounded-2xl"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {soc.socLogo && soc.socLogo !== "_" && (
                      <img
                        src={soc.socLogo}
                        alt={`${soc.socName} logo`}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{soc.socName}</CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {soc.socCategory.slice(0, 3).map((c) => (
                          <Badge
                            key={c}
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {soc.socAbout}
                  </p>
                  <Button asChild className="w-full rounded-full">
                    <Link href={`/manage-society/${soc._id}`}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
