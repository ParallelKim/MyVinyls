import { CameraControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import usePlayerStore from "@/states/playerStore";
import { useFrame } from "@react-three/fiber";

export const CustomControls = () => {
    const ref = useRef<CameraControls>(null);
    const { isPlaying } = usePlayerStore();

    useEffect(() => {
        if (!ref.current) return;

        ref.current.moveTo(0, 2.2, -1.5, true);
        ref.current.rotatePolarTo(1.35, true);
    }, []);

    return (
        <CameraControls
            ref={ref}
            makeDefault
            // enabled={!isPlaying}
            smoothTime={1}
        />
    );
};
