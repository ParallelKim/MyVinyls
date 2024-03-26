import { ThreeEvent, useFrame } from "@react-three/fiber";
import { albumState, setAlbum } from "@states/album";
import { animState, setCurrentAnim } from "@states/animation";
import {
    Euler,
    Group,
    MeshStandardMaterial,
    TextureLoader,
    Vector3,
} from "three";

import { useGLTF } from "@react-three/drei";
import { refState } from "@states/refState";
import { useRef } from "react";
import { GLTF } from "three-stdlib";
import { easeOutLerp } from "utils/position";
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
    init: new Vector3(0.5, 0, 0),
    focus: new Vector3(-0.5, 0, 0),
    play: new Vector3(0, 0, 0),
};

const COVER_POS = {
    init: new Vector3(0, 0, 0),
    focus: new Vector3(-5, 0, 0),
    play: new Vector3(-50, 0, 0),
};

// const Origin = new Vector3(0, 0, 0);

const gap = 8.9;

const FollowCam = new Vector3();
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
        if (
            !lpRef.current ||
            !refState.board ||
            !refState.shelf ||
            !refState.lpPlayer
        )
            return;

        const cover = lpRef.current.getObjectByName("cover");
        const record = lpRef.current.getObjectByName("record");

        if (isFocus) {
            if (!cover || !record) return;

            refState.board.getWorldPosition(FollowCam);
            lpRef.current.parent?.worldToLocal(FollowCam);

            refState.lpPlayer.getWorldPosition(temp);
            record.parent?.worldToLocal(temp);

            if (animState.currentAnim === "focusing") {
                easeOutLerp({
                    target: lpRef.current.position,
                    goal: FollowCam,
                    speedFactor: 10,
                });
                // lp랑 커버 따로 이동시키기
                easeOutLerp({
                    target: cover.position,
                    goal: COVER_POS.focus,
                });
                easeOutLerp({
                    target: record.position,
                    goal: RECORD_POS.focus,
                });
            } else if (animState.currentAnim === "starting") {
                // lpRef.current.quaternion.slerp(new Quaternion(), 0.05);
                easeOutLerp({
                    target: lpRef.current.position,
                    goal: FollowCam,
                    speedFactor: -1,
                });
                easeOutLerp({ target: cover.position, goal: COVER_POS.play });
                easeOutLerp({
                    target: record.position,
                    goal: RECORD_POS.play,
                });
            } else if (animState.currentAnim === "playing") {
                record.rotation.z += (1 / 108) * Math.PI;

                temp.add(new Vector3(-1.4, 0, 2.1));

                easeOutLerp({
                    target: record.position,
                    goal: temp,
                });

                return;
            } else {
                easeOutLerp({
                    target: lpRef.current.position,
                    goal: FollowCam,

                    onUpdate: (dis) => {
                        if (dis < 0.1) setCurrentAnim("focusing");
                    },
                });
            }

            lpRef.current.lookAt(camera.position.clone());
        } else {
            lpRef.current.rotation.copy(INIT_STATE.rotation);

            easeOutLerp({
                target: lpRef.current.position,
                goal: INIT_STATE.position,
            });

            if (!cover || !record) return;
            easeOutLerp({ target: cover.position, goal: COVER_POS.init });
            easeOutLerp({
                target: record.position,
                goal: RECORD_POS.init,
            });
        }
    });

    let timer: number | null = null;

    const onClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();

        if (e.delta <= 2) {
            if (!isFocus) {
                setAlbum(album);
            }

            if (timer) {
                cancelTimer();
            }
        }
    };

    const onPress = () => {
        if (isFocus) {
            timer = setTimeout(onLongPress, 1000);
        }
    };

    const onLongPress = () => {
        setAlbum(null);
        cancelTimer();
    };

    const cancelTimer = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return (
        <group
            name={"lpOBJ-" + album.id}
            ref={lpRef}
            position={[gap * order, 0, 0.03]}
            rotation={INIT_STATE.rotation}
            onClick={onClick}
            onPointerDown={onPress}
            onPointerCancel={cancelTimer}
            onPointerUp={cancelTimer}
            onPointerLeave={cancelTimer}
            onPointerOut={cancelTimer}
            scale={0.722}
            dispose={null}
        >
            <group
                name="cover"
                position={COVER_POS.init}
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
                position={RECORD_POS.init}
                castShadow
                receiveShadow
                geometry={nodes["Cylinder001_Material_#85_0"].geometry}
                material={materials.Material_85}
                scale={4.5}
            />
        </group>
    );
};

useGLTF.preload("/lpRecord-transformed.glb");
