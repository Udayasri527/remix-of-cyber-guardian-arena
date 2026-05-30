import { createFileRoute } from "@tanstack/react-router";
import { Leaderboard } from "@/components/Leaderboard";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "Leaderboard — CyberGuard" },
      { name: "description", content: "Top CyberGuard agents ranked by score." },
    ],
  }),
});

function LeaderboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Shield className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  if (!user) return <AuthForm />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-8 cyber-grid">
        <div className="mx-auto max-w-5xl px-4">
          <Leaderboard />
        </div>
      </main>
    </>
  );
}
