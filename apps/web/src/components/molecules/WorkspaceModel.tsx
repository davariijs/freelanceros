"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { DeskLamp } from "@/components/molecules/DeskLamp";
import { WorkTablet } from "@/components/molecules/WorkTablet";
import { LeftScreen } from "@/components/atoms/LeftScreen";
import { RightScreen } from "@/components/atoms/RightScreen";
import { OrbitingRings } from "@/components/atoms/OrbitingRings";
import { EnergyCables } from "@/components/atoms/EnergyCables";
import { DeskPapers } from "@/components/atoms/DeskPapers";

interface WorkspaceModelProps {
  osState: 0 | 1 | 2;
}

export function WorkspaceModel({ osState }: WorkspaceModelProps) {
  const { scene } = useGLTF("/models/workspace.glb");
  const groupRef = React.useRef<THREE.Group>(null);
  const [isShifted, setIsShifted] = React.useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.getElapsedTime();

    groupRef.current.position.y = Math.sin(elapsed * 1.0) * 0.08 + 0.3;

    const targetX = state.pointer.y * 0.1;
    const targetY = state.pointer.x * 0.15 + Math.PI * 0.9;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05,
    );

    const hasScroll = window.scrollY > 50;
    setIsShifted(hasScroll);
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
      <DeskLamp />
      <WorkTablet />
      <LeftScreen />
      <RightScreen active={isShifted} />

      <OrbitingRings />
      <EnergyCables osState={osState} />
      <DeskPapers osState={osState} />
    </group>
  );
}

useGLTF.preload("/models/workspace.glb");
