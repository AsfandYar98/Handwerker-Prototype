// Background-image photo: if the image can't load, the tinted tile surface
// shows instead of a broken-image icon.
export default function Photo({ src, alt = "", className = "", style }) {
  return (
    <div
      className={`photo ${className}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={{ backgroundImage: src ? `url("${src}")` : undefined, ...style }}
    />
  );
}
