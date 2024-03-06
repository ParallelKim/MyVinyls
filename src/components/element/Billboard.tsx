import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";

import { useFrame } from "@react-three/fiber";
import { setObject } from "@states/refState";
import { easeOutLerp } from "utils/position";
import { AlbumInfo } from "./AlbumInfo";

const LookAtPos = new Vector3(1);

export const Billboard = () => {
    const boardRef = useRef<Group>(null);
    const wrapperRef = useRef<Group>(null);

    const FollowCam = new Vector3(-1, 0, -6);

    useFrame(({ camera }) => {
        if (!boardRef.current || !wrapperRef.current) return;
        camera.attach(boardRef.current);

        easeOutLerp({
            target: boardRef.current.position,
            goal: FollowCam,
            speedFactor: 0.5,
        });
        boardRef.current.lookAt(camera.position.clone().add(LookAtPos));

        wrapperRef.current.attach(boardRef.current);
    });

    useEffect(() => {
        if (boardRef.current) setObject("board", boardRef.current);
    });

    // 1. Album Panel // 2. LP Cover // 3. LP Record
    return (
        <group
            name="board wrapper"
            ref={wrapperRef}
            scale={0.2}
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
