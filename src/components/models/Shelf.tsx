import { Gltf } from "@react-three/drei";

export const Shelf = () => {
    return (
        <Gltf
            scale={[1 / 50, 1 / 50, 1 / 50]}
            rotation={[Math.PI / 2, 0, 0]}
            src="/shelf.glb"
            receiveShadow
            castShadow
        />
    );
};
