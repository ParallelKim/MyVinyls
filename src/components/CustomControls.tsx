import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

import { useThree } from "@react-three/fiber";
import useSceneStore from "@/states/sceneStore";

const CAMERA_SETTINGS = {
    INIT: {
        minAzimuthAngle: -Math.PI / 6,
        maxAzimuthAngle: Math.PI / 6,
        minPolarAngle: Math.PI / 2 - Math.PI / 6,
        maxPolarAngle: Math.PI / 2 + Math.PI / 6,
        minDistance: 0.1, // 2 when Focus on Shelf
        maxDistance: 6,
        restThreshold: 0.005,
        smoothTime: 0.5,
        truckSpeed: 0.1,
    },
    LP_PLAYING: {
        minDistance: 0.5,
        maxDistance: 6,
        restThreshold: 0.005,
        smoothTime: 0.5,
    },
} as const;

export const CustomControls = () => {
    const ref = useRef<CameraControls>(null);

    const { isDebug } = useSceneStore();
    const scene = useThree((state) => state.scene);

    useEffect(() => {
        if (!ref.current) return;

        const shelfTarget = scene.getObjectByName("shelfTarget");
        const lpPlayerTarget = scene.getObjectByName("lpPlayerTarget");

        if (!shelfTarget || !lpPlayerTarget) return;

        const springBack = async () => {
            if (!ref.current) return;

            ref.current.smoothTime = 0.3;
            await ref.current.reset(true);
            ref.current.smoothTime = 1;
        };

        const init = async () => {
            if (!ref.current) return;
            ref.current.disconnect();
            await ref.current.fitToBox(lpPlayerTarget, true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await ref.current.fitToBox(shelfTarget, true);
            await Promise.all([
                ref.current.rotate(0, -Math.PI / 12, true),
                ref.current.elevate(-0.15, true),
            ]);
            ref.current.saveState();
            ref.current.connect(document.body);

            if (isDebug) return;
            ref.current.addEventListener("sleep", springBack);
        };

        setTimeout(init, 0); // NOTE: 바운딩 박스가 비동기적으로 초기화되기 때문에 스레드 분리 필요
    }, []);

    return (
        <CameraControls
            ref={ref}
            makeDefault
            {...(isDebug ? {} : CAMERA_SETTINGS.INIT)}
        />
    );
};
