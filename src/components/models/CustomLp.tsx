import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useRef, useState } from "react";
import {
    Euler,
    Group,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3DEventMap,
    TextureLoader,
    Vector3,
} from "three";
import { Album } from "../../types/Album";

import { Center, Text3D, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { currentAlbumAtom } from "../../atoms/currentAlbumAtom";
import { useAtom } from "jotai";

type GLTFResult = GLTF & {
    nodes: {
        ["Box001_Material_#25_0"]: THREE.Mesh;
        ["Box001_Material_#37_0"]: THREE.Mesh;
        ["Box001_Material_#49_0"]: THREE.Mesh;
        ["Box001_Material_#73_0"]: THREE.Mesh;
    };
    materials: {
        Material_25: THREE.MeshStandardMaterial;
        Material_37: THREE.MeshStandardMaterial;
        Material_49: THREE.MeshStandardMaterial;
        Material_73: THREE.MeshStandardMaterial;
    };
};

const INIT_STATE: {
    rotation: Euler;
} = {
    rotation: new Euler(-Math.PI / 8, 0, 0),
};

const OFFSET = new Vector3(0, 0, -20);

export const CustomLp = ({
    album,
    order,
    parent,
}: {
    album: Album;
    order: number;
    parent: RefObject<Group<Object3DEventMap>>;
}) => {
    const [currentAlbum, setCurrentAlbum] = useAtom(currentAlbumAtom);
    const isFocus = currentAlbum?.url === album.url;

    const [isLerped, setIsLerped] = useState(false);
    const lpRef = useRef<Group>(null);

    const { camera, scene } = useThree();
    const temp = new Vector3();

    useFrame(() => {
        if (!lpRef.current) return;
        if (isFocus) {
            if (parent.current && lpRef.current.parent === parent.current) {
                lpRef.current.rotation.set(0, 0, 0);
                temp.copy(lpRef.current.position);
                temp.y += 5;
                temp.x -= 4.27;
                camera.worldToLocal(temp);
                lpRef.current.position.copy(temp);

                camera.add(lpRef.current);
                scene.add(camera);
                setIsLerped(false);
            }

            if (lpRef.current.position.distanceTo(camera.position) < 75) {
                !isLerped && setIsLerped(true);
            }

            lpRef.current.position.lerp(OFFSET, 0.05);
            lpRef.current.lookAt(camera.position);
        } else {
            if (parent.current && lpRef.current.parent !== parent.current) {
                lpRef.current.position.set(8.9 * order, 0, 0);
                lpRef.current.rotation.copy(INIT_STATE.rotation);
                parent.current.add(lpRef.current);
                setIsLerped(false);
            }
        }
    });

    const { nodes, materials } = useGLTF(
        "/lpCover-transformed.glb"
    ) as GLTFResult;
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(album.cover);
    const customMaterial: MeshStandardMaterial = materials.Material_25.clone();
    customMaterial.map = texture;

    return (
        <group
            ref={lpRef}
            position={[8.9 * order, 0, 0]}
            rotation={INIT_STATE.rotation}
            onClick={() => {
                if (isFocus) {
                    console.log("te");
                } else {
                    setCurrentAlbum(album);
                }
            }}
            scale={19}
            dispose={null}
        >
            <mesh
                receiveShadow
                castShadow
                geometry={nodes["Box001_Material_#25_0"].geometry}
                material={customMaterial}
                position={[-0.025, 0, 0]}
                scale={0.038}
            />
            <mesh
                geometry={nodes["Box001_Material_#37_0"].geometry}
                material={materials.Material_37}
                position={[-0.025, 0, 0]}
                scale={0.038}
            />
            <mesh
                geometry={nodes["Box001_Material_#49_0"].geometry}
                material={materials.Material_49}
                position={[-0.025, 0, 0]}
                scale={0.038}
            />
            <mesh
                geometry={nodes["Box001_Material_#73_0"].geometry}
                material={materials.Material_73}
                position={[-0.025, 0, 0]}
                scale={0.038}
            />
            {isLerped && (
                <Center
                    top
                    position={[0, 0.2, 0]}
                >
                    <Text3D
                        font="/Pretendard.json"
                        scale={0.05}
                    >
                        {album.title}
                        <meshToonMaterial color="black" />
                    </Text3D>
                </Center>
            )}
        </group>
    );
};

useGLTF.preload("/lpCover-transformed.glb");
