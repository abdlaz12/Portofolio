"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import styles from "./projects.module.css";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects?all=true");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        setError("Failed to load projects");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete project.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isPublished: !current } : p))
        );
      }
    } catch {
      alert("Network error.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/projects/new" id="add-project-btn" className={styles.addBtn}>
          <PlusCircle size={16} />
          Add Project
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <Loader2 size={28} className={styles.spin} />
          <span>Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className={styles.emptyState}>
          <PlusCircle size={40} />
          <h2>No projects yet</h2>
          <p>Add your first project to get started.</p>
          <Link href="/admin/projects/new" className={styles.addBtn}>
            Add Your First Project
          </Link>
        </div>
      ) : (
        /* Table */
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <div className={styles.projectTitle}>{project.title}</div>
                    <div className={styles.projectSlug}>/{project.slug}</div>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>{project.category}</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        project.isPublished ? styles.published : styles.draft
                      }`}
                    >
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {/* Toggle publish */}
                      <button
                        onClick={() => handleTogglePublish(project._id, project.isPublished)}
                        className={styles.actionBtn}
                        disabled={togglingId === project._id}
                        title={project.isPublished ? "Unpublish" : "Publish"}
                      >
                        {togglingId === project._id ? (
                          <Loader2 size={14} className={styles.spin} />
                        ) : project.isPublished ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>

                      {/* Edit */}
                      <Link
                        href={`/admin/projects/${project._id}/edit`}
                        className={styles.actionBtn}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(project._id, project.title)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        disabled={deletingId === project._id}
                        title="Delete"
                      >
                        {deletingId === project._id ? (
                          <Loader2 size={14} className={styles.spin} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
