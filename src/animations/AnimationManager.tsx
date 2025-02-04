import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Group } from "three";

import useAlbumStore from "@states/albumStore";
import useAnimationStore from "@states/animationStore";
import useSceneStore from "@states/sceneStore";

type ExtendedGroup = Group & {
    lpPlayer?: Group;
    currentRecord?: Group;
};

gsap.registerPlugin(useGSAP);

export const AnimationManager = () => {
    const { player, status, currentIndex, duration, album } = useAlbumStore();
    const { currentAnim, setCurrentAnim, setIsPlaying } = useAnimationStore();
    const root = useSceneStore((state) => state.root) as ExtendedGroup | null;
    const controls = useThree((state) => state.controls) as unknown as CameraControls;

    const ytTimeline = useRef<gsap.core.Timeline>();
    const lastSongRef = useRef<number | null>(null);

    useGSAP(
        () => {
            ytTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
                lazy: true,
                delay: 0,
                duration: duration,
                ease: "none",
                left: "100%",
            });
        },
        { dependencies: [currentIndex], revertOnUpdate: true }
    );

    useEffect(() => {
        window.onfocus = async () => {
            if (ytTimeline.current && player) {
                ytTimeline.current.seek(await player.getCurrentTime());
            }
        };

        return () => {
            window.onfocus = null;
        };
    }, [player]);

    useEffect(() => {
        const anim = ytTimeline.current;
        if (!anim) return;

        if (status === "playing") {
            anim.play();
        } else if (status === "paused") {
            anim.pause();
        }
    }, [status]);

    useEffect(() => {
        if (!controls || !root) return;

        // const targetPosition = { x: 0, y: 0, z: 0 };
        // const targetRotation = { x: 0, y: 0 };

        if (currentAnim === "focusing") {
            // NEED TO IMPLEMENT
        } else if (currentAnim === "starting") {
            setIsPlaying(true);
            controls.smoothTime = 1;

            if (root.lpPlayer) {
                const { x, y, z } = root.lpPlayer.position;

                controls.setOrbitPoint(x, y, z);
                controls.fitToBox(root.lpPlayer, true, {
                    paddingBottom: 2,
                    paddingTop: 2,
                });
            }

            controls.rotateAzimuthTo(Math.PI, true);
            controls.rotatePolarTo(0, true).then(() => {
                setCurrentAnim("ready");
            });
        } else if (currentAnim === "ready") {
            if (root.currentRecord) {
                controls
                    .fitToBox(root.currentRecord, true, {
                        cover: true,
                    })
                    .then(() => {
                        controls.smoothTime = 0.25;
                        setCurrentAnim("playing");
                    });
            }
        } else if (currentAnim === "playing") {
            controls.rotatePolarTo(Math.PI / 3, true).then(() => {});
        } else if (currentAnim === "starting-step-3") {
            setIsPlaying(false);
        } else {
            // NEED TO IMPLEMENT
        }
    }, [controls, currentAnim, root, setCurrentAnim, setIsPlaying]);

    useEffect(() => {
        const anim = ytTimeline.current;

        if (!anim) return;
        if (status === "playing") {
            anim.play();
        } else if (status === "paused") {
            anim.pause();
        }

        const curIdx = currentIndex;
        const lastSong = lastSongRef.current;

        if (curIdx !== lastSong) {
            if (typeof curIdx === "number") {
                console.group();
                console.log("new song");
                console.log(
                    "old:",
                    typeof lastSong === "number" && lastSong >= 0
                        ? album?.list[lastSong]
                        : null
                );
                console.log(
                    "new:",
                    typeof curIdx === "number" && curIdx >= 0
                        ? album?.list[curIdx]
                        : null
                );
                console.groupEnd();

                anim.restart();
                lastSongRef.current = curIdx ?? null;

                if (currentAnim === "focusing") {
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

        if (!album) {
            setCurrentAnim("idle");
            lastSongRef.current = null;
        }
    }, [currentIndex, setCurrentAnim, album, status, currentAnim]);

    return null;
};
