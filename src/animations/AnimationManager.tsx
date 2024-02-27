import { useFrame, useThree } from "@react-three/fiber";
import { animState, setCurrentAnim, setIsPlaying } from "@states/animation";
import { useEffect, useRef } from "react";
import { subscribe, useSnapshot } from "valtio";

import { useGSAP } from "@gsap/react";
import { albumState } from "@states/album";
import { refState } from "@states/refState";
import gsap from "gsap";
import { Vector3 } from "three";

const recordNewPos = new Vector3(3.9, -0.2, -28);

export const AnimationManager = () => {
    const { camera, controls } = useThree();

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

        const { root, panel, currentCover, currentRecord } = refState;
        if (panel && currentCover && currentRecord && root) {
            panelTimeline.current = gsap
                .timeline({
                    defaults: { ease: "power2" },
                    onComplete: () => {
                        console.log("starting is ended");

                        setCurrentAnim("starting-step-2");
                    },
                })
                .to(
                    root.position,
                    {
                        y: 5,
                        duration: 6,
                    },
                    0
                )
                .to(
                    root.rotation,
                    {
                        x: (-Math.PI * 3) / 8,
                        duration: 6,
                    },
                    0
                )
                .to(
                    [panel.position, currentCover.position],
                    {
                        x: -120,
                        z: -10,
                        duration: 6,
                    },
                    0
                );
        }
    }, [snap.currentIndex]);

    useFrame(() => {
        if (animState.currentAnim === "starting-step-2") {
            const { currentRecord, station } = refState;

            if (currentRecord) {
                const dis = currentRecord.position.distanceTo(recordNewPos);
                const speed = Math.min(0.1, 1 / dis);
                if (dis < 0.001) {
                    currentRecord.position.copy(recordNewPos);
                    currentRecord.up.set(0, 1, 0);
                    setCurrentAnim("starting-step-3");
                    console.log("starting-step-2 is ended");
                    console.log(controls, camera);
                } else {
                    currentRecord.position.lerp(recordNewPos, speed);
                }
            }
        }

        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
    });

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
