import { Gltf } from "@react-three/drei";

export const Desk = () => {
    return (
        <Gltf
            position={[20, 0, 0]}
            scale={[1 / 60, 1 / 60, 1 / 60]}
            rotation={[Math.PI / 2, 0, 0]}
            src="/desk.glb"
            receiveShadow
            castShadow
        />
    );
};
