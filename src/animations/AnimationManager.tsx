import { animState, setCurrentAnim, setIsPlaying } from "@states/animation";
import { useEffect, useRef } from "react";
import { subscribe, useSnapshot } from "valtio";

import { useGSAP } from "@gsap/react";
import { albumState } from "@states/album";
import gsap from "gsap";

export const AnimationManager = () => {
    const snap = useSnapshot(albumState);

    const ytTimeline = useRef<GSAPTimeline>();
    const panelTimeline = useRef<GSAPTimeline>();

    useGSAP(() => {
        ytTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
            lazy: true,
            delay: 0,
            duration: snap.duration,
            ease: "none",
            left: "100%",
        });

        ytTimeline.current.seek(0);
    }, [snap.currentIndex]);

    const lastSongRef = useRef<number | null>(null);

    useEffect(() => {
        window.onfocus = async () => {
            if (ytTimeline.current && albumState.player) {
                ytTimeline.current.seek(
                    await albumState.player.getCurrentTime()
                );
            }
        };

        const albumSub = subscribe(albumState, () => {
            const anim = ytTimeline.current;

            if (!anim) return;
            if (albumState.status === "playing") {
                anim.play();
            } else if (albumState.status === "paused") {
                anim.pause();
            }

            const curIdx = albumState.currentIndex;
            const lastSong = lastSongRef.current;

            if (curIdx !== lastSong) {
                console.group();
                console.log("new song");
                console.log(
                    "old:",
                    lastSong ? albumState.album?.list[lastSong] : null
                );
                console.log(
                    "new:",
                    curIdx ? albumState.album?.list[curIdx] : null
                );
                console.groupEnd();

                anim.restart();
                lastSongRef.current = curIdx ?? null;

                if (!lastSong) {
                    setCurrentAnim("starting");
                }
            }

            if (!albumState.album) {
                setCurrentAnim("idle");
                lastSongRef.current = null;
            }
        });

        const animSub = subscribe(animState, () => {
            const currentAnim = animState.currentAnim;
            console.log("currentAnim:", currentAnim);

            if (currentAnim === "starting") {
                if (panelTimeline.current) panelTimeline.current.restart();
                setIsPlaying(true);
            } else if (currentAnim === "starting-step-3") {
                setIsPlaying(false);
            }
        });

        return () => {
            albumSub();
            animSub();
        };
    });

    return null;
};
