export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-lg border border-border-default bg-surface-primary p-8 shadow-elevation-1">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Meeting Cost Clock
        </h1>
        <p className="text-sm text-text-secondary">
          Calculate your meeting&apos;s real cost in real-time.
        </p>
      </div>
    </main>
  );
}