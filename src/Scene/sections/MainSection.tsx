import { SCENE_SETTINGS } from "@constants/sceneConstants";
import { Billboard } from "@components/groups/Billboard";
import { LpGroup } from "@components/groups/LpGroup";
import { AudioGroup } from "@components/models/AudioGroup";
import { LpPlayer } from "@components/models/LpPlayer";
import { RoomGroup } from "@components/models/RoomGroup";
import { TableGroup } from "@components/models/TableGroup";

const { DEFAULT_SCALE } = SCENE_SETTINGS;

export const MainSection = () => {
  return (
    <group>
      <RoomGroup scale={DEFAULT_SCALE}>
        <AudioGroup />
        <TableGroup>
          <LpPlayer />
        </TableGroup>
        <LpGroup />
      </RoomGroup>
      <Billboard />
    </group>
  );
};
