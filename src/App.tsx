import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import {
    Bounds,
    OrbitControls,
    Preload /* PresentationControls */,
} from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { UI } from "@components/element/ui/UI";

const fontLoader = new FontLoader();
fontLoader.load("./Pretendard.json");

const App = () => {
    return (
        <>
            <Canvas
                id="canvas"
                shadows
                camera={{
                    fov: 45,
                    position: [0, 10, -30],
                    frustumCulled: true,
                }}
            >
                <Bounds>
                    <Scene />
                </Bounds>
                <AlbumInfo />
                <gridHelper args={[100, 100]} />
                <axesHelper args={[8]} />
                <Preload all />
                <UI />
            </Canvas>
        </>
    );
};

export default App;
