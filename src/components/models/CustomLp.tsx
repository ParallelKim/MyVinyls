import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
    Euler,
    Group,
    MeshStandardMaterial,
    TextureLoader,
    Vector3,
} from "three";
import { GLTF } from "three-stdlib";

import useAlbumStore from "@states/albumStore";
import useAnimationStore from "@states/animationStore";
import useSceneStore from "@states/sceneStore";
import { Album } from "../../types/Album";
import { easeOutLerp } from "utils/position";

type GLTFResult = GLTF & {
    nodes: {
        ["Box001_Material_#25_0"]: THREE.Mesh;
        ["Box001_Material_#37_0"]: THREE.Mesh;
        ["Box001_Material_#49_0"]: THREE.Mesh;
        ["Box001_Material_#73_0"]: THREE.Mesh;
        ["Cylinder001_Material_#85_0"]: THREE.Mesh;
    };
    materials: {
        Material_25: THREE.MeshStandardMaterial;
        Material_37: THREE.MeshStandardMaterial;
        Material_49: THREE.MeshStandardMaterial;
        Material_73: THREE.MeshStandardMaterial;
        Material_85: THREE.MeshStandardMaterial;
    };
};

const RECORD_POS = {
    init: new Vector3(0.5, 0, 0),
    focus: new Vector3(-0.5, 0, 0),
    play: new Vector3(0, 0, 0),
};

const COVER_POS = {
    init: new Vector3(0, 0, 0),
    focus: new Vector3(-5, 0, 0),
    play: new Vector3(-50, 0, 0),
};

const gap = 8.9;

export function CustomLp({ album, order }: { album: Album; order: number }) {
    const { nodes, materials } = useGLTF("/lpRecord-transformed.glb") as GLTFResult;
    const groupRef = useRef<Group>(null);
    const coverRef = useRef<Group>(null);
    const recordRef = useRef<Group>(null);

    const root = useSceneStore((state) => state.root);
    const { setAlbum } = useAlbumStore();
    const { currentAnim, setCurrentAnim } = useAnimationStore();

    useFrame(() => {
        if (!groupRef.current || !coverRef.current || !recordRef.current) return;

        const targetCoverPos = COVER_POS[currentAnim as keyof typeof COVER_POS] || COVER_POS.init;
        const targetRecordPos = RECORD_POS[currentAnim as keyof typeof RECORD_POS] || RECORD_POS.init;

        easeOutLerp({
            target: coverRef.current.position,
            goal : targetCoverPos,
            speedFactor: 0.1
        });
        easeOutLerp({
            target: recordRef.current.position,
            goal : targetRecordPos,
            speedFactor: 0.1
        });
    });

    const handleClick = async (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!root || currentAnim === "play") return;

        setAlbum(album);
        setCurrentAnim("focus");

        const targetRotation = new Euler(
            0,
            Math.PI + Math.PI / 2,
            0
        );

        if (root && groupRef.current) {
            root.rotation.y = targetRotation.y;
        }
    };

    return (
        <group
            ref={groupRef}
            position-z={order * gap}
            onClick={handleClick}
        >
            <group ref={coverRef}>
                <mesh
                    geometry={nodes["Box001_Material_#25_0"].geometry}
                    material={materials.Material_25}
                />
                <mesh
                    geometry={nodes["Box001_Material_#37_0"].geometry}
                    material={
                        new MeshStandardMaterial({
                            map: new TextureLoader().load(album.cover),
                        })
                    }
                />
                <mesh
                    geometry={nodes["Box001_Material_#49_0"].geometry}
                    material={materials.Material_49}
                />
                <mesh
                    geometry={nodes["Box001_Material_#73_0"].geometry}
                    material={materials.Material_73}
                />
            </group>
            <group ref={recordRef}>
                <mesh
                    geometry={nodes["Cylinder001_Material_#85_0"].geometry}
                    material={materials.Material_85}
                />
            </group>
        </group>
    );
}

useGLTF.preload("/lpRecord-transformed.glb");
