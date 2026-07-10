"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";
import { ThreeEvent } from "@react-three/fiber";

interface FloatingMobileAppProps {
  osState: number;
}

function DraggableCapsule({
  homePos,
  color,
  text,
  tailLeft = false,
  isDark,
}: {
  homePos: THREE.Vector3;
  color: string;
  text: string;
  tailLeft?: boolean;
  isDark: boolean;
}) {
  const meshRef = React.useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragPos, setDragPos] = React.useState(new THREE.Vector3());

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setDragPos(e.point);
  };

  useFrame(() => {
    if (!meshRef.current) return;

    if (isDragging) {
      const localPos = meshRef.current.parent!.worldToLocal(dragPos.clone());
      meshRef.current.position.lerp(localPos, 0.3);
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        0.4,
        0.2,
      );
    } else {
      meshRef.current.position.lerp(homePos, 0.1);
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <RoundedBox
        args={[0.34, 0.11, 0.04]}
        radius={0.022}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.2} />
      </RoundedBox>
      <mesh
        position={[tailLeft ? -0.09 : 0.08, -0.052, 0]}
        rotation={[0, 0, Math.PI / 4]}
        castShadow
      >
        <boxGeometry args={[0.038, 0.038, 0.038]} />
        <meshStandardMaterial color={color} roughness={0.15} />
      </mesh>

      <mesh position={[-0.1, 0, 0.022]}>
        <sphereGeometry args={[0.014, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <Text
        position={[0.03, 0, 0.022]}
        fontSize={0.016}
        color="#ffffff"
        fontWeight="bold"
        maxWidth={0.22}
      >
        {text}
      </Text>
    </group>
  );
}

export function FloatingMobileApp({ osState }: FloatingMobileAppProps) {
  const { theme, t } = useApp();
  const isDark = theme === "dark";
  const active = osState === 5;

  const phoneRef = React.useRef<THREE.Group>(null);

  const positionsRef = React.useRef({
    state0: new THREE.Vector3(0, -2.5, 0),
    state5: new THREE.Vector3(-0.85, 0.0, 1.1),
  });

  useFrame((state) => {
    if (!phoneRef.current) return;
    const time = state.clock.getElapsedTime();

    const targetPos = active
      ? positionsRef.current.state5
      : positionsRef.current.state0;
    phoneRef.current.position.lerp(targetPos, 0.08);

    const targetScale = active ? 2.0 : 0.0;
    const scaleVec = new THREE.Vector3(targetScale, targetScale, targetScale);
    phoneRef.current.scale.lerp(scaleVec, 0.08);

    if (active) {
      phoneRef.current.position.y += Math.sin(time * 1.5) * 0.005;
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(
        phoneRef.current.rotation.y,
        -Math.PI * 1.05,
        0.08,
      );
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(
        phoneRef.current.rotation.x,
        0.15,
        0.08,
      );
    }
  });

  return (
    <group ref={phoneRef}>
      <group>
        <RoundedBox
          args={[0.38, 0.74, 0.04]}
          radius={0.035}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.92}
            roughness={0.1}
          />
        </RoundedBox>

        <RoundedBox
          args={[0.35, 0.71, 0.01]}
          radius={0.02}
          smoothness={4}
          position={[0, 0, 0.018]}
        >
          <meshPhysicalMaterial
            color="#a8baee"
            emissive="#73e6bf"
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.6}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
          />
        </RoundedBox>

        <group position={[0, 0.1, 0.026]}>
          <RoundedBox
            args={[0.12, 0.12, 0.02]}
            radius={0.02}
            smoothness={4}
            castShadow
          >
            <meshStandardMaterial
              color="#fbbf24"
              roughness={0.2}
              metalness={0.1}
            />
          </RoundedBox>
          <mesh position={[0, 0, 0.012]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      <DraggableCapsule
        homePos={new THREE.Vector3(-0.35, 0.15, 0.06)}
        color="#ff7a00"
        text={t.notifyDeadline || "Project Due Today"}
        isDark={isDark}
      />

      <DraggableCapsule
        homePos={new THREE.Vector3(0.35, 0.22, 0.08)}
        color="#3b82f6"
        text={t.notifyAdded || "New Project Added"}
        tailLeft
        isDark={isDark}
      />

      <DraggableCapsule
        homePos={new THREE.Vector3(-0.32, -0.15, 0.08)}
        color="#10b981"
        text={t.notifyProgress || "Progress: 40%"}
        isDark={isDark}
      />

      <DraggableCapsule
        homePos={new THREE.Vector3(0.32, -0.12, 0.06)}
        color="#a855f7"
        text={t.notifyTask || "Task Created"}
        tailLeft
        isDark={isDark}
      />
    </group>
  );
}
