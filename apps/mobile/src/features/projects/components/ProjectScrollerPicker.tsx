import * as React from "react";
import { ScrollView, View, Text } from "react-native";
import { ProjectChip } from "@/features/projects/components/ProjectChip";
import { useApp } from "@/context/AppContext";

interface SimpleProject {
  id: string;
  title: string;
}

interface ProjectScrollerPickerProps {
  projects: SimpleProject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const ProjectScrollerPicker: React.FC<ProjectScrollerPickerProps> = ({
  projects,
  selectedId,
  onSelect,
}) => {
  const { t } = useApp();

  return (
    <View className="space-y-2">
      <Text className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-2">
        {t.selectProjectPlaceholder}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        className="flex-row"
      >
        <ProjectChip
          label={t.noProjectChip}
          isActive={selectedId === null}
          onPress={() => onSelect(null)}
        />

        {projects.map((proj: SimpleProject) => (
          <ProjectChip
            key={proj.id}
            label={proj.title}
            isActive={selectedId === proj.id}
            onPress={() => onSelect(proj.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
