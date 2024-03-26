import "./App.css";

import { Bvh, CameraControls, Preload } from "@react-three/drei";

import { Scene } from "@components/Scene";
import { UI } from "@components/element/ui/UI";
import { Canvas } from "@react-three/fiber";
import { AnimationManager } from "animations/AnimationManager";
import { Suspense } from "react";

const App = () => {
    // const isPlaying = useSnapshot(animState).isPlaying;

    return (
        <>
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
                <Suspense fallback={null}>
                    {/* <PresentationControls
                        enabled={!isPlaying}
                        snap
                        polar={[-Math.PI / 12, Math.PI / 12]}
                        azimuth={[-Math.PI / 6, Math.PI / 6]}
                    > */}
                    <CameraControls makeDefault />
                    <Bvh firstHitOnly>
                        <Scene />
                    </Bvh>
                    {/* </PresentationControls> */}
                    <AnimationManager />
                    <gridHelper args={[100, 100]} />
                    <axesHelper args={[8]} />
                    <Preload all />
                </Suspense>
            </Canvas>
            <UI />
        </>
    );
};

export default App;
