import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Shelf } from "./models/Shelf";
import { useThree } from "@react-three/fiber";
import { Desk } from "./models/Desk";
import { LpPlayer } from "./models/LpPlayer";
import { LpWithCover } from "./models/LpWithCover";
import { Group } from "three";
import { useRef } from "react";

export const Scene = () => {
    const { height } = useThree((state) => state.viewport);
    const shelfRef = useRef<Group>(null);

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
                <group ref={shelfRef}>
                    <Shelf />
                    <LpWithCover parent={shelfRef} />
                </group>
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
