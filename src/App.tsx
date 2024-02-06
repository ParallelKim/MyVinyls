import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import {
    Bounds,
    // Bounds,
    // OrbitControls,
    Preload,
    PresentationControls,
} from "@react-three/drei";
// import { UI } from "@components/element/ui/UI";
import { Suspense } from "react";
// import { AnimationManager } from "animations/AnimationManager";
import { UI } from "@components/element/ui/UI";

const App = () => {
    return (
        <Suspense fallback={null}>
            <Canvas
                id="canvas"
                shadows
                camera={{
                    fov: 45,
                    position: [0, 10, -30],
                    frustumCulled: true,
                }}
                // frameloop="demand" // 이거 Presentation control이랑 호환성이 낮음
            >
                <Bounds>
                    <PresentationControls
                        snap
                        speed={1}
                        zoom={1}
                        polar={[-Math.PI / 12, Math.PI / 12]}
                        azimuth={[-Math.PI / 6, Math.PI / 6]}
                        config={{ mass: 1, tension: 170, friction: 26 }}
                    >
                        <Scene />
                    </PresentationControls>
                </Bounds>
                <AlbumInfo />
                <gridHelper args={[100, 100]} />
                <axesHelper args={[8]} />
                <Preload all />
                <UI />
            </Canvas>
        </Suspense>
    );
};

export default App;
