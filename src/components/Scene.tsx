import { LpGroup } from "@/components/groups/LpGroup";
import { SceneModel } from "@/components/models/SceneModel";
import { SCENE_SETTINGS } from "../constants/sceneConstants";
import { Billboard } from "./groups/Billboard";
import { Targets } from "./groups/Targets";
import { YTPlayer } from "./groups/YTPlayer";

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
            <ambientLight
                intensity={AMBIENT_LIGHT.INTENSITY}
                position={AMBIENT_LIGHT.POSITION}
            />
            <Billboard />
            <Targets />
        </group>
    );
};
