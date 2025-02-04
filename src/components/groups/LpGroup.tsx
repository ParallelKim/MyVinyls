import { useEffect, useRef } from "react";
import { Group } from "three";

import { JUNGWOO } from "@constants/jungwoo";
import useSceneStore from "@states/sceneStore";
import { CustomLp } from "../models/CustomLp";

export const LpGroup = () => {
    const shelfRef = useRef<Group>(null);
    const setRoot = useSceneStore((state) => state.setRoot);

    useEffect(() => {
        if (shelfRef.current) {
            setRoot(shelfRef.current);
        }

        return () => {
            setRoot(null);
        };
    }, [setRoot]);

    return (
        <group
            name="lpGroup"
            ref={shelfRef}
            position={[0.7, 3.5, 0.35]}
            scale={0.05}
        >
            {JUNGWOO.albums.map((album, idx) => (
                <CustomLp key={album.title} order={idx} album={album} />
            ))}
        </group>
    );
};
