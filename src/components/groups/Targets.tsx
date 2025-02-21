import { TargetMesh } from "../models/TargetMesh";

export const Targets = () => {
    // const isDebug = true;
    const isDebug = false;

    return (
        <group visible={isDebug}>
            <TargetMesh
                name="shelfTarget"
                planeArgs={[2, 2]}
                position={[0, 2.7, -1.5]}
            />
        </group>
    );
};
