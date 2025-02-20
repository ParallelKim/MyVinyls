import { LpGroup } from "@/components/groups/LpGroup";
import { SceneModel } from "@/components/models/SceneModel";
import { SCENE_SETTINGS } from "../constants/sceneConstants";
import { Billboard } from "./groups/Billboard";

const { ROOT_POSITION, AMBIENT_LIGHT } = SCENE_SETTINGS;

export const Scene = () => {
    return (
        <group
            name="root"
            position={ROOT_POSITION}
        >
            <ambientLight
                intensity={AMBIENT_LIGHT.INTENSITY}
                position={AMBIENT_LIGHT.POSITION}
            />
            <SceneModel>
                <LpGroup />
            </SceneModel>
            <Billboard />
        </group>
    );
};
