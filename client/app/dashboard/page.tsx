// app/dashboard/page.tsx or wherever your route is
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/register"); // or "/login" if more appropriate
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-2xl font-semibold">
        Welcome, {session.user?.name || "User"}!
      </h1>
      <p className="mt-2 text-muted-foreground">
        You are logged in with {session.user?.email}.
      </p>
    </div>
  );
}
