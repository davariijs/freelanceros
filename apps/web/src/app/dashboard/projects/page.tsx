"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { FilterToolbar } from "@/components/molecules/FilterToolbar";
import { Timeline } from "@/components/organisms/Timeline";
import { Project } from "@/schemas/project";

export default function ProjectsPage() {
  const { t } = useApp();
  const [selectedPriority, setSelectedPriority] = React.useState("ALL");

  const mockProjects: Project[] = [
    {
      id: "p1",
      title: "Enterprise Core E-Commerce",
      status: "ACTIVE",
      dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "p2",
      title: "Mobile Wallet Expo App",
      status: "PLANNING",
      dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6 py-4 md:py-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.projects}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
          {t.projectsDescription}
        </p>
      </div>

      <FilterToolbar
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      <Timeline projects={mockProjects} />
    </div>
  );
}
