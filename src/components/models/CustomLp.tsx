import { useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Group, MeshStandardMaterial } from "three";
import { GLTF } from "three-stdlib";

import useAnimationStore from "@states/animationStore";
import { Album } from "../../types/Album";
import { unifiedEventManager } from "Scene/animations/AnimationEngine";

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

const gap = -12;

export function CustomLp({ album, order }: { album: Album; order: number }) {
    const { nodes, materials } = useGLTF(
        "/lpRecord-transformed.glb"
    ) as GLTFResult;
    const groupRef = useRef<Group>(null);
    const { currentAnim } = useAnimationStore();

    // useTexture를 사용하여 텍스처 로드
    const albumTexture = useTexture(album.cover);
    const coverMaterial = useMemo(() => {
        return new MeshStandardMaterial({ map: albumTexture });
    }, [albumTexture]);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!groupRef.current || currentAnim === "playing") return;

        const isSelected = unifiedEventManager.isSelected(album.id);
        if (isSelected) {
            unifiedEventManager.unselect();
        } else {
            unifiedEventManager.emit({
                type: "LP_SELECTED",
                payload: {
                    album,
                    lpId: album.id,
                },
            });
        }
    };

    return (
        <group
            name={`lpOBJ-${album.id}`}
            ref={groupRef}
            position-x={order * gap}
            rotation-x={Math.PI / 8}
            onClick={handleClick}
        >
            <group name="cover">
                <mesh
                    geometry={nodes["Box001_Material_#25_0"].geometry}
                    material={materials.Material_25}
                />
                <mesh
                    geometry={nodes["Box001_Material_#37_0"].geometry}
                    material={coverMaterial}
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
            <group
                name="record"
                position-z={0.05}
            >
                <mesh
                    geometry={nodes["Cylinder001_Material_#85_0"].geometry}
                    material={materials.Material_85}
                    scale={4}
                />
            </group>
        </group>
    );
}

useGLTF.preload("/lpRecord-transformed.glb");
