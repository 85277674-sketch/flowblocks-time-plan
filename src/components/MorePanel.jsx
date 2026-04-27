import { Heart, Image, Sparkles } from "lucide-react";

export default function MorePanel({ onSelectWallpaper, selectedWallpaper, wallpaperOptions }) {
  return (
    <section className="tool-screen section-enter" aria-labelledby="more-title">
      <div className="warm-card">
        <Heart size={24} />
        <h1 id="more-title">你可以的，宝贝！</h1>
        <p>慢一点也没关系，今天能重新排好节奏就已经很棒了。</p>
      </div>

      <div className="settings-card">
        <div className="card-title-row">
          <Image size={18} />
          <h2>背景壁纸</h2>
        </div>
        <div className="wallpaper-grid">
          {wallpaperOptions.map((wallpaper) => (
            <button
              className={
                selectedWallpaper === wallpaper.id
                  ? "wallpaper-option is-selected"
                  : "wallpaper-option"
              }
              key={wallpaper.id}
              type="button"
              onClick={() => onSelectWallpaper(wallpaper.id)}
            >
              <span className={`wallpaper-swatch wallpaper-${wallpaper.id}`} />
              <span>{wallpaper.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="soft-note">
        <Sparkles size={16} />
        选一个今天看着舒服的背景，计划也会轻一点。
      </div>
    </section>
  );
}
