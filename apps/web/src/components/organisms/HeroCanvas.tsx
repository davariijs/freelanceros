"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { WorkspaceModel } from "@/components/molecules/WorkspaceModel";

interface HeroCanvasProps {
  osState: 0 | 1 | 2 | 3 | 4;
}

export default function HeroCanvas({ osState }: HeroCanvasProps) {
  const isPointerDisabled = osState === 2 || osState === 3;
  return (
    <div
      dir="ltr"
      style={{ direction: "ltr" }}
      className="w-full h-full absolute inset-0"
    >
      <Canvas
        style={{ pointerEvents: isPointerDisabled ? "none" : "auto" }}
        camera={{ position: [0, 1.5, 4.5], fov: 40 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />
        <pointLight position={[0, 4, 0]} intensity={0.6} />

        <Suspense fallback={null}>
          <WorkspaceModel osState={osState} />
        </Suspense>
      </Canvas>
    </div>
  );
}
