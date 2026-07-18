import * as React from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="clients" />
      <Tabs.Screen name="projects" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="notifications" />
    </Tabs>
  );
}
