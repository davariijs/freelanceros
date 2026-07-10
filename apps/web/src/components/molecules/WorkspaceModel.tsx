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
import { CompanionBot } from "@/components/atoms/CompanionBot";
import { FloatingKeys } from "@/components/atoms/FloatingKeys";

interface WorkspaceModelProps {
  osState: 0 | 1 | 2 | 3 | 4;
}

export function WorkspaceModel({ osState }: WorkspaceModelProps) {
  const { scene } = useGLTF("/models/workspace.glb");
  const mainGroupRef = React.useRef<THREE.Group>(null);
  const deskGroupRef = React.useRef<THREE.Group>(null);
  const [isShifted, setIsShifted] = React.useState(false);

  useFrame((state) => {
    if (!mainGroupRef.current || !deskGroupRef.current) return;

    const elapsed = state.clock.getElapsedTime();

    let targetMainY = 0.3;
    if (osState >= 2) {
      targetMainY = 0.0;
    } else {
      targetMainY = Math.sin(elapsed * 1.0) * 0.08 + 0.3;
    }

    mainGroupRef.current.position.y = THREE.MathUtils.lerp(
      mainGroupRef.current.position.y,
      targetMainY,
      0.08,
    );

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

    if (osState >= 2) {
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

  const deskActive = osState < 2;

  return (
    <group ref={mainGroupRef}>
      <group ref={deskGroupRef} visible={deskActive}>
        <Center>
          <primitive object={scene} scale={1.5} />
        </Center>
        <DeskLamp />
        <WorkTablet />
        {deskActive && (
          <>
            <LeftScreen />
            <RightScreen active={isShifted} />
            <DeskPapers osState={osState} />
          </>
        )}
      </group>

      <OrbitingRings />

      {osState < 4 && <CompanionBot osState={osState} />}

      <FloatingKeys osState={osState} />
    </group>
  );
}

useGLTF.preload("/models/workspace.glb");
