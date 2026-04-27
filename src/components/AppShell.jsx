export default function AppShell({ children, wallpaper = "midnight" }) {
  return (
    <div className={`app-shell wallpaper-${wallpaper}`}>
      <main className="mobile-frame" aria-label="FlowBlocks 今日计划">
        {children}
      </main>
    </div>
  );
}
