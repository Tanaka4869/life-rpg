"use client";

import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpModal({ show, newLevel, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimIn(true));
      });
      const t = setTimeout(() => {
        setAnimIn(false);
        setTimeout(() => setVisible(false), 300);
        onClose();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        animIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={() => {
        setAnimIn(false);
        setTimeout(() => setVisible(false), 300);
        onClose();
      }}
    >
      <div
        className={`relative text-center px-10 py-8 rounded-2xl border-2 border-yellow-400 bg-slate-950 shadow-[0_0_60px_rgba(250,204,21,0.5)] transition-all duration-300 ${
          animIn ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* 背景グロー装飾 */}
        <div className="absolute inset-0 rounded-2xl bg-yellow-400/5 pointer-events-none" />

        <div className="space-y-3">
          <p className="text-yellow-300 font-mono text-xs tracking-[0.4em] uppercase">
            ─── Level Up! ───
          </p>

          <div className="relative">
            <p
              className="text-yellow-400 font-black font-mono text-7xl tracking-tight leading-none"
              style={{ textShadow: "0 0 32px rgba(250,204,21,0.8)" }}
            >
              {newLevel}
            </p>
            <p className="text-yellow-600 font-mono text-xs tracking-widest mt-1">
              LEVEL
            </p>
          </div>

          <p className="text-yellow-200 font-mono text-sm tracking-wider pt-2">
            ★ 新たなる力を手に入れた！ ★
          </p>

          <p className="text-slate-600 font-mono text-xs pt-1">
            TAP TO CONTINUE
          </p>
        </div>
      </div>
    </div>
  );
}
