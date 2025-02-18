import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import useAlbumStore from "@/states/albumStore";
import useAnimationStore from "@/states/animationStore";
import { YOUTUBE_STATES } from "@/constants/youtubeState";

import {
    AnimationEvent,
    TimelineManager,
    eventManager,
} from "./AnimationEngine";

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const { player, status, currentIndex, duration, album, setAlbum } =
        useAlbumStore();
    const { currentAnim, setCurrentAnim } = useAnimationStore();
    const timelineManager = useRef<TimelineManager>(
        new TimelineManager((error) => {
            console.error("[AnimationManager] Timeline error:", error);
            setCurrentAnim("error");
        })
    );

    // Initialize timeline
    useGSAP(
        () => {
            if (duration > 0) {
                timelineManager.current.initialize(duration);
            }
        },
        { dependencies: [currentIndex, duration], revertOnUpdate: true }
    );

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

    useEffect(() => {
        timelineManager.current.handlePlaybackStateChange(status);
    }, [status]);

    useEffect(() => {
        timelineManager.current.handleSongChange(currentIndex);

        if (currentIndex === null && !album) {
            setCurrentAnim("idle");
        }
    }, [currentIndex, album, setCurrentAnim]);

    useEffect(() => {
        if (!player) return;

        const handlePlayerStateChange = (event: any) => {
            const state = event?.data;

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

    // unifiedEventManager를 이용한 LP 선택 이벤트 처리
    useEffect(() => {
        const unsubscribe = eventManager.subscribe((event: AnimationEvent) => {
            if (event.type === "LP_SELECTED") {
                setAlbum(event.payload.album);
                setCurrentAnim("focusing");
            } else if (event.type === "LP_UNSELECTED") {
                setAlbum(null);
                setCurrentAnim("idle");
            }
        });

        return unsubscribe;
    }, [setAlbum, setCurrentAnim]);

    // Cleanup
    useEffect(() => {
        return () => {
            timelineManager.current.cleanup();
        };
    }, []);

    return null;
};
