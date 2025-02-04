import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Group } from "three";

import useAlbumStore from "@states/albumStore";
import useAnimationStore from "@states/animationStore";
import useSceneStore from "@states/sceneStore";
import { AnimationStateManager } from "./states/AnimationStateManager";
import { TimelineManager } from "./core/TimelineManager";

type ExtendedGroup = Group & {
    lpPlayer?: Group;
    currentRecord?: Group;
};

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const { player, status, currentIndex, duration, album } = useAlbumStore();
    const { currentAnim, setCurrentAnim, setIsPlaying } = useAnimationStore();
    const root = useSceneStore((state) => state.root) as ExtendedGroup | null;
    const controls = useThree((state) => state.controls) as unknown as CameraControls;

    const timelineManager = useRef<TimelineManager>(new TimelineManager());
    const stateManager = useRef<AnimationStateManager | null>(null);

    // Initialize timeline
    useGSAP(
        () => {
            timelineManager.current.initialize(duration);
        },
        { dependencies: [currentIndex], revertOnUpdate: true }
    );

    // Initialize state manager
    useEffect(() => {
        if (!controls || !root) return;

        stateManager.current = new AnimationStateManager(
            { controls, root },
            setIsPlaying,
            setCurrentAnim
        );
    }, [controls, root, setIsPlaying, setCurrentAnim]);

    // Handle window focus for YouTube sync
    useEffect(() => {
        window.onfocus = async () => {
            if (player) {
                await timelineManager.current.syncWithYouTube(player);
            }
        };

        return () => {
            window.onfocus = null;
        };
    }, [player]);

    // Handle animation state changes
    useEffect(() => {
        if (!stateManager.current) return;
        stateManager.current.handleState(currentAnim);
    }, [currentAnim]);

    // Handle playback state changes
    useEffect(() => {
        timelineManager.current.handlePlaybackStateChange(status);
    }, [status]);

    // Handle song changes
    useEffect(() => {
        timelineManager.current.handleSongChange(currentIndex);

        if (currentIndex === null && !album) {
            setCurrentAnim('idle');
        } else if (currentAnim === 'focusing') {
            setCurrentAnim('starting');
        }
    }, [currentIndex, album, currentAnim, setCurrentAnim]);

    // Cleanup
    useEffect(() => {
        return () => {
            timelineManager.current.cleanup();
        };
    }, []);

    return null;
};
