import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useRef } from "react";
import {
    Euler,
    Group,
    MeshStandardMaterial,
    Object3D,
    Object3DEventMap,
    TextureLoader,
    Vector3,
} from "three";
import { Album } from "../../types/Album";

import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useSnapshot } from "valtio";
import { albumState, setAlbum } from "@states/album";

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

const FollowCam = new Object3D();

export const CustomLp = ({
    album,
    order,
}: {
    album: Album;
    order: number;
    parent: RefObject<Group<Object3DEventMap>>;
}) => {
    const INIT_STATE: {
        rotation: Euler;
        position: Vector3;
    } = {
        rotation: new Euler(-Math.PI / 8, 0, 0),
        position: new Vector3(8.9 * order, 0, 0),
    };

    const snap = useSnapshot(albumState);
    const isFocus = snap.album?.id === album.id;

    const camera = useThree((state) => state.camera);

    const lpRef = useRef<Group>(null);

    const { nodes, materials } = useGLTF(
        "/lpRecord-transformed.glb"
    ) as GLTFResult;
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(album.cover);
    const customMaterial: MeshStandardMaterial = materials.Material_25.clone();
    customMaterial.map = texture;

    useFrame(() => {
        if (!lpRef.current) return;
        const record = lpRef.current.children.find(
            (ch) => ch.name === "record"
        );
        if (!record) return;
        if (!camera) return;

        FollowCam.position.copy(camera.position);
        const positionRelativeToCamera = new Vector3(2, -5, -15);
        FollowCam.position.add(
            positionRelativeToCamera.applyQuaternion(camera.quaternion)
        );

        if (isFocus) {
            const dis = FollowCam.position.distanceTo(lpRef.current.position);
            const speed = Math.min(0.1, 1 / dis);

            lpRef.current.position.lerp(FollowCam.position, speed);
            lpRef.current.lookAt(
                camera.position.clone().add(new Vector3(-2.8, -0.5))
            );

            if (dis < 3) {
                record.position.lerp(RECORD_POS.focus, 2 * speed);
            }
        } else {
            const dis = INIT_STATE.position.distanceTo(lpRef.current.position);
            const speed = Math.min(0.1, 2 / dis);

            lpRef.current.position.lerp(INIT_STATE.position, speed);
            lpRef.current.rotation.copy(INIT_STATE.rotation);

            record.position.lerp(RECORD_POS.init, speed);
        }
    });

    return (
        <group
            name={"lpOBJ-" + album.id}
            ref={lpRef}
            position={[8.9 * order, 0, 0]}
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
            renderOrder={10}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Box001_Material_#25_0"].geometry}
                material={customMaterial}
                position={[-0.025, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Box001_Material_#37_0"].geometry}
                material={materials.Material_37}
                position={[-0.025, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Box001_Material_#49_0"].geometry}
                material={materials.Material_49}
                position={[-0.025, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Box001_Material_#73_0"].geometry}
                material={materials.Material_73}
                position={[-0.025, 0, 0]}
            />
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

useGLTF.preload("/lpCover-transformed.glb");
