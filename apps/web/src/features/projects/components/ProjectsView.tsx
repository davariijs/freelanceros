"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { FilterToolbar } from "@/components/ui/FilterToolbar";
import { Timeline } from "@/features/projects/components/Timeline";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { EditProjectModal } from "@/features/projects/components/EditProjectModal";
import { useClientsQuery } from "@/features/clients/hooks/useClients";
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/features/projects/hooks/useProjects";
import {
  Project,
  ProjectStatus,
} from "@/features/projects/schemas/project.schema";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { TaskPriority } from "@/features/tasks/schemas/task.schema";

export default function ProjectsView() {
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

  const { data: projects = [], isLoading } = useProjectsQuery();
  const { data: clients = [] } = useClientsQuery();

  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateProject = (data: {
    title: string;
    dueDate: string;
    priority: TaskPriority;
    status: ProjectStatus;
    clientId?: string;
  }) => {
    createProjectMutation.mutate(data);
  };

  const handleUpdateProject = (
    id: string,
    data: {
      title: string;
      dueDate: string;
      priority: TaskPriority;
      status: ProjectStatus;
      clientId?: string;
    },
  ) => {
    updateProjectMutation.mutate({ id, ...data });
  };

  const handleDeleteProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const filteredProjects = React.useMemo(() => {
    const filtered = projects.filter((project) => {
      if (filters.status !== "ALL" && project.status !== filters.status)
        return false;
      if (filters.priority !== "ALL" && project.priority !== filters.priority)
        return false;
      return true;
    });

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filters, projects]);

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

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-neutral-400">{t.mainloading}</p>
        </div>
      ) : (
        <Timeline
          projects={filteredProjects}
          onProjectClick={(proj) => setSelectedProject(proj)}
        />
      )}

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        clients={clients}
        onSubmitProject={handleCreateProject}
      />

      <EditProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        clients={clients}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}
