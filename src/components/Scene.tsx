import { LpGroup } from "@/components/groups/LpGroup";
import { SceneModel } from "@/components/models/SceneModel";
import { SCENE_SETTINGS } from "../constants/sceneConstants";
import { Billboard } from "./groups/Billboard";
import { Targets } from "./groups/Targets";
import { YTPlayer } from "./groups/YTPlayer";
import { Player } from "./models/Player";

const { ROOT_POSITION, AMBIENT_LIGHT } = SCENE_SETTINGS;

export const Scene = () => {
    return (
        <group
            name="root"
            position={ROOT_POSITION}
        >
            <SceneModel />
            <LpGroup />
            <YTPlayer />
            <Player />
            <ambientLight
                intensity={AMBIENT_LIGHT.INTENSITY}
                position={AMBIENT_LIGHT.POSITION}
                castShadow
            />
            <Billboard />
            <Targets />
        </group>
    );
};
