import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import { JUNGWOO } from "@constants/jungwoo";
import useSceneStore from "@states/sceneStore";
import useAnimationStore from "@states/animationStore";
import { CustomLp } from "../models/CustomLp";
import { LpAnimationManager } from "../../Scene/animations/core/LpAnimationManager";
import { eventManager } from "Scene/animations/AnimationEngine";

export const LpGroup = () => {
    const shelfRef = useRef<Group>(null);
    const { station, setShelf } = useSceneStore();

    const { currentAnim } = useAnimationStore();
    const animationManager = useRef<LpAnimationManager>(
        new LpAnimationManager()
    );

    // 선택된 LP의 ref들을 관리
    const selectedRefs = useRef<{
        lpGroup: Group | null;
        coverRef: Group | null;
        recordRef: Group | null;
    }>({
        lpGroup: null,
        coverRef: null,
        recordRef: null,
    });

    // 선택된 LP의 초기 상태를 저장
    const initialState = useRef<{
        position: Vector3;
        rotation: Vector3;
    } | null>(null);

    // LP의 선택 상태를 관리하는 플래그 (deselection 애니메이션 처리를 위해 사용)
    const isSelectedRef = useRef<boolean>(false);

    // LP 선택 이벤트 구독 및 설정
    useEffect(() => {
        const unsubscribe = eventManager.subscribe((event) => {
            if (event.type === "LP_SELECTED") {
                const lpGroup = shelfRef.current?.getObjectByName(
                    `lpOBJ-${event.payload.lpId}`
                );
                if (!lpGroup) return;

                // 선택 시점의 초기 상태 저장
                initialState.current = {
                    position: lpGroup.position.clone(),
                    rotation: new Vector3().setFromEuler(lpGroup.rotation),
                };

                selectedRefs.current = {
                    lpGroup: lpGroup as Group,
                    coverRef: lpGroup.getObjectByName("cover") as Group,
                    recordRef: lpGroup.getObjectByName("record") as Group,
                };
                isSelectedRef.current = true; // 선택 상태로 설정
            } else if (event.type === "LP_UNSELECTED") {
                // deselect 시 LP 참조는 유지하여 deselection 애니메이션이 진행되도록 함
                isSelectedRef.current = false;
                // (필요에 따라 애니메이션 완료 후 selectedRefs 및 initialState를 초기화할 수 있음)
            }
        });

        return () => unsubscribe();
    }, []);

    // LP 애니메이션 업데이트 (선택 여부와 관계없이 LP가 존재한다면 update 호출)
    useFrame(({ camera }, delta) => {
        const { lpGroup, coverRef, recordRef } = selectedRefs.current;
        if (lpGroup) {
            animationManager.current.update({
                delta,
                currentAnim,
                camera,
                lpGroup,
                coverRef: coverRef!,
                recordRef: recordRef!,
                isSelected: isSelectedRef.current,
                initialState: initialState.current,
                station: station!,
            });
        }
    });

    useEffect(() => {
        if (shelfRef.current) {
            setShelf(shelfRef.current);
        }
        return () => setShelf(null);
    }, [setShelf]);

    return (
        <group
            name="lpGroup"
            ref={shelfRef}
            position={[0.7, 3.5, 0.35]}
            scale={0.04}
        >
            {JUNGWOO.albums.map((album, idx) => (
                <CustomLp
                    key={album.title}
                    order={idx}
                    album={album}
                />
            ))}
        </group>
    );
};
