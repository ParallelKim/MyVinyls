import { LpGroup } from "@/components/groups/LpGroup";
import { RoomBaked } from "@/components/models/RoomBaked";
import { Billboard } from "./groups/Billboard";
import { Targets } from "./groups/Targets";
import { YTPlayer } from "./groups/YTPlayer";
import { Player } from "./models/Player";
import { SoftShadows } from "@react-three/drei";
import { Speakers } from "./models/Speakers";

const SHADOW_CONFIG = {
    mapSize: 2048,
    bias: -0.00003,
    blur: 3,
    radius: 10,
};

export const Scene = () => {
    return (
        <group name="root">
            <RoomBaked />
            <LpGroup />
            <YTPlayer />
            <Speakers />
            <Player />
            <Billboard />
            <Targets />
            <directionalLight
                position={[-4, 4, 3]}
                intensity={4}
                castShadow
                shadow-mapSize={SHADOW_CONFIG.mapSize}
                shadow-blur={SHADOW_CONFIG.blur}
                shadow-bias={SHADOW_CONFIG.bias}
                shadow-radius={SHADOW_CONFIG.radius}
            />
            <directionalLight
                intensity={2}
                position={[4, 3, 5]}
                castShadow
                shadow-mapSize={SHADOW_CONFIG.mapSize}
                shadow-blur={SHADOW_CONFIG.blur}
                shadow-bias={SHADOW_CONFIG.bias}
                shadow-radius={SHADOW_CONFIG.radius}
            />
            <directionalLight
                position={[0, 1, 2]}
                intensity={0.2}
            />

            <SoftShadows
                focus={1}
                size={3}
            />
        </group>
    );
};
