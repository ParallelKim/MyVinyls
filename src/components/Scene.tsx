import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Shelf } from "./models/Shelf";
import { useThree } from "@react-three/fiber";
import { Desk } from "./models/Desk";
import { LpPlayer } from "./models/LpPlayer";

export const Scene = () => {
    const { height } = useThree((state) => state.viewport);

    return (
        <>
            <ambientLight />
            <OrbitControls makeDefault />
            <directionalLight
                castShadow
                intensity={1}
            >
                <orthographicCamera args={[-10, 10, 10, -10, 0.5, 30]} />
            </directionalLight>
            <group
                dispose={null}
                position={[0, -height / 1.65, 0]}
            >
                <Shelf />
                <Desk />
                <LpPlayer />
            </group>
            <ScrollControls pages={5}>
                <mesh></mesh>
            </ScrollControls>
        </>
    );
};
