"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { FilterToolbar } from "@/components/molecules/FilterToolbar";
import { Timeline } from "@/components/organisms/Timeline";
import { CreateProjectModal } from "@/components/organisms/CreateProjectModal";
import { EditProjectModal } from "@/components/organisms/EditProjectModal";
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/hooks/useProjects";
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

  const { data: projects = [], isLoading } = useProjectsQuery();
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
    },
  ) => {
    updateProjectMutation.mutate({ id, ...data });
  };

  const handleDeleteProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      if (filters.status !== "ALL" && project.status !== filters.status)
        return false;
      if (filters.priority !== "ALL" && project.priority !== filters.priority)
        return false;
      return true;
    });
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
        onSubmitProject={handleCreateProject}
      />

      <EditProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}
