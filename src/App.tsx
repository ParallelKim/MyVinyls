import "./App.css";

import { Bvh, CameraControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Scene } from "Scene";
import { LoadingFallback } from "@/components/groups/LoadingFallback";
import { UI } from "@/components/ui/UI";
import { AnimationManager } from "Scene/animations/AnimationManager";
import {
    CAMERA_SETTINGS,
    PERFORMANCE_SETTINGS,
} from "./constants/sceneConstants";
import { JUNGWOO } from "@/constants/jungwoo";
import usePlayerStore from "@/states/playerStore";

const App = () => {
    const { isPlaying } = usePlayerStore();

    // 앨범 커버 이미지 프리로드
    useTexture.preload(JUNGWOO.albums.map((album) => album.cover));

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
                frameloop={"always"}
                performance={{
                    min: PERFORMANCE_SETTINGS.MIN,
                    max: PERFORMANCE_SETTINGS.MAX,
                }}
            >
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
                </Suspense>
            </Canvas>
            <UI />
        </>
    );
};

export default App;
