import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import useSceneStore from "@states/sceneStore";
import { easeOutLerp } from "utils/position";
import { AlbumInfo } from "./AlbumInfo";

export const Billboard = () => {
    const boardRef = useRef<Group>(null);
    const wrapperRef = useRef<Group>(null);
    const { setCurrentRecord } = useSceneStore();

    const FollowCam = new Vector3(0, 0, -6);

    useFrame(({ camera }) => {
        if (!boardRef.current || !wrapperRef.current) return;
        camera.attach(boardRef.current);

        easeOutLerp({
            target: boardRef.current.position,
            goal: FollowCam,
            speedFactor: 10,
        });

        boardRef.current.lookAt(camera.position.clone());

        wrapperRef.current.attach(boardRef.current);
    });

    useEffect(() => {
        if (boardRef.current) {
            setCurrentRecord(boardRef.current);
        }

        return () => {
            setCurrentRecord(null);
        };
    }, [setCurrentRecord]);

    // 1. Album Panel // 2. LP Cover // 3. LP Record
    return (
        <group
            name="board wrapper"
            ref={wrapperRef}
            scale={0.2}
        >
            <group
                position={[0, 70, 0]}
                name="bill board"
                ref={boardRef}
            >
                <AlbumInfo />
            </group>
        </group>
    );
};
