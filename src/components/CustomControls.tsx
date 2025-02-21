import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

import usePlayerStore from "@/states/playerStore";
import { useThree } from "@react-three/fiber";

const CAMERA_SETTINGS = {
    INIT: {
        minAzimuthAngle: -Math.PI / 6,
        maxAzimuthAngle: Math.PI / 6,
        minPolarAngle: Math.PI / 2 - Math.PI / 6,
        maxPolarAngle: Math.PI / 2 + Math.PI / 6,
        minDistance: 3,
        maxDistance: 5,
        restThreshold: 0.005,
        smoothTime: 0.5,
    },
} as const;

export const CustomControls = () => {
    const ref = useRef<CameraControls>(null);
    const isDebug = true;

    const { isPlaying } = usePlayerStore();
    const scene = useThree((state) => state.scene);

    useEffect(() => {
        if (!ref.current) return;

        const shelfTarget = scene.getObjectByName("shelfTarget");
        if (!shelfTarget) return;

        const init = async () => {
            if (!ref.current) return;
            await ref.current.fitToBox(shelfTarget, true);
            ref.current.rotate(0, -Math.PI / 12, true);
            ref.current.saveState();
        };

        setTimeout(init, 0); // NOTE: 바운딩 박스가 비동기적으로 초기화되기 때문에 스레드 분리 필요

        const springBack = async () => {
            if (!ref.current) return;

            ref.current.smoothTime = 0.3;
            await ref.current.reset(true);
            ref.current.smoothTime = 1;
        };

        ref.current.addEventListener("sleep", springBack);
    }, []);

    return (
        <CameraControls
            ref={ref}
            makeDefault
            // enabled={!isPlaying}
            {...CAMERA_SETTINGS.INIT}
        />
    );
};
