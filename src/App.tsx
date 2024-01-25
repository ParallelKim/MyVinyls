import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@components/Scene";
import { AlbumInfo } from "./components/element/AlbumInfo";
import { Bounds, Preload /* PresentationControls */ } from "@react-three/drei";
import { SpotLight } from "three";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { UI } from "@components/element/ui/UI";

const light = new SpotLight("#fff", 10, 0, Math.PI / 6, 1, 0.8);
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
                    position: [0, 10, 30],
                    frustumCulled: true,
                }}
                onCreated={({ camera, scene, gl }) => {
                    camera.add(light);
                    scene.add(camera);
                    gl.localClippingEnabled = true;
                }}
            >
                {/* <PresentationControls
                    snap={true}
                    speed={1}
                    zoom={1}
                    polar={[-Math.PI / 12, Math.PI / 12]}
                    azimuth={[-Math.PI / 6, Math.PI / 6]}
                    config={{ mass: 1, tension: 170, friction: 26 }}
                > */}
                <Bounds
                    clip
                    observe
                    margin={1.2}
                >
                    <Scene />
                    <AlbumInfo />
                </Bounds>
                {/* </PresentationControls> */}
                {/* <gridHelper args={[100, 100]} /> */}
                {/* <axesHelper args={[8]} /> */}
                <Preload all />
                <UI />
            </Canvas>
        </>
    );
};

export default App;
