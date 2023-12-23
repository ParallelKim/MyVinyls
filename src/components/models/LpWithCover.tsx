import { Gltf } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useRef, useState } from "react";
import { Euler, Group, Mesh, Object3DEventMap, Vector3 } from "three";

const INIT_STATE: {
    position: Vector3;
    rotation: Euler;
} = {
    position: new Vector3(-3.5, 24.7, 2),
    rotation: new Euler(-Math.PI / 8, 0, 0),
};

const OFFSET = new Vector3(0, 0, -20);

export const LpWithCover = ({
    parent,
}: {
    parent: RefObject<Group<Object3DEventMap>>;
}) => {
    const [isFocus, setIsFocus] = useState(false);
    const lp = useRef<Mesh>(null);

    const { camera, scene } = useThree();
    const temp = new Vector3();

    useFrame(() => {
        if (!lp.current) return;
        if (isFocus) {
            if (parent.current && lp.current.parent === parent.current) {
                lp.current.rotation.set(0, 0, 0);
                temp.copy(lp.current.position);
                temp.y -= 22;
                camera.worldToLocal(temp);
                lp.current.position.copy(temp);

                camera.add(lp.current);
                scene.add(camera);
            }

            lp.current.position.lerp(OFFSET, 0.05);
            lp.current.lookAt(camera.position);
        } else {
            if (parent.current && lp.current.parent !== parent.current) {
                parent.current.add(lp.current);
                lp.current.position.copy(INIT_STATE.position);
                lp.current.rotation.copy(INIT_STATE.rotation);
            }
        }
    });

    return (
        <mesh
            ref={lp}
            {...INIT_STATE}
        >
            <Gltf
                onClick={() => {
                    setIsFocus(!isFocus);
                }}
                scale={[16, 16, 16]}
                src="/lpCover.glb"
                receiveShadow
                castShadow
            />
            {/* <Gltf
                scale={[16, 16, 16]}
                src="/lpRecord.glb"
                receiveShadow
                castShadow
            /> */}
        </mesh>
    );
};
