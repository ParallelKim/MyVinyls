import "./App.css";

import { Bvh, CameraControls, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Scene } from "Scene";
import { ErrorBoundary } from "@components/groups/ErrorBoundary";
import { LoadingFallback } from "@components/groups/LoadingFallback";
import { UI } from "@components/ui/UI";
import { AnimationManager } from "Scene/animations/AnimationManager";
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
