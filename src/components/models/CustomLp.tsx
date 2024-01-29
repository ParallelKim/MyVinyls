import { RefObject, useEffect, useRef, useState } from "react";
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
import { subscribe, useSnapshot } from "valtio";
import { albumState, setAlbum } from "@states/album";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

const gap = 8.9;

export const CustomLp = ({
    album,
    order,
}: {
    album: Album;
    order: number;
    parent: RefObject<Group<Object3DEventMap>>;
}) => {
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
    const [anim, setAnim] = useState<GSAPTimeline>();

    useGSAP(() => {
        if (!lpRef.current) return;

        const anim = gsap
            .timeline({
                onUpdate: () => {},
                id: "lpAnim-" + album.id,
            })
            .to(lpRef.current.position, {
                z: 20,
            })
            .reverse();

        setAnim(anim);
    }, [lpRef.current]);

    // useFrame((e) => {
    //     const { camera, scene } = e;

    //     if (!lpRef.current) return;
    //     const record = lpRef.current.children.find(
    //         (ch) => ch.name === "record"
    //     );
    //     if (!record) return;
    //     if (!camera) return;

    //     scene.attach(camera);
    //     camera.attach(FollowCam);
    //     FollowCam.position.set(0, 0, 5);
    //     FollowCam.quaternion.copy(camera.quaternion);

    //     if (isFocus) {
    //         const dis = FollowCam.position.distanceTo(lpRef.current.position);
    //         const speed = Math.min(0.1, 1 / dis);

    //         lpRef.current.position.lerp(FollowCam.position, speed);
    //         lpRef.current.lookAt(camera.position);

    //         if (dis < 3) {
    //             record.position.lerp(RECORD_POS.focus, 2 * speed);
    //             setCurrentRecord(record);
    //         }
    //     } else {
    //         const dis = INIT_STATE.position.distanceTo(lpRef.current.position);
    //         const speed = Math.min(0.1, 2 / dis);

    //         lpRef.current.position.lerp(INIT_STATE.position, speed);
    //         lpRef.current.rotation.copy(INIT_STATE.rotation);

    //         record.position.lerp(RECORD_POS.init, speed);
    //     }
    // });

    // const bounds = useBounds();
    // useEffect(() => {
    //     if (lpRef.current && order === 0)
    //         bounds.refresh(lpRef.current).clip().fit();
    // });

    return (
        <group
            name={"lpOBJ-" + album.id}
            ref={lpRef}
            position={[gap * order, 0, 0]}
            rotation={INIT_STATE.rotation}
            onClick={(e) => {
                e.stopPropagation();

                console.log(anim);

                if (e.delta <= 2 && anim) {
                    console.log(anim.reversed() ? "reverse" : "play");

                    anim.reversed() ? anim.play() : anim.reverse();

                    if (isFocus) {
                        setAlbum(null);
                    } else {
                        setAlbum({ ...album, lpObject: lpRef.current });
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
