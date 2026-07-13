import { createFileRoute } from "@tanstack/react-router";
import { GamePlay } from "@/components/GamePlay";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/play")({
  component: PlayPage,
  head: () => ({
    meta: [
      { title: "Play — CyberGuard" },
      { name: "description", content: "Test your phishing detection skills in CyberGuard." },
    ],
  }),
});

function PlayPage() {
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
          <GamePlay />
        </div>
      </main>
    </>
  );
}
