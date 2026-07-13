import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, AlertTriangle, Eye, Flag, SkipForward, CheckCircle2, XCircle,
  Shield, Zap, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Scenario {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  is_phishing: boolean;
  difficulty: string;
  explanation: string;
}

type Action = "open" | "ignore" | "report";

interface FeedbackState {
  correct: boolean;
  explanation: string;
  action: Action;
}

const difficultyColors: Record<string, string> = {
  easy: "text-neon-green",
  medium: "text-neon-yellow",
  hard: "text-neon-red",
};

export function GamePlay() {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    const { data, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("created_at");

    if (error) {
      toast.error("Failed to load scenarios");
      return;
    }

    // Shuffle scenarios
    const shuffled = (data || []).sort(() => Math.random() - 0.5).slice(0, 8);
    setScenarios(shuffled);
    setLoading(false);
  };

  const handleAction = useCallback(
    (action: Action) => {
      if (feedback) return;
      const scenario = scenarios[currentIndex];
      if (!scenario) return;

      let correct = false;
      if (scenario.is_phishing) {
        correct = action === "report";
      } else {
        correct = action === "open" || action === "ignore";
      }

      const points = correct
        ? scenario.difficulty === "hard"
          ? 30
          : scenario.difficulty === "medium"
            ? 20
            : 10
        : 0;

      setScore((s) => s + points);
      if (correct) setCorrectCount((c) => c + 1);

      setFeedback({ correct, explanation: scenario.explanation, action });
    },
    [feedback, scenarios, currentIndex],
  );

  const nextScenario = useCallback(async () => {
    setFeedback(null);
    setExpanded(false);

    if (currentIndex + 1 >= scenarios.length) {
      setGameOver(true);
      // Save score
      if (user) {
        const finalScore = score;
        const finalCorrect = correctCount;
        const total = scenarios.length;

        await supabase.from("game_scores").insert({
          user_id: user.id,
          score: finalScore,
          correct_answers: finalCorrect,
          total_questions: total,
        });

        // Update profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_score, games_played")
          .eq("id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              total_score: profile.total_score + finalScore,
              games_played: profile.games_played + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
        }

        // Check badges
        await checkBadges(
          profile ? profile.total_score + finalScore : finalScore,
          profile ? profile.games_played + 1 : 1,
          finalCorrect === total,
        );
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, scenarios.length, user, score, correctCount]);

  const checkBadges = async (
    totalScore: number,
    gamesPlayed: number,
    isPerfect: boolean,
  ) => {
    if (!user) return;
    const { data: allBadges } = await supabase.from("badges").select("*");
    const { data: earned } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id);

    const earnedIds = new Set((earned || []).map((e) => e.badge_id));

    for (const badge of allBadges || []) {
      if (earnedIds.has(badge.id)) continue;

      let qualifies = false;
      if (badge.requirement_type === "score" && totalScore >= badge.requirement_value) qualifies = true;
      if (badge.requirement_type === "games_played" && gamesPlayed >= badge.requirement_value) qualifies = true;
      if (badge.requirement_type === "perfect_game" && isPerfect) qualifies = true;

      if (qualifies) {
        await supabase.from("user_badges").insert({
          user_id: user.id,
          badge_id: badge.id,
        });
        toast.success(`Badge unlocked: ${badge.icon} ${badge.name}`);
      }
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setExpanded(false);
    setGameOver(false);
    loadScenarios();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Shield className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  if (gameOver) {
    const pct = scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg text-center"
      >
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <Zap className="h-10 w-10 text-primary neon-text" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-wider text-foreground">
            MISSION COMPLETE
          </h2>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-surface p-4">
              <p className="font-display text-2xl font-bold text-primary">{score}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="rounded-lg bg-surface p-4">
              <p className="font-display text-2xl font-bold text-neon-green">
                {correctCount}/{scenarios.length}
              </p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="rounded-lg bg-surface p-4">
              <p className="font-display text-2xl font-bold text-neon-yellow">{pct}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>
          <button
            onClick={restartGame}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:shadow-[var(--glow-cyan)]"
          >
            Play Again
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  const scenario = scenarios[currentIndex];
  if (!scenario) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-xs font-bold text-primary">
            {currentIndex + 1} / {scenarios.length}
          </span>
          <span className={`text-xs font-bold uppercase ${difficultyColors[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-1.5">
          <Zap className="h-4 w-4 text-neon-yellow" />
          <span className="font-display text-sm font-bold text-foreground">{score}</span>
        </div>
      </div>

      {/* Email card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="scan-overlay">
            {/* Email header */}
            <div className="border-b border-border p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {scenario.sender}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {scenario.subject}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {scenario.preview}
                  </p>
                </div>
              </div>
            </div>

            {/* Expandable body */}
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-b border-border bg-surface/50 p-4"
              >
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90">
                  {scenario.body}
                </pre>
              </motion.div>
            )}

            {/* Action buttons */}
            {!feedback && (
              <div className="flex gap-2 p-4">
                <button
                  onClick={() => {
                    setExpanded(!expanded);
                    handleAction("open");
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:border-neon-cyan/50 hover:bg-surface-hover"
                >
                  <Eye className="h-4 w-4" />
                  Open
                </button>
                <button
                  onClick={() => handleAction("ignore")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:border-neon-yellow/50 hover:bg-surface-hover"
                >
                  <SkipForward className="h-4 w-4" />
                  Ignore
                </button>
                <button
                  onClick={() => handleAction("report")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neon-red/30 bg-neon-red/10 px-3 py-2.5 text-sm font-medium text-neon-red transition-all hover:bg-neon-red/20"
                >
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 ${feedback.correct ? "bg-neon-green/5" : "bg-neon-red/5"}`}
              >
                <div className="flex items-start gap-3">
                  {feedback.correct ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-neon-red" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-bold ${feedback.correct ? "text-neon-green" : "text-neon-red"}`}
                    >
                      {feedback.correct ? "Correct!" : "Incorrect!"}
                      {feedback.correct && scenario.difficulty === "hard" && " +30 pts"}
                      {feedback.correct && scenario.difficulty === "medium" && " +20 pts"}
                      {feedback.correct && scenario.difficulty === "easy" && " +10 pts"}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feedback.explanation}
                    </p>
                  </div>
                </div>
                <button
                  onClick={nextScenario}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:shadow-[var(--glow-cyan)]"
                >
                  {currentIndex + 1 >= scenarios.length ? "Finish" : "Next Email"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Warning indicator */}
      <div className="flex items-center gap-2 rounded-lg bg-surface/50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-neon-yellow" />
        <p className="text-xs text-muted-foreground">
          Analyze each email carefully. Report phishing attempts, open or ignore
          legitimate emails.
        </p>
      </div>
    </div>
  );
}
