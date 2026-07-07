"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

export function WorkspaceModel() {
  const { scene } = useGLTF("/models/workspace.glb");
  const groupRef = React.useRef<THREE.Group>(null);

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
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
    </group>
  );
}

useGLTF.preload("/models/workspace.glb");
