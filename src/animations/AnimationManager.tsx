import { animState, setCurrentAnim, setIsPlaying } from "@states/animation";
import { useEffect, useRef } from "react";
import { subscribe, useSnapshot } from "valtio";

import { useGSAP } from "@gsap/react";
import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { albumState } from "@states/album";
import { refState } from "@states/refState";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const snap = useSnapshot(albumState);
    const controls = useThree((state) => state.controls);

    const ytTimeline = useRef<GSAPTimeline>();

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
            const cameraControls = controls as unknown as CameraControls;
            console.log(
                "currentAnim:",
                currentAnim,
                "cameraControls",
                cameraControls
            );

            if (!cameraControls) return;

            if (currentAnim === "focusing") {
            } else if (currentAnim === "starting") {
                setIsPlaying(true);
                cameraControls.smoothTime = 1;

                if (refState.lpPlayer) {
                    const { x, y, z } = refState.lpPlayer.position;

                    cameraControls.setOrbitPoint(x, y, z);
                    cameraControls.fitToBox(refState.lpPlayer, true, {
                        paddingBottom: 2,
                        paddingTop: 2,
                    });
                }

                cameraControls.rotateAzimuthTo(Math.PI, true);
                cameraControls.rotatePolarTo(0, true).then(() => {
                    setCurrentAnim("playing");
                });
            } else if (currentAnim === "playing") {
                cameraControls.rotatePolarTo(Math.PI / 3, true).then(() => {
                    if (refState.currentRecord) {
                        cameraControls
                            .fitToBox(refState.currentRecord, true, {
                                cover: true,
                            })
                            .then(() => {
                                cameraControls.smoothTime = 0.25;
                            });
                    }
                });
            } else if (currentAnim === "starting-step-3") {
                setIsPlaying(false);
            } else {
            }
        });

        return () => {
            albumSub();
            animSub();
        };
    });

    return null;
};
