import { useGLTF } from "@react-three/drei";
import { setLpPlayer } from "@states/refState";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Mesh018: THREE.Mesh;
        Mesh018_1: THREE.Mesh;
        Object001: THREE.Mesh;
        Cylinder004: THREE.Mesh;
    };
    materials: {
        PaletteMaterial001: THREE.MeshStandardMaterial;
        PaletteMaterial002: THREE.MeshStandardMaterial;
        ["IKE170031_02___Default.001"]: THREE.MeshStandardMaterial;
        PaletteMaterial003: THREE.MeshStandardMaterial;
    };
};

export const LpPlayer = (props: JSX.IntrinsicElements["group"]) => {
    const { nodes, materials } = useGLTF(
        "/lpPlayer-transformed.glb"
    ) as GLTFResult;

    const lpRef = useRef<Group>(null);

    useEffect(() => {
        if (lpRef.current) {
            setLpPlayer(lpRef.current);
        }
    });

    return (
        <group
            name="lpPlayerOBJ"
            ref={lpRef}
            {...props}
            dispose={null}
            position={[-0.125, 3.31, 0]}
            scale={0.4}
            rotation={[0, Math.PI / 2, 0]}
        >
            <group scale={0.025}>
                <mesh
                    receiveShadow
                    geometry={nodes.Mesh018.geometry}
                    material={materials.PaletteMaterial001}
                />
                <mesh
                    receiveShadow
                    geometry={nodes.Mesh018_1.geometry}
                    material={materials.PaletteMaterial002}
                />
            </group>
            <mesh
                receiveShadow
                geometry={nodes.Object001.geometry}
                material={materials["IKE170031_02___Default.001"]}
                scale={0.025}
            />
            <mesh
                receiveShadow
                geometry={nodes.Cylinder004.geometry}
                material={materials.PaletteMaterial003}
                position={[-0.16, 0.956, -1.538]}
                rotation={[0, 0, 0.175]}
                scale={[0.025, 0.023, 0.025]}
            />
        </group>
    );
};

useGLTF.preload("/lpPlayer-transformed.glb");
