// import useSceneStore from "@/states/sceneStore";
import { TargetMesh } from "../models/TargetMesh";

export const Targets = () => {
    // const { isDebug } = useSceneStore();

    return (
        <group visible={false}>
            <TargetMesh
                name="shelfTarget"
                size={1.5}
                position={[0, 2.1, -2.1]}
            />
            <TargetMesh
                name="lpPlayerTarget"
                size={0.35}
                position={[-0.01, 0.84, -1.28]}
            />
            <TargetMesh
                name="stationTarget"
                size={0.03}
                color="red"
                position={[-0.0555, 0.785, -1.247]}
            />
        </group>
    );
};
