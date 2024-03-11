import { animState, setCurrentAnim, setIsPlaying } from "@states/animation";
import { useEffect, useRef } from "react";
import { subscribe, useSnapshot } from "valtio";

import { useGSAP } from "@gsap/react";
import { albumState } from "@states/album";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const snap = useSnapshot(albumState);

    const ytTimeline = useRef<GSAPTimeline>();
    const panelTimeline = useRef<GSAPTimeline>();

    useGSAP(
        () => {
            ytTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
                lazy: true,
                delay: 0,
                duration: snap.duration,
                ease: "none",
                left: "100%",
            });
        },
        { dependencies: [snap.currentIndex], revertOnUpdate: true }
    );

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
                if (typeof curIdx === "number") {
                    console.group();
                    console.log("new song");
                    console.log(
                        "old:",
                        typeof lastSong === "number" && lastSong >= 0
                            ? albumState.album?.list[lastSong]
                            : null
                    );
                    console.log(
                        "new:",
                        typeof curIdx === "number" && curIdx >= 0
                            ? albumState.album?.list[curIdx]
                            : null
                    );
                    console.groupEnd();

                    anim.restart();
                    lastSongRef.current = curIdx ?? null;

                    if (animState.currentAnim === "focusing") {
                        setCurrentAnim("starting");
                    }
                } else {
                    lastSongRef.current = null;
                    anim.restart();
                    anim.seek(0);
                    console.log("end of album");
                    setCurrentAnim("idle");
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
