import "./App.css";

import { CameraControls, Preload } from "@react-three/drei";
import { Suspense } from "react";

import { Scene } from "@components/Scene";
import { UI } from "@components/element/ui/UI";
import { Canvas } from "@react-three/fiber";
import { AnimationManager } from "animations/AnimationManager";

const App = () => {
    // const isPlaying = useSnapshot(animState).isPlaying;

    return (
        <Suspense fallback={null}>
            <Canvas
                id="canvas"
                shadows
                camera={{
                    fov: 45,
                    position: [0, 10, -30],
                    // frustumCulled: true,
                }}
                // frameloop="demand" // 이거 Presentation control이랑 호환성이 낮음
            >
                {/* <PresentationControls
                    enabled={!isPlaying}
                    snap
                    polar={[-Math.PI / 12, Math.PI / 12]}
                    azimuth={[-Math.PI / 6, Math.PI / 6]}
                > */}
                <CameraControls makeDefault />
                <Scene />
                {/* </PresentationControls> */}
                <AnimationManager />
                <gridHelper args={[100, 100]} />
                <axesHelper args={[8]} />
                <Preload all />
                <UI />
            </Canvas>
        </Suspense>
    );
};

export default App;
