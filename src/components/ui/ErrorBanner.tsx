import { Button } from "@/components/ui/Button";

export interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({ message, onRetry, className }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={[
        "flex flex-col items-center gap-3 rounded-xl bg-danger/10 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-start",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-sm font-medium text-danger">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
