"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import styles from "../../projects.module.css";
import RichTextEditor from "../../RichTextEditor";

const CATEGORIES = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Data Science",
  "Other",
];

interface FormData {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  contentHTML: string;
  coverImage: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  isPublished: boolean;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState<FormData>({
    title: "", slug: "", category: "Web Development",
    excerpt: "", contentHTML: "", coverImage: "",
    techStack: [], githubUrl: "", liveUrl: "", isPublished: false,
  });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          category: p.category || "Web Development",
          excerpt: p.excerpt || "",
          contentHTML: p.contentHTML || "",
          coverImage: p.coverImage || "",
          techStack: p.techStack || [],
          githubUrl: p.githubUrl || "",
          liveUrl: p.liveUrl || "",
          isPublished: p.isPublished || false,
        });
      } else {
        showToast("error", "Failed to load project.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const updateField = (field: keyof FormData, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        updateField("coverImage", dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const tag = techInput.trim();
    if (tag && !form.techStack.includes(tag)) {
      updateField("techStack", [...form.techStack, tag]);
    }
    setTechInput("");
  };

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && techInput === "" && form.techStack.length > 0) {
      updateField("techStack", form.techStack.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Project updated!");
        setTimeout(() => router.push("/admin/projects"), 1000);
      } else {
        showToast("error", data.error || "Failed to update project.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Loader2 size={28} className={styles.spin} />
        <span>Loading project...</span>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>
      <div className={styles.formHeader}>
        <Link href="/admin/projects" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className={styles.formTitle}>Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Title *</label>
              <input className={styles.formInput} type="text" value={form.title}
                onChange={(e) => updateField("title", e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Slug</label>
              <input className={styles.formInput} type="text" value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select className={styles.formSelect} value={form.category}
                onChange={(e) => updateField("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cover Image (Upload)</label>
              {form.coverImage ? (
                <div className={styles.imagePreviewWrap}>
                  <img src={form.coverImage} alt="Cover Preview" className={styles.imagePreview} />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => updateField("coverImage", "")}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <input
                  className={styles.formInput}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Excerpt *</label>
            <textarea className={styles.formTextarea} value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)} maxLength={300} />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.editorLabel}>Content / Case Study *</div>
            {form.contentHTML !== undefined && (
              <RichTextEditor content={form.contentHTML}
                onChange={(html) => updateField("contentHTML", html)} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tech Stack</label>
            <div className={styles.tagInput}>
              {form.techStack.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button type="button" className={styles.tagRemove}
                    onClick={() => updateField("techStack", form.techStack.filter(t => t !== tag))}>
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input className={styles.tagRawInput} type="text"
                placeholder={form.techStack.length === 0 ? "React, Node.js..." : ""}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                onBlur={addTag} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>GitHub URL</label>
              <input className={styles.formInput} type="url" value={form.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Live URL</label>
              <input className={styles.formInput} type="url" value={form.liveUrl}
                onChange={(e) => updateField("liveUrl", e.target.value)} />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={form.isPublished}
                onChange={(e) => updateField("isPublished", e.target.checked)} />
              <span className={styles.toggleSlider} />
            </label>
            <span className={styles.checkboxLabel}>
              <strong>{form.isPublished ? "Published" : "Draft"}</strong>
              {form.isPublished ? "Visible on public site." : "Hidden from public site."}
            </span>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/projects" className={styles.cancelBtn}>Cancel</Link>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? <><Loader2 size={15} className={styles.spin} /> Saving...</> : <><Save size={15} /> Save Changes</>}
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
