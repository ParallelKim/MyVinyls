import { JUNGWOO } from "@/constants/jungwoo";

import { CustomLp } from "../models/CustomLp";

export const LpGroup = () => {
    return (
        <group
            name="lpGroup"
            position={[-0.8, 3.425, -1.47]}
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
