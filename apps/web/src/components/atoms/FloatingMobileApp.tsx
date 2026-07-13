"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  isMobileSize = false,
  isTabletSize = false,
}: {
  homePos: THREE.Vector3;
  color: string;
  text: string;
  tailLeft?: boolean;
  isDark: boolean;
  isMobileSize?: boolean;
  isTabletSize?: boolean;
}) {
  const meshRef = React.useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const { size, viewport } = useThree();

  const aspect = viewport.width / size.width;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    if (e.target && "setPointerCapture" in e.target) {
      (e.target as any).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    if (e.target && "releasePointerCapture" in e.target) {
      (e.target as any).releasePointerCapture(e.pointerId);
    }
  };

  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setDragOffset({
      x: e.movementX * aspect,
      y: -e.movementY * aspect,
    });
  };

  const responsiveHomePos = React.useMemo(() => {
    if (isMobileSize) {
      return new THREE.Vector3(homePos.x * 0.7, homePos.y * 0.9, homePos.z);
    }
    if (isTabletSize) {
      return new THREE.Vector3(homePos.x * 0.85, homePos.y * 0.95, homePos.z);
    }
    return homePos;
  }, [homePos, isMobileSize, isTabletSize]);

  useFrame(() => {
    if (!meshRef.current) return;

    if (isDragging) {
      meshRef.current.position.x += dragOffset.x;
      meshRef.current.position.y += dragOffset.y;
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        responsiveHomePos.z + 0.5,
        0.2,
      );
      setDragOffset({ x: 0, y: 0 });
    } else {
      meshRef.current.position.lerp(responsiveHomePos, 0.1);
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
      scale={isMobileSize ? 0.75 : isTabletSize ? 0.85 : 1.0}
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

  const { size } = useThree();
  const isMobileSize = size.width < 768;
  const isTabletSize = size.width >= 768 && size.width < 1112;

  const phoneRef = React.useRef<THREE.Group>(null);
  const scrollProgressRef = React.useRef(0);

  const positionsRef = React.useMemo(() => {
    return {
      state0: new THREE.Vector3(0, -2.5, 0),
      state5: new THREE.Vector3(
        isMobileSize ? 0.3 : isTabletSize ? -0.5 : -0.85,
        isMobileSize ? 0.55 : -0.5,
        1.1,
      ),
    };
  }, [isMobileSize, isTabletSize]);

  React.useEffect(() => {
    if (!isMobileSize) return;

    const sec5 = document.getElementById("mobile-download-section");
    const handleScroll = () => {
      if (sec5) {
        const rect = sec5.getBoundingClientRect();
        scrollProgressRef.current = Math.max(0, -rect.top);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileSize]);

  useFrame((state) => {
    if (!phoneRef.current) return;
    const time = state.clock.getElapsedTime();

    const targetPos = active ? positionsRef.state5 : positionsRef.state0;
    const tempPos = targetPos.clone();

    let scaleFactor = 1.0;

    if (active && isMobileSize) {
      tempPos.y += scrollProgressRef.current * 0.0035;
      scaleFactor = Math.max(0.0, 1.0 - scrollProgressRef.current * 0.004);
    }

    phoneRef.current.position.lerp(tempPos, 0.08);

    const targetScale = active
      ? isMobileSize
        ? 0.72 * scaleFactor
        : isTabletSize
          ? 1.6
          : 2.0
      : 0.0;
    const scaleVec = new THREE.Vector3(targetScale, targetScale, targetScale);
    phoneRef.current.scale.lerp(scaleVec, 0.08);

    if (active) {
      phoneRef.current.position.y += Math.sin(time * 1.5) * 0.005;
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(
        phoneRef.current.rotation.y,
        isMobileSize ? -Math.PI * 1.0 : -Math.PI * 1.05,
        0.08,
      );
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(
        phoneRef.current.rotation.x,
        0.15,
        0.08,
      );
    }
  });

  const screenTexture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d")!;
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);

    bg.addColorStop(0, "#d9f7f8");
    bg.addColorStop(0.45, "#f4f0ff");
    bg.addColorStop(1, "#8cafac");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const purple = ctx.createRadialGradient(
      canvas.width * 0.48,
      canvas.height * 0.63,
      0,
      canvas.width * 0.48,
      canvas.height * 0.63,
      300,
    );

    purple.addColorStop(0, "rgba(88, 20, 151, 0.55)");
    purple.addColorStop(1, "rgba(201,145,255,0)");

    ctx.fillStyle = purple;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const blue = ctx.createRadialGradient(
      canvas.width * 0.35,
      canvas.height * 0.18,
      0,
      canvas.width * 0.35,
      canvas.height * 0.18,
      250,
    );

    blue.addColorStop(0, "rgba(170,245,255,0.45)");
    blue.addColorStop(1, "rgba(170,245,255,0)");

    ctx.fillStyle = blue;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const white = ctx.createRadialGradient(
      canvas.width * 0.55,
      canvas.height * 0.4,
      0,
      canvas.width * 0.55,
      canvas.height * 0.4,
      350,
    );

    white.addColorStop(0, "rgba(255,255,255,0.55)");
    white.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = white;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    return texture;
  }, []);

  return (
    <group ref={phoneRef} position={[0, -2.5, 0]} scale={0}>
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

        <group position={[0, 0, 0.05]}>
          <RoundedBox args={[0.35, 0.71, 0.005]} radius={0.02} smoothness={4}>
            <meshStandardMaterial
              map={screenTexture}
              emissiveMap={screenTexture}
              emissive="#74d474"
              emissiveIntensity={0.15}
              roughness={0.35}
            />
          </RoundedBox>

          <RoundedBox
            args={[0.35, 0.71, 0.006]}
            radius={0.02}
            smoothness={4}
            position={[0, 0, 0.004]}
          >
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.15}
              roughness={0.3}
            />
          </RoundedBox>
        </group>

        <group position={[0, 0.12, 0.024]} scale={1.25}>
          <RoundedBox
            args={[0.09, 0.09, 0.03]}
            radius={0.015}
            smoothness={4}
            castShadow
          >
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.5}
              roughness={0.2}
            />
          </RoundedBox>
          <RoundedBox
            args={[0.07, 0.07, 0.04]}
            radius={0.012}
            smoothness={4}
            position={[0, 0, -0.005]}
          >
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              roughness={0.1}
            />
          </RoundedBox>
        </group>
      </group>

      <DraggableCapsule
        homePos={new THREE.Vector3(-0.42, 0.15, 0.06)}
        color="#ff7a00"
        text={t.notifyDeadline || "Project Due Today"}
        isDark={isDark}
        isMobileSize={isMobileSize}
        isTabletSize={isTabletSize}
      />

      <DraggableCapsule
        homePos={new THREE.Vector3(0.42, 0.22, 0.08)}
        color="#3b82f6"
        text={t.notifyAdded || "New Project Added"}
        tailLeft
        isDark={isDark}
        isMobileSize={isMobileSize}
        isTabletSize={isTabletSize}
      />

      <DraggableCapsule
        homePos={new THREE.Vector3(-0.38, -0.15, 0.08)}
        color="#10b981"
        text={t.notifyProgress || "Progress: 40%"}
        isDark={isDark}
        isMobileSize={isMobileSize}
        isTabletSize={isTabletSize}
      />

      <DraggableCapsule
        homePos={new THREE.Vector3(0.38, -0.12, 0.06)}
        color="#a855f7"
        text={t.notifyTask || "Task Created"}
        tailLeft
        isDark={isDark}
        isMobileSize={isMobileSize}
        isTabletSize={isTabletSize}
      />
    </group>
  );
}
