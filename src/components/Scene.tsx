import { SoftShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ShelfGroup } from "./groups/ShelfGroup";
import { DeskGroup } from "./groups/DeskGroup";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { setRoot } from "@states/refState";

export const Scene = () => {
    const { height } = useThree((state) => state.viewport);
    const rootRef = useRef<Group>(null);

    useEffect(() => {
        if (rootRef.current) {
            setRoot(rootRef.current);
        }
    });

    return (
        <group
            name="root"
            ref={rootRef}
            position={[0, -10 - height / 1.65, 0]}
        >
            <ambientLight
                intensity={0.5}
                position={[0, 0, 30]}
            />
            <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                scale={10}
            >
                <planeGeometry
                    attach="geometry"
                    args={[10, 10]}
                />
                <meshStandardMaterial color="#FF8080" />
            </mesh>
            <mesh
                receiveShadow
                position={[0, 0, -15]}
                scale={10}
            >
                <planeGeometry
                    attach="geometry"
                    args={[10, 10]}
                />
                <meshStandardMaterial color="#EEE" />
            </mesh>
            <group dispose={null}>
                <ShelfGroup />
                <DeskGroup />
            </group>
            <SoftShadows />
        </group>
    );
};
