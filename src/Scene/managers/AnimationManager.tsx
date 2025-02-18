import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import usePlayerStore from "@/states/playerStore";
import useAnimationStore from "@/states/animationStore";
import { YOUTUBE_STATES } from "@/constants/youtubeState";

import { AnimationEvent, eventManager } from "./EventManager";
import { timelineManager } from "./TimelineManager";
import { useThree } from "@react-three/fiber";
import useSceneStore from "@/states/sceneStore";

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const {
        player,
        status,
        currentIndex,
        duration,
        album,
        setAlbum,
        setIsPlaying,
    } = usePlayerStore();
    const { currentAnim, setCurrentAnim } = useAnimationStore();
    const { lpPlayer } = useSceneStore();

    const { camera, controls } = useThree((state) => ({
        camera: state.camera,
        controls: state.controls as any,
    }));

    useGSAP(
        () => {
            if (duration > 0) {
                timelineManager.initialize(duration);
            }
        },
        { dependencies: [currentIndex, duration], revertOnUpdate: true }
    );

    useEffect(() => {
        timelineManager.handleStateChange(status);
    }, [status]);

    useEffect(() => {
        timelineManager.handleSongChange(currentIndex);

        if (currentIndex === null && !album) {
            setCurrentAnim("idle");
        }
    }, [currentIndex, album, setCurrentAnim]);

    useEffect(() => {
        const unsubscribe = eventManager.subscribe(
            async (event: AnimationEvent) => {
                if (event.type === "LP_SELECTED") {
                    setAlbum(event.payload.album);
                    setCurrentAnim("focusing");
                } else if (event.type === "LP_UNSELECTED") {
                    setAlbum(null);
                    setCurrentAnim("idle");
                } else if (event.type === "LP_PLAYING") {
                    if (!player) return;
                    // 곡 선택 시 로딩 상태로 전환하여 레코드 이동 애니메이션 시작
                    // 애니메이션이 완료될 때까지 대기
                    // 애니메이션 완료 후 playing 상태로 전환
                    // 이후 선택한 곡의 재생 시작

                    setCurrentAnim("loading");

                    controls.reset();
                    controls.fitToBox(lpPlayer, true, { cover: true });

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setCurrentAnim("playing");
                    setIsPlaying(true);
                    await player.playVideoAt(event.payload.songIndex ?? 0);
                    timelineManager.syncWithYouTube(player);
                }
            }
        );

        return unsubscribe;
    }, [setAlbum, setCurrentAnim, player]);

    useEffect(() => {
        return () => {
            timelineManager.cleanup();
        };
    }, []);

    return null;
};
