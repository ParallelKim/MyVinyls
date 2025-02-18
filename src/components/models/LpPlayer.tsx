import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { GLTF } from "three-stdlib";

import useSceneStore from "@/states/sceneStore";

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
    const stationRef = useRef<Group>(null);
    const { setLpPlayer, setStation } = useSceneStore();

    useEffect(() => {
        if (lpRef.current && stationRef.current) {
            setLpPlayer(lpRef.current);
            setStation(stationRef.current);

            console.log(stationRef.current);
        }

        return () => {
            setLpPlayer(null);
            setStation(null);
        };
    }, [setLpPlayer, setStation]);

    return (
        <group
            name="lpPlayerOBJ"
            ref={lpRef}
            {...props}
            dispose={null}
            position={[-0.025, 0.665, 0]}
            scale={0.002}
            rotation={[0, Math.PI / 2, 0]}
        >
            <mesh
                name="player"
                geometry={nodes.Mesh018.geometry}
                material={materials.PaletteMaterial001}
            />
            <mesh
                name="player-2"
                geometry={nodes.Mesh018_1.geometry}
                material={materials.PaletteMaterial002}
            />
            <mesh
                name="player-3"
                geometry={nodes.Object001.geometry}
                material={materials["IKE170031_02___Default.001"]}
            />
            <mesh
                name="player-4"
                geometry={nodes.Cylinder004.geometry}
                material={materials.PaletteMaterial003}
            />
            <group
                ref={stationRef}
                scale={0.5}
                position={[0.03, 1.5, 0.75]}
            />
        </group>
    );
};

useGLTF.preload("/lpPlayer-transformed.glb");
