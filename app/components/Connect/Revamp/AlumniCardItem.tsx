import Link from "next/link";
import { AlumniCard } from "./types";

export default function AlumniCardItem({ card }: { card: AlumniCard }) {
  return (
    <div className="alumni-card">
      <div className="alumni-avatar-wrap">
        <div className={`alumni-avatar ${card.variant ?? ""}`.trim()}>
          <span>{card.initials}</span>
        </div>
        {card.available && (
          <div className="available-badge">
            <span className="dot" />Available
          </div>
        )}
        <div className="verified-tick">✓</div>
      </div>
      <div className="alumni-id">{card.code}</div>
      <div className="alumni-title">{card.title}</div>
      <div className="alumni-sub">{card.subtitle}</div>
      <span className="alumni-tag-strip">⭐ {card.rating} · {card.sessions} sessions</span>
      <Link href={`/connect/alumni/${card.id}`} className="alumni-bottom-cta">📞 View profile</Link>
    </div>
  );
}
