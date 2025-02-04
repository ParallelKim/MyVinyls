import "./App.css";

import { Bvh, CameraControls, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Scene } from "@components/Scene";
import { ErrorBoundary } from "@components/element/ErrorBoundary";
import { LoadingFallback } from "@components/element/LoadingFallback";
import { UI } from "@components/element/ui/UI";
import { AnimationManager } from "animations/AnimationManager";
import { CAMERA_SETTINGS, PERFORMANCE_SETTINGS } from "./constants/sceneConstants";
import useSceneStore from "./states/sceneStore";

const App = () => {
    const isPlaying = useSceneStore((state) => state.isPlaying);

    return (
        <>
            <Canvas
                id="canvas"
                shadows
                camera={{
                    fov: CAMERA_SETTINGS.FOV,
                    position: CAMERA_SETTINGS.POSITION,
                    frustumCulled: true,
                }}
                frameloop={isPlaying ? "always" : "demand"}
                performance={{
                    min: PERFORMANCE_SETTINGS.MIN,
                    max: PERFORMANCE_SETTINGS.MAX,
                }}
            >
                <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                        <CameraControls
                            makeDefault
                            enabled={!isPlaying}
                        />
                        <Bvh maxDepth={3}>
                            <Scene />
                        </Bvh>
                        <AnimationManager />
                        <gridHelper args={[100, 100]} />
                        <axesHelper args={[8]} />
                        <Preload all />
                    </Suspense>
                </ErrorBoundary>
            </Canvas>
            <UI />
        </>
    );
};

export default App;
