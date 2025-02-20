import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

import usePlayerStore from "@/states/playerStore";

const CAMERA_SETTINGS = {
    INIT: {
        minAzimuthAngle: -Math.PI / 6,
        maxAzimuthAngle: Math.PI / 6,
        minPolarAngle: Math.PI / 2 - Math.PI / 6,
        maxPolarAngle: Math.PI / 2 + Math.PI / 6,
        minDistance: 3,
        maxDistance: 5,
    },
};

export const CustomControls = () => {
    const ref = useRef<CameraControls>(null);
    const { isPlaying } = usePlayerStore();

    useEffect(() => {
        if (!ref.current) return;

        ref.current.moveTo(0, 2.2, -1.5, true);
        ref.current.rotatePolarTo(1.35, true);
        ref.current.saveState();

        ref.current.addEventListener("sleep", async () => {
            if (!ref.current) return;
            ref.current.smoothTime = 0.3;
            await ref.current.reset(true);
            ref.current.smoothTime = 1;
        });
    }, []);

    return (
        <CameraControls
            ref={ref}
            makeDefault
            // enabled={!isPlaying}
            smoothTime={1}
            {...CAMERA_SETTINGS.INIT}
        />
    );
};
