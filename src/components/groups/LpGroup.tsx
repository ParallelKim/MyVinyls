import { useEffect, useRef } from "react";

import { CHIE } from "@constants/chie";
import { setShelf } from "@states/refState";
import { Group } from "three";
import { CustomLp } from "../models/CustomLp";

export const LpGroup = () => {
    const shelfRef = useRef<Group>(null);

    useEffect(() => {
        if (shelfRef.current) {
            setShelf(shelfRef.current);
        }
    }, []);

    return (
        <group
            name="lpGroup"
            ref={shelfRef}
            position={[4, 17.5, 1.8]}
            rotation={[0, Math.PI, 0]}
            scale={0.3}
        >
            {CHIE.albums.map((album, idx) => (
                <CustomLp
                    key={album.title}
                    order={idx}
                    parent={shelfRef}
                    album={album}
                />
            ))}
        </group>
    );
};
