"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DeskPapersProps {
  osState: 0 | 1 | 2;
}

export function DeskPapers({ osState }: DeskPapersProps) {
  const paper1Ref = React.useRef<THREE.Mesh>(null);
  const paper2Ref = React.useRef<THREE.Mesh>(null);
  const paper3Ref = React.useRef<THREE.Mesh>(null);

  const config = React.useMemo(
    () => ({
      state0: [
        {
          pos: new THREE.Vector3(-0.45, 0.171, 0.1),
          rot: new THREE.Euler(-Math.PI / 2, 0, 0.1),
          opacity: 0.8,
        },
        {
          pos: new THREE.Vector3(-0.45, 0.174, 0.1),
          rot: new THREE.Euler(-Math.PI / 2, 0, -0.05),
          opacity: 0.85,
        },
        {
          pos: new THREE.Vector3(-0.45, 0.177, 0.1),
          rot: new THREE.Euler(-Math.PI / 2, 0, 0.02),
          opacity: 0.9,
        },
      ],
      state1: [
        {
          pos: new THREE.Vector3(-0.5, 0.28, 0.12),
          rot: new THREE.Euler(-0.4, 0.2, -0.1),
          opacity: 0.9,
        },
        {
          pos: new THREE.Vector3(-0.45, 0.32, 0.15),
          rot: new THREE.Euler(-0.3, -0.15, 0.15),
          opacity: 0.9,
        },
        {
          pos: new THREE.Vector3(-0.4, 0.36, 0.18),
          rot: new THREE.Euler(-0.2, 0.1, -0.05),
          opacity: 0.95,
        },
      ],
      state2: [
        {
          pos: new THREE.Vector3(-1.2, 0.8, 1.8),
          rot: new THREE.Euler(0, 0.5, -0.3),
          opacity: 0,
        },
        {
          pos: new THREE.Vector3(0, 0.9, 1.8),
          rot: new THREE.Euler(-0.2, 0, 0),
          opacity: 0,
        },
        {
          pos: new THREE.Vector3(1.2, 0.8, 1.8),
          rot: new THREE.Euler(0, -0.5, 0.3),
          opacity: 0,
        },
      ],
    }),
    [],
  );

  useFrame(() => {
    const refs = [paper1Ref.current, paper2Ref.current, paper3Ref.current];

    refs.forEach((ref, index) => {
      if (!ref) return;

      const targetSet =
        osState === 0
          ? config.state0[index]
          : osState === 1
            ? config.state1[index]
            : config.state2[index];

      ref.position.lerp(targetSet.pos, 0.08);

      const targetQuat = new THREE.Quaternion().setFromEuler(targetSet.rot);
      ref.quaternion.slerp(targetQuat, 0.08);

      const mat = ref.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          targetSet.opacity,
          0.08,
        );
      }
    });
  });

  return (
    <group>
      <mesh ref={paper1Ref} castShadow>
        <planeGeometry args={[0.15, 0.2]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={paper2Ref} castShadow>
        <planeGeometry args={[0.15, 0.2]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={paper3Ref} castShadow>
        <planeGeometry args={[0.15, 0.2]} />
        <meshBasicMaterial
          color="#a5b4fc"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
