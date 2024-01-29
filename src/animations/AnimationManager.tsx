import { useGSAP } from "@gsap/react";
import { albumState } from "@states/album";
import { FocusedAlbum } from "../types/Album";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import { useSnapshot, subscribe } from "valtio";

export const AnimationManager = () => {
    const snap = useSnapshot(albumState);
    const youtubeTimeline = useRef<GSAPTimeline>();
    const focusTimeline = useRef<GSAPTimeline>();
    const ref = useRef<FocusedAlbum | null>(null);

    useGSAP(() => {
        youtubeTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
            delay: 0,
            duration: snap.duration,
            ease: "none",
        });
    }, [snap.duration]);

    useGSAP(() => {
        if (!snap.album?.lpObject) return;

        focusTimeline.current = gsap
            .timeline()
            .to(snap.album?.lpObject.position, {
                z: 20,
                delay: 0,
                duration: 0.5,
                ease: "none",
            });
    }, [snap.album]);

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

            (() => {
                const anim = focusTimeline.current;
                if (!anim) return;

                if (ref.current?.id !== albumState.album?.id) {
                    anim.revert();
                }

                if (albumState.album) {
                    ref.current = albumState.album;
                    anim.play(0.5);
                }
            })();
        })
    );

    return null;
};
