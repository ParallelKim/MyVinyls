import { useEffect, useRef } from "react";
import { Group } from "three";

import { SCENE_SETTINGS } from "../constants/sceneConstants";
import useSceneStore from "../states/sceneStore";

import { MainSection } from "./sections/MainSection";

const { ROOT_POSITION, AMBIENT_LIGHT } = SCENE_SETTINGS;

export const Scene = () => {
    const rootRef = useRef<Group>(null);
    const setRoot = useSceneStore((state) => state.setRoot);

    useEffect(() => {
        if (rootRef.current) {
            setRoot(rootRef.current);
        }
        
        return () => {
            setRoot(null);
        };
    }, [setRoot]);

    return (
        <group
            name="root"
            ref={rootRef}
            position={ROOT_POSITION}
        >
            <ambientLight
                intensity={AMBIENT_LIGHT.INTENSITY}
                position={AMBIENT_LIGHT.POSITION}
            />
            <MainSection />
        </group>
    );
};
