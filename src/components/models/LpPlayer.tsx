import { Gltf } from "@react-three/drei";

export const LpPlayer = () => {
    return (
        <Gltf
            position={[26, 18.5, -3]}
            scale={2}
            rotation={[0, -Math.PI / 2, 0]}
            src="/lpPlayer.glb"
            receiveShadow
            castShadow
        />
    );
};
