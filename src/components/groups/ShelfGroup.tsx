import { useEffect, useRef } from "react";
import { Group } from "three";
import { Shelf } from "../models/Shelf";
import { CustomLp } from "../models/CustomLp";
import { JUNGWOO } from "../../constants/jungwoo";
import { setShelf } from "@states/refState";

export const ShelfGroup = () => {
    const shelfRef = useRef<Group>(null);

    useEffect(() => {
        if (shelfRef.current) {
            setShelf(shelfRef.current);
        }
    }, []);

    return (
        <group>
            <group ref={shelfRef}>
                <Shelf />
            </group>
            <group
                name="lpGroup"
                position={[-4.76, 30.7, -4]}
            >
                {JUNGWOO.albums.map((album, idx) => (
                    <CustomLp
                        key={album.title}
                        order={idx}
                        parent={shelfRef}
                        album={album}
                    />
                ))}
            </group>
        </group>
    );
};
