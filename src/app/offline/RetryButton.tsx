"use client";

export function RetryButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.location.reload()}>
      重新连接
    </button>
  );
}
