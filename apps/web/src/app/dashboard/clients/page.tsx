"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/atoms/Button";
import { CreateClientModal } from "@/components/organisms/CreateClientModal";
import { EditClientModal } from "@/components/organisms/EditClientModal";
import { Client } from "@/schemas/client";
import { Plus, Users, Pencil } from "lucide-react";

export default function ClientsPage() {
  const { t } = useApp();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    null,
  );
  const [localClients, setLocalClients] = React.useState<Client[]>([]);

  React.useEffect(() => {
    const mockClients: Client[] = [
      {
        id: "c1",
        name: "TechCorp Inc.",
        email: "billing@techcorp.com",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c2",
        name: "Fintech Startup",
        email: "hello@finstart.io",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
    ];
    setLocalClients(mockClients);
  }, []);

  const handleCreateClient = (data: { name: string; email?: string }) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: data.name,
      email: data.email || null,
      userId: "u1",
      createdAt: new Date().toISOString(),
    };
    setLocalClients([newClient, ...localClients]);
  };

  const handleUpdateClient = (
    id: string,
    data: { name: string; email?: string },
  ) => {
    setLocalClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: data.name, email: data.email || null } : c,
      ),
    );
  };

  const handleDeleteClient = (id: string) => {
    setLocalClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {t.clients}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
            {t.clientsDescription}
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 sm:self-start whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          {t.createClient}
        </Button>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        {localClients.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500">{t.noClients}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse text-left text-sm"
              dir="ltr"
            >
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50">
                  <th className="p-4">{t.clientTableName}</th>
                  <th className="p-4">{t.clientTableEmail}</th>
                  <th className="p-4">{t.clientTableDate}</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {localClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      {client.name}
                    </td>
                    <td className="p-4 text-neutral-500 dark:text-neutral-400">
                      {client.email || "N/A"}
                    </td>
                    <td className="p-4 text-neutral-400">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateClientModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitClient={handleCreateClient}
      />

      <EditClientModal
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        client={selectedClient}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
      />
    </div>
  );
}
