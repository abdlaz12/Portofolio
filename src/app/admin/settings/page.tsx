"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import styles from "../projects/projects.module.css";

interface ThemeData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultMode: "light" | "dark";
}

const DEFAULT: ThemeData = {
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
  defaultMode: "dark",
};

export default function AdminSettingsPage() {
  const [theme, setTheme] = useState<ThemeData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setTheme({
          primaryColor: data.data.primaryColor || DEFAULT.primaryColor,
          secondaryColor: data.data.secondaryColor || DEFAULT.secondaryColor,
          accentColor: data.data.accentColor || DEFAULT.accentColor,
          defaultMode: data.data.defaultMode || DEFAULT.defaultMode,
        });
      }
    } catch {
      showToast("error", "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Theme settings saved!");
      } else {
        showToast("error", "Failed to save settings.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSaving(false);
    }
  };

  const ColorField = ({
    label, field,
  }: { label: string; field: keyof Omit<ThemeData, "defaultMode"> }) => (
    <div className={styles.colorGroup}>
      <label className={styles.formLabel}>{label}</label>
      <div className={styles.colorPickerWrap}>
        <input
          type="color"
          className={styles.colorSwatch}
          value={theme[field]}
          onChange={(e) => setTheme((prev) => ({ ...prev, [field]: e.target.value }))}
          style={{ backgroundColor: theme[field] }}
        />
        <input
          type="text"
          className={styles.colorHexInput}
          value={theme[field]}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              setTheme((prev) => ({ ...prev, [field]: val }));
            }
          }}
          maxLength={7}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Loader2 size={28} className={styles.spin} />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.formTitle}>Theme Settings</h1>
      <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>
        Customize your portfolio's colors and default display mode.
      </p>

      <form onSubmit={handleSave}>
        <div className={styles.settingsCard}>
          {/* Color pickers */}
          <div className={styles.colorRow}>
            <ColorField label="Primary Color" field="primaryColor" />
            <ColorField label="Secondary Color" field="secondaryColor" />
          </div>
          <div className={styles.colorRow}>
            <ColorField label="Accent Color" field="accentColor" />
            <div className={styles.colorGroup}>
              <label className={styles.formLabel}>Default Display Mode</label>
              <select
                className={styles.modeSelect}
                value={theme.defaultMode}
                onChange={(e) =>
                  setTheme((prev) => ({
                    ...prev,
                    defaultMode: e.target.value as "light" | "dark",
                  }))
                }
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div className={styles.formLabel} style={{ marginBottom: "0.75rem" }}>Live Preview</div>
            <div
              className={styles.previewBox}
              style={{
                background: theme.defaultMode === "dark" ? "#0f0f18" : "#f8fafc",
                border: `1px solid ${theme.primaryColor}30`,
              }}
            >
              <p className={styles.previewTitle} style={{ color: theme.defaultMode === "dark" ? "#64748b" : "#94a3b8" }}>
                Preview
              </p>
              <div className={styles.previewBtns}>
                <button
                  type="button"
                  className={styles.previewBtn}
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    color: "white",
                  }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className={styles.previewBtn}
                  style={{
                    background: `${theme.accentColor}20`,
                    color: theme.accentColor,
                    border: `1px solid ${theme.accentColor}40`,
                  }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? (
                <><Loader2 size={15} className={styles.spin} /> Saving...</>
              ) : (
                <><Save size={15} /> Save Settings</>
              )}
            </button>
          </div>
        </div>
      </form>

      {toast && (
        <div className={`${styles.toast} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
