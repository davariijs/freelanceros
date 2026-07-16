"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { WorkspaceModel } from "@/features/landing/3d-models/WorkspaceModel";
import { Html, useProgress } from "@react-three/drei";

interface HeroCanvasProps {
  osState: 0 | 1 | 2 | 3 | 4 | 5;
}

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center className="select-none pointer-events-none">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin" />
        <span className="text-[9px] font-black tracking-widest text-emerald-500 uppercase animate-pulse">
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

export const HeroCanvas = React.memo(({ osState }: HeroCanvasProps) => {
  return (
    <div
      dir="ltr"
      style={{ direction: "ltr" }}
      className="w-full h-full absolute inset-0"
    >
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 40 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />
        <pointLight position={[0, 4, 0]} intensity={0.6} />

        <Suspense fallback={<CanvasLoader />}>
          <WorkspaceModel osState={osState} />
        </Suspense>
      </Canvas>
    </div>
  );
});

HeroCanvas.displayName = "HeroCanvas";
export default HeroCanvas;
