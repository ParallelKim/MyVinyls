import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Cylinder02: THREE.Mesh;
    };
    materials: {
        ["IKEA-Gustav_Desk-3D_Material__8.001"]: THREE.MeshStandardMaterial;
    };
};

export const Desk = (props: JSX.IntrinsicElements["group"]) => {
    const { nodes, materials } = useGLTF("/desk-transformed.glb") as GLTFResult;
    return (
        <group
            position={[25, 0, -4]}
            {...props}
            dispose={null}
        >
            <mesh
                receiveShadow
                geometry={nodes.Cylinder02.geometry}
                material={materials["IKEA-Gustav_Desk-3D_Material__8.001"]}
                scale={0.025}
            />
        </group>
    );
};

useGLTF.preload("/desk-transformed.glb");
