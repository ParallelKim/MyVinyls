import { albumState, setAlbum } from "@states/album";
import {
    Euler,
    Group,
    MeshStandardMaterial,
    TextureLoader,
    Vector3,
} from "three";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { refState } from "@states/refState";
import { useRef } from "react";
import { GLTF } from "three-stdlib";
import { easeOutLerp } from "transform/position";
import { useSnapshot } from "valtio";
import { Album } from "../../types/Album";

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
    init: new Vector3(0.5, 0, 0.03),
    focus: new Vector3(4.5, 0, 0.03),
};

// const Origin = new Vector3(0, 0, 0);

const gap = 8.9;

const temp = new Vector3();

export const CustomLp = ({ album, order }: { album: Album; order: number }) => {
    const { nodes, materials } = useGLTF(
        "/lpRecord-transformed.glb"
    ) as GLTFResult;
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(album.cover);
    const customMaterial: MeshStandardMaterial = materials.Material_25.clone();
    customMaterial.map = texture;

    const INIT_STATE: {
        rotation: Euler;
        position: Vector3;
    } = {
        rotation: new Euler(-Math.PI / 8, 0, 0),
        position: new Vector3(gap * order, 0, 0),
    };

    const snap = useSnapshot(albumState);
    const isFocus = snap.album?.id === album.id;

    const lpRef = useRef<Group>(null);

    useFrame(({ camera }) => {
        if (!lpRef.current || !refState.board || !refState.shelf) return;

        if (isFocus) {
            refState.board.getWorldPosition(temp);
            lpRef.current.parent?.worldToLocal(temp);

            easeOutLerp(lpRef.current.position, temp);
            lpRef.current.lookAt(
                camera.position.clone().add(new Vector3(1, 0, 0))
            );
        } else {
            lpRef.current.position.copy(INIT_STATE.position);
            lpRef.current.rotation.copy(INIT_STATE.rotation);
        }
    });

    return (
        <group
            name={"lpOBJ-" + album.id}
            ref={lpRef}
            position={[gap * order, 0, 0]}
            rotation={INIT_STATE.rotation}
            onClick={(e) => {
                e.stopPropagation();

                if (e.delta <= 2) {
                    if (isFocus) {
                        setAlbum(null);
                    } else {
                        setAlbum(album);
                    }
                }
            }}
            scale={0.722}
            dispose={null}
        >
            <group
                name="cover"
                position={[-0.025, 0, 0]}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Box001_Material_#25_0"].geometry}
                    material={customMaterial}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Box001_Material_#37_0"].geometry}
                    material={materials.Material_37}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Box001_Material_#49_0"].geometry}
                    material={materials.Material_49}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Box001_Material_#73_0"].geometry}
                    material={materials.Material_73}
                />
            </group>
            <mesh
                name="record"
                castShadow
                receiveShadow
                geometry={nodes["Cylinder001_Material_#85_0"].geometry}
                material={materials.Material_85}
                position={RECORD_POS.init}
                scale={4.5}
            />
        </group>
    );
};

useGLTF.preload("/lpRecord-transformed.glb");
