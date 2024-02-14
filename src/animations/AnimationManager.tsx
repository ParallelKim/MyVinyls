import { useGSAP } from "@gsap/react";
import { albumState } from "@states/album";
import { animState, setCurrentAnim } from "@states/animation";
import { refState } from "@states/refState";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import { useSnapshot, subscribe } from "valtio";

export const AnimationManager = () => {
    const snap = useSnapshot(albumState);
    const ytTimeline = useRef<GSAPTimeline>();
    const panelTimeline = useRef<GSAPTimeline>();

    useGSAP(() => {
        ytTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
            delay: 0,
            duration: snap.duration,
            ease: "none",
            left: "100%",
        });

        const { panel, currentCover } = refState;
        if (panel && currentCover) {
            panelTimeline.current = gsap
                .timeline()
                .to([panel.position, currentCover.position], {
                    x: -40,
                    duration: 3,
                });
        }
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
                setCurrentAnim(null);
                lastSongRef.current = null;
            }
        });

        const animSub = subscribe(animState, () => {
            const currentAnim = animState.currentAnim;
            console.log(currentAnim, refState.panel);

            if (panelTimeline.current) {
                if (currentAnim === "starting") {
                    panelTimeline.current.play();
                }
            }
        });

        return () => {
            albumSub();
            animSub();
        };
    });

    return null;
};
