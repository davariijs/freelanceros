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
import { DeskPapers } from "@/components/atoms/DeskPapers";

interface WorkspaceModelProps {
  osState: 0 | 1 | 2;
}

export function WorkspaceModel({ osState }: WorkspaceModelProps) {
  const { scene } = useGLTF("/models/workspace.glb");
  const mainGroupRef = React.useRef<THREE.Group>(null);
  const deskGroupRef = React.useRef<THREE.Group>(null);
  const [isShifted, setIsShifted] = React.useState(false);

  useFrame((state) => {
    if (!mainGroupRef.current || !deskGroupRef.current) return;

    const elapsed = state.clock.getElapsedTime();

    mainGroupRef.current.position.y = Math.sin(elapsed * 1.0) * 0.08 + 0.3;

    const targetX = state.pointer.y * 0.1;
    const targetY = state.pointer.x * 0.15 + Math.PI * 0.9;

    mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      mainGroupRef.current.rotation.x,
      targetX,
      0.05,
    );
    mainGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      mainGroupRef.current.rotation.y,
      targetY,
      0.05,
    );

    let targetDeskY = 0;
    let targetDeskZ = 0;
    let targetDeskScale = 1.0;

    if (osState === 2) {
      targetDeskY = -1.6;
      targetDeskZ = -2.2;
      targetDeskScale = 0.7;
    }

    deskGroupRef.current.position.y = THREE.MathUtils.lerp(
      deskGroupRef.current.position.y,
      targetDeskY,
      0.08,
    );
    deskGroupRef.current.position.z = THREE.MathUtils.lerp(
      deskGroupRef.current.position.z,
      targetDeskZ,
      0.08,
    );

    const scaleVec = new THREE.Vector3(
      targetDeskScale,
      targetDeskScale,
      targetDeskScale,
    );
    deskGroupRef.current.scale.lerp(scaleVec, 0.08);

    const hasScroll = window.scrollY > 50;
    setIsShifted(hasScroll);
  });

  return (
    <group ref={mainGroupRef}>
      <group ref={deskGroupRef}>
        <Center>
          <primitive object={scene} scale={1.5} />
        </Center>
        <DeskLamp />
        <WorkTablet />
        <LeftScreen />
        <RightScreen active={isShifted} />
      </group>

      <OrbitingRings />

      <DeskPapers osState={osState} />
    </group>
  );
}

useGLTF.preload("/models/workspace.glb");
