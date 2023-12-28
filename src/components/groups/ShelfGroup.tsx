import { useRef } from "react";
import { Group } from "three";
// import { LpWithCover } from "../models/LpWithCover";
import { Shelf } from "../models/Shelf";
import { CustomLp } from "../models/CustomLp";
import { JUNGWOO } from "../../constants/jungwoo";

export const ShelfGroup = () => {
    const shelfRef = useRef<Group>(null);

    return (
        <group ref={shelfRef}>
            <Shelf />
            {/* <LpWithCover parent={shelfRef} /> */}
            {JUNGWOO.albums.map((album, idx) => (
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
