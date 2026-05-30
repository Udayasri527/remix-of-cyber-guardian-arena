import { U as jsxRuntimeExports } from "./worker-entry-UH9Yg4lm.js";
import { c as createLucideIcon, u as useAuth, S as Shield, A as AuthForm, N as Navbar, G as Gamepad2, T as Trophy } from "./AuthForm-DKctwT-G.js";
import { L as Link } from "./router-BEMVwotE.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode);
function Index() {
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-background pt-20 pb-8 cyber-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold tracking-wider text-foreground sm:text-4xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary neon-text", children: "CYBER" }),
          "GUARD"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Can you spot the phishing emails? Test your skills." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/play", className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-[var(--glow-cyan)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "h-8 w-8 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold text-foreground", children: "PLAY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Start a new round" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/leaderboard", className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-neon-yellow/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-8 w-8 text-neon-yellow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold text-foreground", children: "LEADERBOARD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "See top agents" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/profile", className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-neon-purple/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-8 w-8 text-neon-purple" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold text-foreground", children: "PROFILE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Badges & settings" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Index as component
};
