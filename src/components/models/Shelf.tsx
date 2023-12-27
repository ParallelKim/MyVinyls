import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Line001: THREE.Mesh;
    };
    materials: {
        ["IKE170031_02___Default.001"]: THREE.MeshStandardMaterial;
    };
};

export const Shelf = (props: JSX.IntrinsicElements["group"]) => {
    const { nodes, materials } = useGLTF(
        "/shelf-transformed.glb"
    ) as GLTFResult;
    return (
        <group
            {...props}
            dispose={null}
        >
            <mesh
                receiveShadow
                castShadow
                geometry={nodes.Line001.geometry}
                material={materials["IKE170031_02___Default.001"]}
                position={[0.093, 0, -5.431]}
                scale={0.025}
            />
        </group>
    );
};

useGLTF.preload("/shelf-transformed.glb");
