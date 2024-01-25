import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Mesh043: THREE.Mesh;
        Mesh043_1: THREE.Mesh;
        Mesh043_2: THREE.Mesh;
        Mesh043_3: THREE.Mesh;
        table_1: THREE.Mesh;
        table_2: THREE.Mesh;
        table_3: THREE.Mesh;
    };
    materials: {
        ["20 - Default.001"]: THREE.MeshStandardMaterial;
        PaletteMaterial002: THREE.MeshStandardMaterial;
        PaletteMaterial001: THREE.MeshStandardMaterial;
        ["14 - Default.001"]: THREE.MeshStandardMaterial;
        PaletteMaterial003: THREE.MeshPhysicalMaterial;
        PaletteMaterial004: THREE.MeshPhysicalMaterial;
        PaletteMaterial005: THREE.MeshPhysicalMaterial;
    };
};

export const TableGroup = (props: JSX.IntrinsicElements["group"]) => {
    const { nodes, materials } = useGLTF(
        "/table-transformed.glb"
    ) as GLTFResult;
    return (
        <group
            {...props}
            dispose={null}
        >
            <group
                position={[-0.589, 5.171, 0.086]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={-1}
            >
                <mesh
                    geometry={nodes.Mesh043.geometry}
                    material={materials["20 - Default.001"]}
                />
                <mesh
                    geometry={nodes.Mesh043_1.geometry}
                    material={materials.PaletteMaterial002}
                />
                <mesh
                    geometry={nodes.Mesh043_2.geometry}
                    material={materials.PaletteMaterial001}
                />
                <mesh
                    geometry={nodes.Mesh043_3.geometry}
                    material={materials["14 - Default.001"]}
                />
            </group>
            <group scale={0.001}>
                <mesh
                    geometry={nodes.table_1.geometry}
                    material={materials.PaletteMaterial003}
                />
                <mesh
                    geometry={nodes.table_2.geometry}
                    material={materials.PaletteMaterial004}
                />
                <mesh
                    geometry={nodes.table_3.geometry}
                    material={materials.PaletteMaterial005}
                />
            </group>
        </group>
    );
};

useGLTF.preload("/table-transformed.glb");
