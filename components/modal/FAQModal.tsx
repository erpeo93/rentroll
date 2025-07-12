'use client';

import { useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';

export default function FAQModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const faq = t("faq") as { q: string; a: string }[];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
        justifyContent: "center", alignItems: "center", zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} // ⛔ prevent close if clicking inside
        style={{
          background: "#fff", padding: "2rem", borderRadius: "8px",
          width: "90%", maxWidth: "600px", position: "relative"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            fontSize: "1.5rem", background: "none", border: "none"
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <h2>FAQ</h2>
        {faq.map((item, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <strong>{item.q}</strong>
            <p>{item.a}</p>
          </div>
        ))}

        <a href="/terms" target="_blank" style={{ marginTop: "2rem", display: "inline-block" }}>
          View Terms & Conditions
        </a>
      </div>
    </div>
  );
}