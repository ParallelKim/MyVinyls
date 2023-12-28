import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";

function App() {
    return (
        <>
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 20, 40], fov: 45 }}
            >
                <Scene />
                <AlbumInfo />
            </Canvas>
        </>
    );
}

export default App;
