import { SCENE_SETTINGS } from "@/constants/sceneConstants";
import { Billboard } from "@/components/groups/Billboard";
import { LpGroup } from "@/components/groups/LpGroup";
import { SceneModel } from "@/components/models/SceneModel";

const { DEFAULT_SCALE } = SCENE_SETTINGS;

export const MainSection = () => {
    return (
        <group>
            <SceneModel scale={DEFAULT_SCALE}>
                <LpGroup />
            </SceneModel>
            <Billboard />
        </group>
    );
};
