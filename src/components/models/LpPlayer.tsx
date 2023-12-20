import { Gltf } from "@react-three/drei";

export const LpPlayer = () => {
    return (
        <Gltf
            position={[21, 12, 0]}
            scale={[1 / 30, 1 / 30, 1 / 30]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            src="/lpPlayer.glb"
            receiveShadow
            castShadow
        />
    );
};
