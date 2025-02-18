import { useEffect, useRef } from "react";
import { Group } from "three";

import { JUNGWOO } from "@/constants/jungwoo";
import useSceneStore from "@/states/sceneStore";

import { CustomLp } from "../models/CustomLp";

export const LpGroup = () => {
    const shelfRef = useRef<Group>(null);
    const { setShelf } = useSceneStore();

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
