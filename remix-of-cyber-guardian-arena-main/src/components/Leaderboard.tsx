import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Medal, Zap } from "lucide-react";

interface LeaderEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_score: number;
  games_played: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();

    const channel = supabase
      .channel("leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "game_scores" }, () => {
        loadLeaderboard();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadLeaderboard = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, total_score, games_played")
      .gt("games_played", 0)
      .order("total_score", { ascending: false })
      .limit(50);

    if (!error && data) {
      setEntries(
        data.map((p) => ({
          user_id: p.id,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
          total_score: p.total_score,
          games_played: p.games_played,
        })),
      );
    }
    setLoading(false);
  };

  const rankIcon = (i: number) => {
    if (i === 0) return <Trophy className="h-5 w-5 text-neon-yellow" />;
    if (i === 1) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (i === 2) return <Medal className="h-5 w-5 text-neon-red" />;
    return <span className="flex h-5 w-5 items-center justify-center font-display text-xs text-muted-foreground">{i + 1}</span>;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Trophy className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
          LEADERBOARD
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Top cyber agents ranked by score</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No scores yet. Be the first!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry, i) => {
              const isMe = entry.user_id === user?.id;
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                    isMe ? "bg-primary/5" : "hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex w-8 justify-center">{rankIcon(i)}</div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-primary">
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      (entry.display_name || "?")[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${isMe ? "text-primary" : "text-foreground"}`}>
                      {entry.display_name || "Agent"}
                      {isMe && " (You)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.games_played} game{entry.games_played !== 1 && "s"} played
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-neon-yellow" />
                    <span className="font-display text-sm font-bold text-foreground">
                      {entry.total_score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
