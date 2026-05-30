import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-UH9Yg4lm.js";
import { c as createLucideIcon, u as useAuth, s as supabase, U as User, G as Gamepad2, S as Shield, A as AuthForm, N as Navbar } from "./AuthForm-DKctwT-G.js";
import { t as toast } from "./router-BEMVwotE.js";
import { Z as Zap } from "./zap-DfLS_bfC.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [badges, setBadges] = reactExports.useState([]);
  const [allBadges, setAllBadges] = reactExports.useState([]);
  const [displayName, setDisplayName] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (user) loadProfile();
  }, [user]);
  const loadProfile = async () => {
    if (!user) return;
    const [profileRes, badgesRes, allBadgesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("user_badges").select("badge_id, badges(id, name, description, icon)").eq("user_id", user.id),
      supabase.from("badges").select("*")
    ]);
    if (profileRes.data) {
      setProfile(profileRes.data);
      setDisplayName(profileRes.data.display_name || "");
      setUsername(profileRes.data.username || "");
    }
    if (badgesRes.data) {
      const earned = badgesRes.data.filter((b) => b.badges !== null).map((b) => b.badges);
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
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      username,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", user.id);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-12 w-12 animate-pulse text-primary" }) });
  }
  const earnedIds = new Set(badges.map((b) => b.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10", children: profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: profile.avatar_url,
            alt: "",
            className: "h-16 w-16 rounded-xl object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold tracking-wider text-foreground", children: profile?.display_name || "Agent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user?.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-surface p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mx-auto h-5 w-5 text-neon-yellow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-display text-xl font-bold text-foreground", children: profile?.total_score || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Score" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-surface p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "mx-auto h-5 w-5 text-neon-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-display text-xl font-bold text-foreground", children: profile?.games_played || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Games" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-surface p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "mx-auto h-5 w-5 text-neon-purple" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-display text-xl font-bold text-foreground", children: badges.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Badges" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 font-display text-sm font-bold tracking-wider text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-primary" }),
        "BADGES"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3", children: allBadges.map((badge) => {
        const earned = earnedIds.has(badge.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-lg border p-3 text-center transition-all ${earned ? "border-primary/30 bg-primary/5" : "border-border bg-surface opacity-40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: badge.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs font-bold text-foreground", children: badge.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: badge.description })
            ]
          },
          badge.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 font-display text-sm font-bold tracking-wider text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-primary" }),
        "SETTINGS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Display Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: displayName,
              onChange: (e) => setDisplayName(e.target.value),
              className: "mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: username,
              onChange: (e) => setUsername(e.target.value),
              className: "mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: saveProfile,
            disabled: saving,
            className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:shadow-[var(--glow-cyan)] disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
              saving ? "Saving..." : "Save Changes"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function ProfilePage() {
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-background pt-20 pb-8 cyber-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-5xl px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileScreen, {}) }) })
  ] });
}
export {
  ProfilePage as component
};
