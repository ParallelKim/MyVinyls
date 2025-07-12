import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect } from "react";

import useAnimationStore from "@/states/animationStore";
import usePlayerStore from "@/states/playerStore";

import { useThree } from "@react-three/fiber";
import { AnimationEvent, eventManager } from "./EventManager";
import { timelineManager } from "./TimelineManager";

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const { player, status, currentIndex, duration, album, setAlbum } =
        usePlayerStore();

    const { setCurrentAnim } = useAnimationStore();
    const { controls, scene } = useThree((state) => ({
        controls: state.controls as any,
        scene: state.scene,
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
                    console.log("LP_PLAYING", event.payload);
                    console.log("player", player);

                    if (!player) return;
                    // 곡 선택 시 로딩 상태로 전환하여 레코드 이동 애니메이션 시작
                    // 애니메이션이 완료될 때까지 대기
                    // 애니메이션 완료 후 playing 상태로 전환
                    // 이후 선택한 곡의 재생 시작

                    setCurrentAnim("loading");

                    controls.reset();
                    const lpPlayerTarget =
                        scene.getObjectByName("lpPlayerTarget");
                    if (!lpPlayerTarget) return;
                    await controls.fitToBox(lpPlayerTarget, true, {
                        paddingTop: 0.03,
                        paddingBottom: 0.03,
                        paddingLeft: 0.03,
                        paddingRight: 0.03,
                    });
                    controls.saveState();

                    await new Promise((resolve) => setTimeout(resolve, 500));
                    setCurrentAnim("playing");
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
