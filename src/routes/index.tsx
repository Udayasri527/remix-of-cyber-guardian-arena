import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { GamePlay } from "@/components/GamePlay";
import { Navbar } from "@/components/Navbar";
import { Shield, Gamepad2, Trophy, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CyberGuard — Cybersecurity Awareness Game" },
      { name: "description", content: "Train your phishing detection skills with CyberGuard, the cybersecurity awareness game." },
    ],
  }),
});

function Index() {
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
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-wider text-foreground sm:text-4xl">
              <span className="text-primary neon-text">CYBER</span>GUARD
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Can you spot the phishing emails? Test your skills.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Link
              to="/play"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-[var(--glow-cyan)]"
            >
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-display text-sm font-bold text-foreground">PLAY</p>
                <p className="text-xs text-muted-foreground">Start a new round</p>
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-neon-yellow/50"
            >
              <Trophy className="h-8 w-8 text-neon-yellow" />
              <div>
                <p className="font-display text-sm font-bold text-foreground">LEADERBOARD</p>
                <p className="text-xs text-muted-foreground">See top agents</p>
              </div>
            </Link>
            <Link
              to="/profile"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-neon-purple/50"
            >
              <BookOpen className="h-8 w-8 text-neon-purple" />
              <div>
                <p className="font-display text-sm font-bold text-foreground">PROFILE</p>
                <p className="text-xs text-muted-foreground">Badges & settings</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
