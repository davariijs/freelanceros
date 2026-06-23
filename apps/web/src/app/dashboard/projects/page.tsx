"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { FilterToolbar } from "@/components/molecules/FilterToolbar";
import { Timeline } from "@/components/organisms/Timeline";
import { CreateProjectModal } from "@/components/organisms/CreateProjectModal";
import { EditProjectModal } from "@/components/organisms/EditProjectModal";
import { Project, ProjectStatus } from "@/schemas/project";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";
import { TaskPriority } from "@/schemas/task";

export default function ProjectsPage() {
  const { t } = useApp();
  const [filters, setFilters] = React.useState({
    priority: "ALL",
    client: "ALL",
    status: "ALL",
  });
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null,
  );

  const [localProjects, setLocalProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "p1",
        title: "Enterprise Core E-Commerce",
        status: "ACTIVE",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        client: { id: "c1", name: "TechCorp Inc." },
        createdAt: new Date().toISOString(),
      },
      {
        id: "p2",
        title: "Mobile Wallet Expo App",
        status: "PLANNING",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() + 86400000 * 45).toISOString(),
        client: { id: "c2", name: "Fintech Startup" },
        createdAt: new Date().toISOString(),
      },
      {
        id: "p3",
        title: "Marketing Site Migration",
        status: "COMPLETED",
        priority: "LOW",
        dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        client: { id: "c1", name: "TechCorp Inc." },
        createdAt: new Date().toISOString(),
      },
    ];
    setLocalProjects(mockProjects);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateProject = (data: {
    title: string;
    dueDate: string;
    priority: TaskPriority;
    status: ProjectStatus;
  }) => {
    const truncatedTitle =
      data.title.length > 17 ? `${data.title.substring(0, 17)}...` : data.title;
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: truncatedTitle,
      status: data.status,
      priority: data.priority,
      dueDate: new Date(data.dueDate).toISOString(),
      createdAt: new Date().toISOString(),
    };
    setLocalProjects([newProject, ...localProjects]);
  };

  const filteredProjects = React.useMemo(() => {
    return localProjects.filter((project) => {
      if (filters.status !== "ALL" && project.status !== filters.status)
        return false;
      if (filters.priority !== "ALL" && project.priority !== filters.priority)
        return false;
      return true;
    });
  }, [filters, localProjects]);

  return (
    <div className="space-y-6 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {t.projects}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
            {t.projectsDescription}
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 sm:self-start"
        >
          <Plus className="h-4 w-4" />
          {t.createProject}
        </Button>
      </div>

      <FilterToolbar filters={filters} onFilterChange={handleFilterChange} />

      <Timeline
        projects={filteredProjects}
        onProjectClick={(proj) => setSelectedProject(proj)}
      />

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitProject={handleCreateProject}
      />

      <EditProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        onUpdateProject={(id, data) => {
          const truncatedTitle =
            data.title.length > 17
              ? `${data.title.substring(0, 17)}...`
              : data.title;
          setLocalProjects((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, ...data, title: truncatedTitle } : p,
            ),
          );
        }}
        onDeleteProject={(id) => {
          setLocalProjects((prev) => prev.filter((p) => p.id !== id));
        }}
      />
    </div>
  );
}
