import { Gltf } from "@react-three/drei";

export const Shelf = () => {
    return (
        <Gltf
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            src="/shelf.glb"
            receiveShadow
            castShadow
        />
    );
};
