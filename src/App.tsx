import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import { CameraControls } from "@react-three/drei";
import { PointLight } from "three";

const light = new PointLight("#ffe2ba", 100);
light.position.set(10, 10, 0); // This position is relative to the camera's position

const App = () => {
    return (
        <>
            <Canvas
                shadows
                camera={{
                    fov: 45,
                    position: [0, 15, 30],
                }}
                onCreated={({ camera, scene }) => {
                    camera.add(light);
                    scene.add(camera);
                }}
            >
                <CameraControls makeDefault />
                <gridHelper args={[100, 100]} />
                <axesHelper args={[8]} />
                <Scene />
                <AlbumInfo />
            </Canvas>
        </>
    );
};

export default App;
