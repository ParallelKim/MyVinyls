import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import { CameraControls } from "@react-three/drei";

const App = () => {
    return (
        <>
            <Canvas
                shadows
                camera={{
                    fov: 45,
                    position: [0, 0, 30],
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
