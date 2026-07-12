"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
import { FloatingMobileApp } from "@/components/atoms/FloatingMobileApp";

interface WorkspaceModelProps {
  osState: 0 | 1 | 2 | 3 | 4 | 5;
}

export function WorkspaceModel({ osState }: WorkspaceModelProps) {
  const { scene } = useGLTF("/models/workspace.glb");
  const mainGroupRef = React.useRef<THREE.Group>(null);
  const deskGroupRef = React.useRef<THREE.Group>(null);
  const [isShifted, setIsShifted] = React.useState(false);

  const { size } = useThree();
  const isMobileSize = size.width < 768;

  useFrame((state) => {
    if (!mainGroupRef.current || !deskGroupRef.current) return;

    const elapsed = state.clock.getElapsedTime();

    let targetMainY = 0.3;
    if (osState >= 2) {
      targetMainY = 0.0;
    } else {
      targetMainY = Math.sin(elapsed * 1.0) * 0.08 + (isMobileSize ? 0.0 : 0.3);
    }

    mainGroupRef.current.position.y = THREE.MathUtils.lerp(
      mainGroupRef.current.position.y,
      targetMainY,
      0.08,
    );

    const targetX = state.pointer.y * 0.1 + (isMobileSize ? -0.18 : 0);
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
    let targetDeskScale = isMobileSize ? 0.65 : 1.0;

    if (osState >= 2) {
      targetDeskY = isMobileSize ? -1.0 : -1.6;
      targetDeskZ = isMobileSize ? -1.8 : -2.2;
      targetDeskScale = isMobileSize ? 0.45 : 0.7;
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
      <group ref={deskGroupRef} visible={osState < 2 && osState !== 5}>
        <Center>
          <primitive object={scene} scale={1.5} />
        </Center>
        <DeskLamp />
        <WorkTablet />
        {osState < 2 && (
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
      <FloatingMobileApp osState={osState} />
    </group>
  );
}

useGLTF.preload("/models/workspace.glb");
