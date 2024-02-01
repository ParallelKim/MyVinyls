import { useGSAP } from "@gsap/react";
import { albumState } from "@states/album";
import { FocusedAlbum } from "../types/Album";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import { useSnapshot, subscribe } from "valtio";

export const AnimationManager = () => {
    const snap = useSnapshot(albumState);
    const youtubeTimeline = useRef<GSAPTimeline>();
    const ref = useRef<FocusedAlbum | null>(null);

    useGSAP(() => {
        youtubeTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
            delay: 0,
            duration: snap.duration,
            ease: "none",
        });
    }, [snap.duration]);

    useEffect(() =>
        subscribe(albumState, () => {
            (() => {
                const anim = youtubeTimeline.current;
                if (!anim) return;
                if (albumState.status === "playing") {
                    anim.play();
                } else if (albumState.status === "paused") {
                    anim.pause();
                } else if (albumState.status === "unstarted") {
                    anim.seek(0);
                }
            })();
        })
    );

    return null;
};
