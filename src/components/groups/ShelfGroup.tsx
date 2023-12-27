import { useRef } from "react";
import { Group } from "three";
// import { LpWithCover } from "../models/LpWithCover";
import { Shelf } from "../models/Shelf";
import { CustomLp } from "../models/CustomLp";
import { JUNGWOO } from "../../constants/jungwoo";

export const ShelfGroup = () => {
    const shelfRef = useRef<Group>(null);

    return (
        <group>
            <Shelf />
            <group
                ref={shelfRef}
                name="lpGroup"
                position={[-4.27, 30.7, -4]}
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
