import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

import useSceneStore from "@/states/sceneStore";
import { useThree } from "@react-three/fiber";

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
    const scene = useThree(({ scene }) => scene);

    const { isDebug } = useSceneStore();

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
            const controls = ref.current;
            if (!controls) return;
            controls.disconnect();
            controls.moveTo(0, 2, 0);
            await controls.fitToBox(lpPlayerTarget, true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await controls.fitToBox(shelfTarget, true);
            controls.smoothTime = 0.25;
            await Promise.all([
                controls.rotate(0, -Math.PI / 12, true),
                controls.elevate(-0.15, true),
            ]);
            controls.smoothTime = 0.5;
            controls.saveState();
            controls.connect(document.body);

            if (isDebug) return;
            controls.addEventListener("sleep", springBack);
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
