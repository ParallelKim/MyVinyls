import { useEffect, useRef } from "react";
import { Group } from "three";

import { SCENE_SETTINGS } from "../constants/sceneConstants";
import useSceneStore from "../states/sceneStore";
import { Billboard } from "./element/Billboard";
import { YTPlayer } from "./element/YTPlayer";
import { LpGroup } from "./groups/LpGroup";
import { AudioGroup } from "./models/AudioGroup";
import { LpPlayer } from "./models/LpPlayer";
import { RoomGroup } from "./models/RoomGroup";
import { TableGroup } from "./models/TableGroup";

const { ROOT_POSITION, AMBIENT_LIGHT, DEFAULT_SCALE } = SCENE_SETTINGS;

export const Scene = () => {
    const rootRef = useRef<Group>(null);
    const setRoot = useSceneStore((state) => state.setRoot);

    useEffect(() => {
        if (rootRef.current) {
            setRoot(rootRef.current);
        }
        
        return () => {
            setRoot(null);
        };
    }, [setRoot]);

    return (
        <group
            name="root"
            ref={rootRef}
            position={ROOT_POSITION}
        >
            <ambientLight
                intensity={AMBIENT_LIGHT.INTENSITY}
                position={AMBIENT_LIGHT.POSITION}
            />
            <TableGroup scale={DEFAULT_SCALE} />
            <RoomGroup scale={DEFAULT_SCALE} />
            <AudioGroup scale={DEFAULT_SCALE} />
            <LpPlayer />
            <LpGroup />
            <YTPlayer />
            <Billboard />
        </group>
    );
};
