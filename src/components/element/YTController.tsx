import { albumState } from "@states/album";
import { Next } from "./ui/Next";
import { Play } from "./ui/Play";
import { Prev } from "./ui/Prev";
import { Pause } from "./ui/Pause";
import { subscribe, useSnapshot } from "valtio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

export const YTController = () => {
    const snap = useSnapshot(albumState);
    const ytTimeline = useRef<GSAPTimeline>();

    useGSAP(() => {
        ytTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
            delay: 0,
            duration: snap.duration,
            ease: "none",
            left: "100%",
        });
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

        return subscribe(albumState, () => {
            const anim = ytTimeline.current;
            console.log(albumState.status, anim);
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
            }
        });
    });

    const control = (action: "play" | "pause") => async () => {
        if (albumState.player && ytTimeline.current) {
            console.log(action, albumState.player);
            const anim = ytTimeline.current;

            if (action === "play") {
                await albumState.player.playVideo();
                anim.play();
            } else if (action === "pause") {
                await albumState.player.pauseVideo();
                anim.pause();
            }
        }
    };

    return (
        <div
            className={
                "yt-controller " +
                (snap.player && snap.album && snap.duration
                    ? "yt-ctrl-visible"
                    : "yt-ctrl-hidden")
            }
        >
            <div className="yt-progress">
                <div className="yt-progress-bar yt-progress-indicator" />
                <div className="yt-progress-indicator">⌾</div>
            </div>
            <div
                className={
                    "yt-buttons " + (snap.player ? "" : "yt-buttons-disabled")
                }
            >
                <Prev
                    onClick={() => {
                        if (!snap.player) return;
                        console.log("prev");
                        snap.player.previousVideo();
                    }}
                />
                {snap.status !== "paused" ? (
                    <Pause onClick={control("pause")} />
                ) : (
                    <Play onClick={control("play")} />
                )}
                <Next
                    className={!snap.player ? "yt-icon-disabled" : undefined}
                    onClick={() => {
                        if (!snap.player) return;
                        console.log("next");
                        snap.player.nextVideo();
                    }}
                />
            </div>
        </div>
    );
};
