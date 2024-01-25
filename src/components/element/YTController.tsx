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
    const tl = useRef<GSAPTimeline>();

    useGSAP(() => {
        tl.current = gsap
            .timeline()
            .to(".yt-progress-indicator", {
                left: "100%",
                delay: 0,
                duration: 10,
                ease: "none",
            })
            .pause();
    });

    useEffect(
        () =>
            subscribe(albumState, () => {
                console.log(albumState.status);

                const anim = tl.current;
                if (!anim) return;
                if (albumState.status === "playing") {
                    console.log("play");
                    anim.play();
                } else if (albumState.status === "paused") {
                    anim.pause();
                } else if (albumState.status === "buffering") {
                    anim.pause();
                } else if (albumState.status === "unstarted") {
                    anim.revert();
                }
            }),
        []
    );

    const play = () => {
        if (albumState.status === "paused" && albumState.player) {
            console.log("play");
            albumState.player.playVideo();
        }
    };

    const pause = () => {
        if (albumState.status === "playing" && albumState.player) {
            console.log("pause");
            albumState.player.pauseVideo();
        }
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div className={"yt-controller"}>
                <div className="yt-progress">
                    <div className="yt-progress-bar yt-progress-indicator" />
                    <div className="yt-progress-indicator">⌾</div>
                </div>
                <div
                    className={
                        snap.player ? "yt-buttons" : "yt-buttons-disabled"
                    }
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
                        <Pause onClick={pause} />
                    ) : (
                        <Play onClick={play} />
                    )}
                    <Next
                        className={
                            !snap.player ? "yt-icon-disabled" : undefined
                        }
                        onClick={() => {
                            if (!snap.player) return;
                            console.log("next");
                            snap.player.nextVideo();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
