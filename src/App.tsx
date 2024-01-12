import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import { Preload, PresentationControls } from "@react-three/drei";
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
                    position: [0, 10, 30],
                }}
                onCreated={({ camera, scene, gl }) => {
                    camera.add(light);
                    scene.add(camera);
                    gl.localClippingEnabled = true;
                }}
            >
                <PresentationControls
                    enabled={true} // the controls can be disabled by setting this to false
                    global={false} // Spin globally or by dragging the model
                    snap={true} // Snap-back to center (can also be a spring config)
                    speed={1} // Speed factor
                    zoom={1} // Zoom factor when half the polar-max is reached
                    rotation={[0, 0, 0]} // Default rotation
                    polar={[-Math.PI / 6, Math.PI / 6]} // Vertical limits
                    azimuth={[-Math.PI / 6, Math.PI / 6]} // Horizontal limits
                    config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
                >
                    <Scene />
                    <AlbumInfo />
                </PresentationControls>
                {/* <gridHelper args={[100, 100]} /> */}
                {/* <axesHelper args={[8]} /> */}
                <Preload all />
            </Canvas>
        </>
    );
};

export default App;
