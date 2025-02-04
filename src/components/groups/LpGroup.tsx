import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import { JUNGWOO } from "@constants/jungwoo";
import useSceneStore from "@states/sceneStore";
import useAnimationStore from "@states/animationStore";
import { CustomLp } from "../models/CustomLp";
import { LpAnimationManager } from "../../Scene/animations/core/LpAnimationManager";
import { lpEventManager } from "../../Scene/animations/core/LpEventManager";

export const LpGroup = () => {
    const shelfRef = useRef<Group>(null);
    const setRoot = useSceneStore((state) => state.setRoot);
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

    // LP 선택 이벤트 구독
    useEffect(() => {
        const unsubscribe = lpEventManager.subscribe((event) => {
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
            } else if (event.type === "LP_UNSELECTED") {
                selectedRefs.current = {
                    lpGroup: null,
                    coverRef: null,
                    recordRef: null,
                };
                initialState.current = null;
            }
        });

        return () => unsubscribe();
    }, []);

    // 선택된 LP만 애니메이션 업데이트
    useFrame(({ camera }, delta) => {
        const { lpGroup, coverRef, recordRef } = selectedRefs.current;
        if (!lpGroup || !coverRef || !recordRef) return;

        animationManager.current.update({
            delta,
            currentAnim,
            camera,
            lpGroup,
            coverRef,
            recordRef,
            isSelected: true,
            initialState: initialState.current,
        });
    });

    useEffect(() => {
        if (shelfRef.current) {
            setRoot(shelfRef.current);
        }
        return () => setRoot(null);
    }, [setRoot]);

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
