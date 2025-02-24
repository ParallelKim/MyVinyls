import useSceneStore from "@/states/sceneStore";
import { TargetMesh } from "../models/TargetMesh";

export const Targets = () => {
    const { isDebug } = useSceneStore();
    return (
        <group visible={isDebug}>
            <TargetMesh
                name="shelfTarget"
                size={2}
                position={[0, 2.66, -2.3]}
            />
            <TargetMesh
                name="lpPlayerTarget"
                size={0.5}
                position={[0, 0.85, -1.25]}
            />
            <TargetMesh
                name="stationTarget"
                size={0.1}
                color="red"
                position={[-0.045, 0.835, -1.255]}
            />
        </group>
    );
};
