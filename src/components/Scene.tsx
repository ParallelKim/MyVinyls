import { OrbitControls, ScrollControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Desk } from "./models/Desk";
import { LpPlayer } from "./models/LpPlayer";
import { ShelfGroup } from "./groups/ShelfGroup";

export const Scene = () => {
    const { height } = useThree((state) => state.viewport);

    return (
        <>
            {/* <gridHelper args={[100, 100]} /> */}
            <axesHelper args={[8]} />
            <directionalLight
                castShadow
                intensity={1.5}
                position={[5, 50, 20]}
                shadow-mapSize={4096}
                shadow-bias={-0.00005}
            >
                <orthographicCamera
                    attach="shadow-camera"
                    args={[-70, 70, 70, -70]}
                />
            </directionalLight>
            <ambientLight intensity={0.7} />
            <OrbitControls makeDefault />
            <group
                dispose={null}
                position={[0, -height / 1.65, 0.5]}
            >
                <ShelfGroup />
                <group position={[0, 0, 1.5]}>
                    <Desk />
                    <LpPlayer />
                </group>
                <mesh
                    receiveShadow
                    scale={100}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}
                >
                    <planeGeometry />
                    <meshPhysicalMaterial color="#F88" />
                </mesh>
            </group>
            <ScrollControls pages={5}>
                <mesh></mesh>
            </ScrollControls>
        </>
    );
};
