import { useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import { Group, MeshStandardMaterial, Vector3 } from "three";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import useSceneStore from "@states/sceneStore";
import { LpAnimationManager } from "Scene/animations/core/LpAnimationManager";

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
    // 애니메이션 관리를 위한 로컬 상태 추가
    const [selected, setSelected] = useState(false);
    const [initialState, setInitialState] = useState<{
        position: Vector3;
        rotation: Vector3;
    } | null>(null);
    const animationManager = useRef(new LpAnimationManager());

    const { nodes, materials } = useGLTF(
        "/lpRecord-transformed.glb"
    ) as GLTFResult;
    const groupRef = useRef<Group>(null);
    const { currentAnim } = useAnimationStore();
    const { camera } = useThree();
    const { station } = useSceneStore();

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

    // 각 CustomLp가 자신이 선택되었는지 전역 이벤트를 통해 감지
    useEffect(() => {
        const unsubscribe = unifiedEventManager.subscribe((event) => {
            if (
                event.type === "LP_SELECTED" &&
                event.payload.lpId === album.id
            ) {
                if (groupRef.current) {
                    setInitialState({
                        position: groupRef.current.position.clone(),
                        rotation: new Vector3().setFromEuler(
                            groupRef.current.rotation
                        ),
                    });
                }
                setSelected(true);
            } else if (
                event.type === "LP_UNSELECTED" &&
                event.payload.lpId === album.id
            ) {
                setSelected(false);
            }
        });
        return () => unsubscribe();
    }, [album.id]);

    // 매 프레임 애니메이션 업데이트: 각 CustomLp가 자신의 애니메이션을 업데이트함
    useFrame((state, delta) => {
        if (groupRef.current) {
            const coverRef = groupRef.current.getObjectByName("cover") as Group;
            const recordRef = groupRef.current.getObjectByName(
                "record"
            ) as Group;
            animationManager.current.update({
                delta,
                currentAnim,
                camera,
                lpGroup: groupRef.current,
                coverRef,
                recordRef,
                isSelected: selected,
                initialState,
                station: station!,
            });
        }
    });

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
