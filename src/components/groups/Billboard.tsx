import { useRef } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { easeOutLerp } from "@/utils/position";
import { AlbumInfo } from "./AlbumInfo";

const FollowCam = new Vector3(0, 0, -1);

export const Billboard = () => {
    const boardRef = useRef<Group>(null);
    const wrapperRef = useRef<Group>(null);

    useFrame(({ camera }) => {
        if (!boardRef.current || !wrapperRef.current) return;
        camera.attach(boardRef.current);

        easeOutLerp({
            target: boardRef.current.position,
            goal: FollowCam,
            speedFactor: 10,
        });

        boardRef.current.lookAt(camera.position);
        wrapperRef.current.attach(boardRef.current);
    });

    return (
        <group
            name="board wrapper"
            ref={wrapperRef}
            scale={0.4}
        >
            <group
                name="bill board"
                ref={boardRef}
            >
                <AlbumInfo />
            </group>
        </group>
    );
};
