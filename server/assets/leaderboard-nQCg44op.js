import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-UH9Yg4lm.js";
import { c as createLucideIcon, u as useAuth, s as supabase, T as Trophy, S as Shield, A as AuthForm, N as Navbar } from "./AuthForm-DKctwT-G.js";
import { Z as Zap } from "./zap-DfLS_bfC.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BEMVwotE.js";
const __iconNode = [
  [
    "path",
    {
      d: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",
      key: "143lza"
    }
  ],
  ["path", { d: "M11 12 5.12 2.2", key: "qhuxz6" }],
  ["path", { d: "m13 12 5.88-9.8", key: "hbye0f" }],
  ["path", { d: "M8 7h8", key: "i86dvs" }],
  ["circle", { cx: "12", cy: "17", r: "5", key: "qbz8iq" }],
  ["path", { d: "M12 18v-2h-.5", key: "fawc4q" }]
];
const Medal = createLucideIcon("medal", __iconNode);
function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    loadLeaderboard();
    const channel = supabase.channel("leaderboard").on("postgres_changes", { event: "*", schema: "public", table: "game_scores" }, () => {
      loadLeaderboard();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const loadLeaderboard = async () => {
    const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url, total_score, games_played").gt("games_played", 0).order("total_score", { ascending: false }).limit(50);
    if (!error && data) {
      setEntries(
        data.map((p) => ({
          user_id: p.id,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
          total_score: p.total_score,
          games_played: p.games_played
        }))
      );
    }
    setLoading(false);
  };
  const rankIcon = (i) => {
    if (i === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-neon-yellow" });
    if (i === 1) return /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "h-5 w-5 text-muted-foreground" });
    if (i === 2) return /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "h-5 w-5 text-neon-red" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 items-center justify-center font-display text-xs text-muted-foreground", children: i + 1 });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-12 w-12 animate-pulse text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-wider text-foreground", children: "LEADERBOARD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Top cyber agents ranked by score" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No scores yet. Be the first!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: entries.map((entry, i) => {
      const isMe = entry.user_id === user?.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-4 px-4 py-3 transition-colors ${isMe ? "bg-primary/5" : "hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-8 justify-center", children: rankIcon(i) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-primary", children: entry.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: entry.avatar_url,
                alt: "",
                className: "h-9 w-9 rounded-full object-cover"
              }
            ) : (entry.display_name || "?")[0].toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `truncate text-sm font-medium ${isMe ? "text-primary" : "text-foreground"}`, children: [
                entry.display_name || "Agent",
                isMe && " (You)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                entry.games_played,
                " game",
                entry.games_played !== 1 && "s",
                " played"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-neon-yellow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-foreground", children: entry.total_score })
            ] })
          ]
        },
        entry.user_id
      );
    }) }) })
  ] });
}
function LeaderboardPage() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-12 w-12 animate-pulse text-primary" }) });
  }
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthForm, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-background pt-20 pb-8 cyber-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-5xl px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaderboard, {}) }) })
  ] });
}
export {
  LeaderboardPage as component
};
