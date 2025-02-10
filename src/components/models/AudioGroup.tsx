import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Plane002_baked: THREE.Mesh;
        Plane002_baked_1: THREE.Mesh;
    };
    materials: {
        ["Material.002_baked"]: THREE.MeshPhysicalMaterial;
        ["Audio Body_baked"]: THREE.MeshPhysicalMaterial;
    };
};

export const AudioGroup = (props: JSX.IntrinsicElements["group"]) => {
    const { nodes, materials } = useGLTF(
        "/audio-transformed.glb"
    ) as GLTFResult;
    return (
        <group
            {...props}
            dispose={null}
        >
            <group
                position={[-0.5, 0.043, 0.091]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={0.2}
            >
                <mesh
                    geometry={nodes.Plane002_baked.geometry}
                    material={materials["Material.002_baked"]}
                />
                <mesh
                    geometry={nodes.Plane002_baked_1.geometry}
                    material={materials["Audio Body_baked"]}
                />
            </group>
        </group>
    );
};

useGLTF.preload("/audio-transformed.glb");
