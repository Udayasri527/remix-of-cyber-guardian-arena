import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { User, Shield, Zap, Gamepad2, Award, Save } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  total_score: number;
  games_played: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const [profileRes, badgesRes, allBadgesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("user_badges")
        .select("badge_id, badges(id, name, description, icon)")
        .eq("user_id", user.id),
      supabase.from("badges").select("*"),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setDisplayName(profileRes.data.display_name || "");
      setUsername(profileRes.data.username || "");
    }

    if (badgesRes.data) {
      const earned = badgesRes.data
        .filter((b): b is typeof b & { badges: Badge } => b.badges !== null)
        .map((b) => b.badges);
      setBadges(earned);
    }

    if (allBadgesRes.data) {
      setAllBadges(allBadgesRes.data);
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username: username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <User className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  const earnedIds = new Set(badges.map((b) => b.id));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Profile card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold tracking-wider text-foreground">
              {profile?.display_name || "Agent"}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-surface p-4 text-center">
            <Zap className="mx-auto h-5 w-5 text-neon-yellow" />
            <p className="mt-1 font-display text-xl font-bold text-foreground">
              {profile?.total_score || 0}
            </p>
            <p className="text-xs text-muted-foreground">Total Score</p>
          </div>
          <div className="rounded-lg bg-surface p-4 text-center">
            <Gamepad2 className="mx-auto h-5 w-5 text-neon-cyan" />
            <p className="mt-1 font-display text-xl font-bold text-foreground">
              {profile?.games_played || 0}
            </p>
            <p className="text-xs text-muted-foreground">Games</p>
          </div>
          <div className="rounded-lg bg-surface p-4 text-center">
            <Award className="mx-auto h-5 w-5 text-neon-purple" />
            <p className="mt-1 font-display text-xl font-bold text-foreground">
              {badges.length}
            </p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold tracking-wider text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          BADGES
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allBadges.map((badge) => {
            const earned = earnedIds.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-lg border p-3 text-center transition-all ${
                  earned
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-surface opacity-40"
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <p className="mt-1 text-xs font-bold text-foreground">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold tracking-wider text-foreground">
          <User className="h-4 w-4 text-primary" />
          SETTINGS
        </h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:shadow-[var(--glow-cyan)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
