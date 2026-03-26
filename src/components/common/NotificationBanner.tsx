import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationBannerProps {
  type?: NotificationType;
  message: string;
  /** Auto-dismiss duration in ms. Set to 0 to disable auto-dismiss. Default: 4000 */
  duration?: number;
  onDismiss?: () => void;
  /** Show a thin progress bar counting down the duration */
  showProgress?: boolean;
}

const VARIANTS: Record<
  NotificationType,
  { bg: string; color: string; border: string; Icon: React.ElementType }
> = {
  success: {
    bg: "rgba(0, 107, 10, 0.08)",
    color: "var(--primary)",
    border: "var(--primary)",
    Icon: CheckCircle,
  },
  info: {
    bg: "rgba(0, 102, 109, 0.08)",
    color: "var(--tertiary)",
    border: "var(--tertiary)",
    Icon: Info,
  },
  warning: {
    bg: "rgba(234, 179, 8, 0.10)",
    color: "#b45309",
    border: "#d97706",
    Icon: AlertTriangle,
  },
  error: {
    bg: "rgba(186, 26, 26, 0.08)",
    color: "var(--secondary)",
    border: "var(--secondary)",
    Icon: XCircle,
  },
};

export default function NotificationBanner({
  type = "info",
  message,
  duration = 4000,
  onDismiss,
  showProgress = true,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const dismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  /* Auto-dismiss + progress countdown */
  useEffect(() => {
    if (!duration || duration <= 0) return;

    const startTime = Date.now();
    const tick = 30; // ms per frame

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setProgress(remaining * 100);
      if (remaining === 0) {
        clearInterval(interval);
        dismiss();
      }
    }, tick);

    return () => clearInterval(interval);
  }, [duration, dismiss]);

  if (!visible) return null;

  const { bg, color, border, Icon } = VARIANTS[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md)",
        borderLeft: `4px solid ${border}`,
        animation: "notifSlideIn 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
        maxWidth: 420,
        width: "100%",
      }}
    >
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes notifSlideIn { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>

      {/* Content row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 14px 14px 16px",
          background: bg,
        }}
      >
        {/* Icon */}
        <span
          style={{
            color,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <Icon size={18} strokeWidth={2} />
        </span>

        {/* Message */}
        <span
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--on-surface)",
            lineHeight: 1.5,
          }}
        >
          {message}
        </span>

        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Dismiss notification"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            padding: 2,
            borderRadius: "var(--radius-md)",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "var(--on-surface)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-muted)")
          }
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Progress bar */}
      {showProgress && duration > 0 && (
        <div
          style={{
            height: 3,
            background: "rgba(168,175,169,0.20)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: border,
              transition: "width 30ms linear",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   NotificationStack — renders multiple banners stacked
───────────────────────────────────────────────────── */
export interface NotificationItem {
  id: string;
  type?: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationStackProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}

const POSITION_STYLES: Record<
  NonNullable<NotificationStackProps["position"]>,
  React.CSSProperties
> = {
  "top-right":     { top: 80, right: 16 },
  "top-center":    { top: 80, left: "50%", transform: "translateX(-50%)" },
  "bottom-right":  { bottom: 80, right: 16 },
  "bottom-center": { bottom: 80, left: "50%", transform: "translateX(-50%)" },
};

export function NotificationStack({
  notifications,
  onDismiss,
  position = "top-right",
}: NotificationStackProps) {
  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "calc(100% - 32px)",
        maxWidth: 420,
        ...POSITION_STYLES[position],
      }}
    >
      {notifications.map((n) => (
        <NotificationBanner
          key={n.id}
          type={n.type}
          message={n.message}
          duration={n.duration}
          onDismiss={() => onDismiss(n.id)}
        />
      ))}
    </div>
  );
}
