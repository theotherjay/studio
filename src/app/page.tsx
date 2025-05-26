import GameCanvas from '@/components/game/game-canvas';

export default function WanderingWoodsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--background))] p-4 selection:bg-primary/30">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary drop-shadow-md">
          Wandering Woods
        </h1>
        <p className="text-muted-foreground mt-2">Use WASD or Arrow keys to move. Explore the forest!</p>
      </header>
      <GameCanvas />
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Wandering Woods. A 2D Adventure Game.</p>
      </footer>
    </main>
  );
}
