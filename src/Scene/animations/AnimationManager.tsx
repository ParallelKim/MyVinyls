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
import { YOUTUBE_STATES, youtubeState } from "@constants/youtubeState";
import { lpEventManager, LpEvent } from "./core/LpEventManager";

type ExtendedGroup = Group & {
    lpPlayer?: Group;
    currentRecord?: Group;
};

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const { player, status, currentIndex, duration, album, setAlbum } =
        useAlbumStore();
    const { currentAnim, setCurrentAnim, setIsPlaying } = useAnimationStore();
    const root = useSceneStore((state) => state.root) as ExtendedGroup | null;
    const controls = useThree(
        (state) => state.controls
    ) as unknown as CameraControls;

    const timelineManager = useRef<TimelineManager>(
        new TimelineManager((error) => {
            console.error("[AnimationManager] Timeline error:", error);
            setCurrentAnim("error");
        })
    );
    const stateManager = useRef<AnimationStateManager | null>(null);

    // Initialize timeline
    useGSAP(
        () => {
            if (duration > 0) {
                timelineManager.current.initialize(duration);
            }
        },
        { dependencies: [currentIndex, duration], revertOnUpdate: true }
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
        const handleFocus = async () => {
            if (player && currentAnim === "playing") {
                await timelineManager.current.syncWithYouTube(player);
            }
        };

        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [player, currentAnim]);

    // Handle animation state changes
    useEffect(() => {
        if (!stateManager.current) return;

        try {
            stateManager.current.handleState(currentAnim);
        } catch (error) {
            console.error("[AnimationManager] State handling error:", error);
            setCurrentAnim("error");
        }
    }, [currentAnim]);

    // Handle playback state changes
    useEffect(() => {
        timelineManager.current.handlePlaybackStateChange(status);
    }, [status]);

    // Handle song changes
    useEffect(() => {
        timelineManager.current.handleSongChange(currentIndex);

        if (currentIndex === null && !album) {
            setCurrentAnim("idle");
        }
    }, [currentIndex, album, setCurrentAnim]);

    // Handle YouTube player state
    useEffect(() => {
        if (!player) return;

        const handlePlayerStateChange = (event: any) => {
            const state = event?.data;
            const newStatus = youtubeState[state];

            // 상태 전환 로직 개선
            if (state === YOUTUBE_STATES.PLAYING) {
                if (currentAnim === "loading") {
                    setCurrentAnim("starting");
                } else if (currentAnim === "ready") {
                    setCurrentAnim("playing");
                }
            } else if (
                state === YOUTUBE_STATES.PAUSED &&
                currentAnim === "playing"
            ) {
                setCurrentAnim("ready");
            } else if (state === YOUTUBE_STATES.ENDED) {
                setCurrentAnim("returning");
            } else {
                setCurrentAnim("error");
            }
        };

        player.addEventListener("onStateChange", handlePlayerStateChange);
    }, [player, currentAnim, setCurrentAnim]);

    // LP 선택 이벤트 구독
    useEffect(() => {
        const unsubscribe = lpEventManager.subscribe((event: LpEvent) => {
            if (event.type === "LP_SELECTED") {
                setAlbum(event.payload.album);
                setCurrentAnim("focusing");

                if (stateManager.current) {
                    stateManager.current.handleState("focusing");
                }
            } else if (event.type === "LP_UNSELECTED") {
                setAlbum(null);
                setCurrentAnim("idle"); // unselect 시 idle 상태로 변경

                if (stateManager.current) {
                    stateManager.current.handleState("idle");
                }
            }
        });

        return () => unsubscribe();
    }, [setAlbum, setCurrentAnim]);

    // Cleanup
    useEffect(() => {
        return () => {
            timelineManager.current.cleanup();
        };
    }, []);

    return null;
};
