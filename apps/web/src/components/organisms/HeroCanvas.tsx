"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { WorkspaceModel } from "@/components/molecules/WorkspaceModel";

interface HeroCanvasProps {
  osState: 0 | 1 | 2 | 3 | 4 | 5;
}

export default function HeroCanvas({ osState }: HeroCanvasProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div
      dir="ltr"
      style={{ direction: "ltr" }}
      className="w-full h-full absolute inset-0"
    >
      <Canvas
        shadows={!isMobile}
        camera={{ position: [0, 1.5, 4.5], fov: 40 }}
        gl={{
          antialias: !isMobile,
          powerPreference: "default",
          alpha: true,
        }}
        dpr={isMobile ? 1 : [1, 1.5]}
        frameloop="always"
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
