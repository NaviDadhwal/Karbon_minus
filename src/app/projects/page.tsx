"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useProject } from "@/context/ProjectContext";
import { notifyError, notifySuccess } from "@/lib/toast";
import { formatInr, formatKgCo2e } from "@/lib/utils";
import { Plus, Sparkles, FolderOpen, Trash2 } from "lucide-react";
import { AllDemosLoadedError } from "@/lib/demo-templates";

export default function ProjectsPage() {
  const { projects, deleteProject, loadDemo } = useProject();

  function handleDeleteProject(id: string, name: string) {
    const confirmed = window.confirm(
      `Delete project "${name}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    deleteProject(id);
    notifySuccess(
      "Project deleted",
      `${name} was removed from your saved projects.`,
    );
  }

  return (
    <>
      <Nav />
      <main className="page-shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Your projects
            </h1>
            <p className="mt-2 max-w-lg text-muted">
              Compare materials, optimize cost vs carbon, and brief suppliers —
              same glass UI everywhere.
            </p>
          </div>
          <div className="flex gap-2">
            <Button href="/project/new" className="flex items-center gap-1.5 shadow-lg shadow-accent/20">
              <Plus className="w-4 h-4" />
              <span>New project</span>
            </Button>
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              All projects
            </h2>
            <span className="text-xs text-muted">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-4">
              <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent w-fit mx-auto">
                <FolderOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">No projects yet</h3>
                <p className="text-sm text-muted mt-1 max-w-md mx-auto">
                  Create a new project workspace or load a sample Indian construction demo project.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button href="/project/new" className="flex items-center gap-1.5 shadow-md">
                  <Plus className="w-4 h-4" />
                  <span>Create First Project</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    void (async () => {
                      try {
                        const { name } = await loadDemo();
                        notifySuccess("Demo project loaded", name);
                      } catch (e) {
                        if (e instanceof AllDemosLoadedError) {
                          notifyError("No new demos left", e.message);
                        } else {
                          notifyError("Could not load demo", "Please try again.");
                        }
                      }
                    })();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Load Sample Demo</span>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-divide">
              {projects.map(({ project }) => (
                <li
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-4"
                >
                  <div>
                    <Link
                      href={`/project/${project.id}`}
                      className="font-medium text-accent hover:underline text-base"
                    >
                      {project.name}
                    </Link>
                    <div className="mt-1 text-xs text-subtle">
                      Budget: <strong>{formatKgCo2e(project.carbonBudget)}</strong> &bull; Ceiling:{" "}
                      <strong>{formatInr(project.costCeiling)}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button href={`/project/${project.id}`} variant="secondary">
                      Open
                    </Button>
                    <Button
                      variant="secondary"
                      className="border-danger/50 text-danger hover:bg-danger/10 p-2.5"
                      onClick={() =>
                        handleDeleteProject(project.id, project.name)
                      }
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </>
  );
}
