import { useEffect, useRef } from "react";
import { Group } from "three";
import { setRoot } from "@states/refState";
import { TableGroup } from "./models/TableGroup";
import { RoomGroup } from "./models/RoomGroup";
import { AudioGroup } from "./models/AudioGroup";
import { LpPlayer } from "./models/LpPlayer";
import { LpGroup } from "./groups/LpGroup";

export const Scene = () => {
    const rootRef = useRef<Group>(null);

    useEffect(() => {
        if (rootRef.current) {
            setRoot(rootRef.current);
        }
    });

    return (
        <group
            name="root"
            ref={rootRef}
            position={[0, -7.5, -15]}
        >
            <ambientLight
                intensity={2}
                position={[0, 0, 30]}
            />
            <TableGroup scale={5} />
            <RoomGroup scale={5} />
            <AudioGroup scale={5} />
            <LpPlayer />
            <LpGroup />
            {/* <group dispose={null}>
                <ShelfGroup />
                <DeskGroup />
            </group> */}
        </group>
    );
};
