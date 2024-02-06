import { albumState } from "@states/album";
import { Next } from "./ui/Next";
import { Play } from "./ui/Play";
import { Prev } from "./ui/Prev";
import { Pause } from "./ui/Pause";
import { useSnapshot } from "valtio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export const YTController = () => {
    const snap = useSnapshot(albumState);

    const ytTimeline = useRef<GSAPTimeline>();

    useGSAP(() => {
        ytTimeline.current = gsap.timeline().to(".yt-progress-indicator", {
            delay: 0,
            duration: snap.duration,
            ease: "none",
        });
    }, [snap.duration]);

    const control = (action: "play" | "pause") => async () => {
        if (albumState.player && ytTimeline.current) {
            console.log(action, albumState.player);

            if (action === "play") {
                await albumState.player.playVideo();
                ytTimeline.current.play();
            } else if (action === "pause") {
                await albumState.player.pauseVideo();
                ytTimeline.current.pause();
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
                className={snap.player ? "yt-buttons" : "yt-buttons-disabled"}
                style={{ display: "flex", gap: "2rem" }}
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
