import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/ProfileScreen";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — CyberGuard" },
      { name: "description", content: "Your CyberGuard agent profile, badges, and settings." },
    ],
  }),
});

function ProfilePage() {
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
          <ProfileScreen />
        </div>
      </main>
    </>
  );
}
