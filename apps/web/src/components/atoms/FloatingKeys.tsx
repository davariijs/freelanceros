"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";
import { ThreeEvent } from "@react-three/fiber";

interface FloatingKeysProps {
  osState: number;
}

export function FloatingKeys({ osState }: FloatingKeysProps) {
  const { theme, setIsCommandOpen } = useApp();
  const isDark = theme === "dark";
  const active = osState === 4;

  const key1Ref = React.useRef<THREE.Group>(null);
  const key2Ref = React.useRef<THREE.Group>(null);

  const [hoveredCtrl, setHoveredCtrl] = React.useState(false);
  const [hoveredK, setHoveredK] = React.useState(false);

  const positionsRef = React.useRef({
    state0: [new THREE.Vector3(0, -2.5, 0), new THREE.Vector3(0, -2.5, 0)],
    state4: [
      new THREE.Vector3(-0.05, -0.05, 1.25),
      new THREE.Vector3(0.7, 0.15, 1.25),
    ],
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!key1Ref.current || !key2Ref.current) return;

    const targetSet = active
      ? positionsRef.current.state4
      : positionsRef.current.state0;

    const baseRotX = -1.1;
    const baseRotY = -Math.PI * 1.15;

    let targetX1 = targetSet[0].x;
    let targetY1 = targetSet[0].y;
    let targetZ1 = targetSet[0].z;
    let targetRotZ1 = -0.2;

    let targetX2 = targetSet[1].x;
    let targetY2 = targetSet[1].y;
    let targetZ2 = targetSet[1].z;
    let targetRotZ2 = 0.35;

    if (active) {
      const bob1 = Math.sin(time * 1.2) * 0.02;
      const bob2 = Math.sin(time * 1.2 + 0.8) * 0.02;

      targetY1 += bob1;
      targetY2 += bob2;

      if (hoveredCtrl) {
        targetX1 += Math.sin(time * 50) * 0.011;
        targetZ1 += Math.sin(time * 50) * 0.011;
        targetRotZ1 += Math.sin(time * 50) * 0.04;
      }

      if (hoveredK) {
        targetX2 += Math.sin(time * 50) * 0.011;
        targetZ2 += Math.sin(time * 50) * 0.011;
        targetRotZ2 += Math.sin(time * 50) * 0.04;
      }
    }

    key1Ref.current.position.x = THREE.MathUtils.lerp(
      key1Ref.current.position.x,
      targetX1,
      0.1,
    );
    key1Ref.current.position.y = THREE.MathUtils.lerp(
      key1Ref.current.position.y,
      targetY1,
      0.1,
    );
    key1Ref.current.position.z = THREE.MathUtils.lerp(
      key1Ref.current.position.z,
      targetZ1,
      0.1,
    );

    key2Ref.current.position.x = THREE.MathUtils.lerp(
      key2Ref.current.position.x,
      targetX2,
      0.1,
    );
    key2Ref.current.position.y = THREE.MathUtils.lerp(
      key2Ref.current.position.y,
      targetY2,
      0.1,
    );
    key2Ref.current.position.z = THREE.MathUtils.lerp(
      key2Ref.current.position.z,
      targetZ2,
      0.1,
    );

    key1Ref.current.rotation.x = THREE.MathUtils.lerp(
      key1Ref.current.rotation.x,
      active ? baseRotX : 0,
      0.08,
    );
    key1Ref.current.rotation.y = THREE.MathUtils.lerp(
      key1Ref.current.rotation.y,
      active ? baseRotY : 0,
      0.08,
    );
    key1Ref.current.rotation.z = THREE.MathUtils.lerp(
      key1Ref.current.rotation.z,
      active ? targetRotZ1 : 0,
      0.15,
    );

    key2Ref.current.rotation.x = THREE.MathUtils.lerp(
      key2Ref.current.rotation.x,
      active ? -1.0 : 0,
      0.08,
    );
    key2Ref.current.rotation.y = THREE.MathUtils.lerp(
      key2Ref.current.rotation.y,
      active ? -Math.PI * 0.95 : 0,
      0.08,
    );
    key2Ref.current.rotation.z = THREE.MathUtils.lerp(
      key2Ref.current.rotation.z,
      active ? targetRotZ2 : 0,
      0.15,
    );

    const targetScale = active ? 1.15 : 0.0;
    const scaleVec = new THREE.Vector3(targetScale, targetScale, targetScale);
    key1Ref.current.scale.lerp(scaleVec, 0.08);
    key2Ref.current.scale.lerp(scaleVec, 0.08);
  });

  const handleToggle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsCommandOpen(true);
  };

  const handlePointerOver = (
    e: ThreeEvent<PointerEvent>,
    setHover: (h: boolean) => void,
  ) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (setHover: (h: boolean) => void) => {
    setHover(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group>
      <group
        ref={key1Ref}
        onClick={handleToggle}
        onPointerOver={(e) => handlePointerOver(e, setHoveredCtrl)}
        onPointerOut={() => handlePointerOut(setHoveredCtrl)}
      >
        <RoundedBox
          args={[0.42, 0.22, 0.42]}
          radius={0.035}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color={isDark ? "#2a2c30" : "#111111"}
            metalness={isDark ? 0.8 : 0.2}
            roughness={0.12}
          />
        </RoundedBox>
        <Text
          position={[0, 0.125, 0.01]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.065}
          color="#ffffff"
          fontWeight="bold"
        >
          Ctrl
        </Text>
      </group>

      <group
        ref={key2Ref}
        onClick={handleToggle}
        onPointerOver={(e) => handlePointerOver(e, setHoveredK)}
        onPointerOut={() => handlePointerOut(setHoveredK)}
      >
        <RoundedBox
          args={[0.35, 0.22, 0.35]}
          radius={0.035}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color={isDark ? "#10b981" : "#ff7a00"}
            emissive={isDark ? "#064e3b" : "#000000"}
            emissiveIntensity={isDark ? 1.5 : 0}
            metalness={isDark ? 0.5 : 0.2}
            roughness={0.12}
          />
        </RoundedBox>
        <Text
          position={[0, 0.125, 0.01]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.09}
          color="#ffffff"
          fontWeight="bold"
        >
          K
        </Text>
      </group>
    </group>
  );
}
