import { Gltf } from "@react-three/drei";

export const Desk = () => {
    return (
        <Gltf
            position={[25, 0, -4]}
            rotation={[0, 0, 0]}
            src="/desk.glb"
            receiveShadow
            castShadow
        />
    );
};
