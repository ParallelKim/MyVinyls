import { OrbitControls, ScrollControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Desk } from "./models/Desk";
import { LpPlayer } from "./models/LpPlayer";
import { ShelfGroup } from "./groups/ShelfGroup";

export const Scene = () => {
    const { height } = useThree((state) => state.viewport);

    return (
        <>
            <gridHelper args={[100, 100]} />
            <axesHelper args={[8]} />
            <ambientLight />
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
            </group>
            <ScrollControls pages={5}>
                <mesh></mesh>
            </ScrollControls>
        </>
    );
};
