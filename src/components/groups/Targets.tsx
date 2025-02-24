import useSceneStore from "@/states/sceneStore";
import { TargetMesh } from "../models/TargetMesh";

export const Targets = () => {
    const { isDebug } = useSceneStore();
    return (
        <group visible={isDebug}>
            <TargetMesh
                name="shelfTarget"
                size={1.5}
                position={[0, 2.1, -2.1]}
            />
            <TargetMesh
                name="lpPlayerTarget"
                size={0.33}
                position={[-0.03, 0.85, -1.28]}
            />
            <TargetMesh
                name="stationTarget"
                size={0.03}
                color="red"
                position={[-0.0565, 0.792, -1.2627]}
            />
        </group>
    );
};
