import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import { CameraControls, Preload } from "@react-three/drei";
import { SpotLight } from "three";
import { FontLoader } from "three/examples/jsm/Addons.js";

const light = new SpotLight("#fff", 10, 0, Math.PI / 6, 1, 0.8);
const fontLoader = new FontLoader();
fontLoader.load("./Pretendard.json");

const App = () => {
    return (
        <>
            <Canvas
                shadows
                camera={{
                    fov: 45,
                    position: [0, 15, 30],
                }}
                onCreated={({ camera, scene, gl }) => {
                    camera.add(light);
                    scene.add(camera);
                    gl.localClippingEnabled = true;
                }}
            >
                <CameraControls makeDefault />
                {/* <gridHelper args={[100, 100]} /> */}
                {/* <axesHelper args={[8]} /> */}
                <Scene />
                <AlbumInfo />
                <Preload all />
            </Canvas>
        </>
    );
};

export default App;
