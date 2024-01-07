import { Desk } from "@components/models/Desk";
import { LpPlayer } from "@components/models/LpPlayer";
import { Tablet } from "@components/models/Tablet";

export const DeskGroup = () => {
    return (
        <group position={[0, 0, 1.5]}>
            <Desk />
            <LpPlayer />
            <Tablet />
        </group>
    );
};
