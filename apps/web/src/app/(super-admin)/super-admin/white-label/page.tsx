'use client';

import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';

export default function SuperAdminWhiteLabelPage() {
  const [theme, setTheme] = useState('Ocean Dark');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  const [font, setFont] = useState('Inter');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">White Label & Branding Customization</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure default themes, default logo, default colors, typography fonts, login screen aesthetics, and favicon.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 text-xs">
        <div className="space-y-2">
          <label className="font-semibold text-slate-300">Default Theme Preset</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:outline-none"
          >
            <option value="Ocean Dark">Ocean Dark (Deep Slate & Purple Accent)</option>
            <option value="Emerald Clean">Emerald Health (Medical Green)</option>
            <option value="Corporate Slate">Corporate Slate (Minimal Gray)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Default Primary Color Hex</label>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Default Font Family</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:outline-none"
            >
              <option value="Inter">Inter (Modern Sans)</option>
              <option value="Roboto">Roboto</option>
              <option value="Outfit">Outfit (Clean Geometry)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300">Default Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          {saved ? <span className="text-emerald-400 font-semibold">✓ Branding presets saved!</span> : <span />}
          <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow">
            Save White Label Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
