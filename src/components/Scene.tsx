import { SoftShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Desk } from "./models/Desk";
import { LpPlayer } from "./models/LpPlayer";
import { ShelfGroup } from "./groups/ShelfGroup";

export const Scene = () => {
    const { height } = useThree((state) => state.viewport);

    return (
        <group position={[0, -10, 0]}>
            <ambientLight
                intensity={0.5}
                position={[0, 0, 30]}
            />
            <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -height / 1.65, 0]}
                scale={10}
            >
                <planeGeometry
                    attach="geometry"
                    args={[10, 10]}
                />
                <meshStandardMaterial color="#FF8080" />
            </mesh>
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
            <SoftShadows />
        </group>
    );
};
