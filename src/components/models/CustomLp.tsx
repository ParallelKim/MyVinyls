import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useRef, useState } from "react";
import { Euler, Group, Object3DEventMap, TextureLoader, Vector3 } from "three";
import { Album } from "../../types/Album";

import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

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
    position: Vector3;
    rotation: Euler;
} = {
    position: new Vector3(-4.3, 31.2, -2),
    rotation: new Euler(-Math.PI / 8, 0, 0),
};

const OFFSET = new Vector3(0, 0, -20);

export const CustomLp = ({
    album,
    parent,
}: {
    album: Album;
    parent: RefObject<Group<Object3DEventMap>>;
}) => {
    const [isFocus, setIsFocus] = useState(false);
    const lp = useRef<Group>(null);

    const { camera, scene } = useThree();
    const temp = new Vector3();

    useFrame(() => {
        if (!lp.current) return;
        if (isFocus) {
            if (parent.current && lp.current.parent === parent.current) {
                lp.current.rotation.set(0, 0, 0);
                temp.copy(lp.current.position);
                temp.y -= 22;
                camera.worldToLocal(temp);
                lp.current.position.copy(temp);

                camera.add(lp.current);
                scene.add(camera);
            }

            lp.current.position.lerp(OFFSET, 0.05);
            lp.current.lookAt(camera.position);
        } else {
            if (parent.current && lp.current.parent !== parent.current) {
                parent.current.add(lp.current);
                lp.current.position.copy(INIT_STATE.position);
                lp.current.rotation.copy(INIT_STATE.rotation);
            }
        }
    });

    const { nodes, materials } = useGLTF(
        "/lpCover-transformed.glb"
    ) as GLTFResult;

    const texture = new TextureLoader().load(album.cover);

    console.log(materials.Material_25);
    materials.Material_25.map = texture;

    return (
        <group
            ref={lp}
            {...INIT_STATE}
            onClick={() => {
                setIsFocus(!isFocus);
            }}
            scale={19}
            dispose={null}
        >
            <mesh
                geometry={nodes["Box001_Material_#25_0"].geometry}
                material={materials.Material_25}
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
        </group>
    );
};

useGLTF.preload("/lpCover-transformed.glb");
