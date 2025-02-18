import { useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Group, MeshStandardMaterial } from "three";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";

import useAnimationStore from "@/states/animationStore";
import { eventManager } from "@/Scene/animations/EventManager";
import { focusLp, returnLp } from "Scene/animations/lp";

import { Album } from "@/types/Album";

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
    // asset data
    const { nodes, materials } = useGLTF(
        "/lpRecord-transformed.glb"
    ) as GLTFResult;
    const albumTexture = useTexture(album.cover);
    const coverMaterial = useMemo(() => {
        return new MeshStandardMaterial({ map: albumTexture });
    }, [albumTexture]);

    const lpState = useRef<"idle" | "focus" | "returning">("idle");
    const groupRef = useRef<Group>(null);
    const { currentAnim } = useAnimationStore();
    const { camera } = useThree();

    // 각 CustomLp가 자신의 애니메이션을 업데이트함
    useFrame(() => {
        if (lpState.current === "idle") return;
        if (groupRef.current) {
            const coverRef = groupRef.current.getObjectByName("cover") as Group;
            const recordRef = groupRef.current.getObjectByName(
                "record"
            ) as Group;

            if (lpState.current === "focus") {
                focusLp(camera, groupRef.current, coverRef, recordRef);
            } else if (lpState.current === "returning") {
                returnLp(groupRef.current, coverRef, recordRef, order, () => {
                    lpState.current = "idle";
                });
            }
        }
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!groupRef.current || currentAnim === "playing") return;

        const isSelected = eventManager.isSelected(album.id);

        if (isSelected) {
            lpState.current = "returning";
            eventManager.unselect();
        } else {
            lpState.current = "focus";
            eventManager.select(album, () => {
                lpState.current = "returning";
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
