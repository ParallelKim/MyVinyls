import { albumState } from "@states/album";
import { useSnapshot } from "valtio";
import { Next } from "./ui/Next";
import { Pause } from "./ui/Pause";
import { Play } from "./ui/Play";
import { Prev } from "./ui/Prev";

export const YTController = () => {
    const snap = useSnapshot(albumState);

    const isFirst = albumState.currentIndex === 0;
    const isLast =
        albumState.album &&
        albumState.album.list.length - 1 === albumState.currentIndex;

    const control =
        (action: "play" | "pause" | "prev" | "next") => async () => {
            const { player } = albumState;
            if (player) {
                if (action === "play") {
                    await player.playVideo();
                } else if (action === "pause") {
                    await player.pauseVideo();
                } else if (action === "prev") {
                    if (isFirst) return;

                    await player.previousVideo();
                } else if (action === "next") {
                    if (isLast) return;

                    player.nextVideo();
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
                    className={isFirst ? "yt-icon-disabled" : "yt-icon"}
                    onClick={control("prev")}
                />
                {snap.status !== "paused" ? (
                    <Pause onClick={control("pause")} />
                ) : (
                    <Play onClick={control("play")} />
                )}
                <Next
                    className={isLast ? "yt-icon-disabled" : "yt-icon"}
                    onClick={control("next")}
                />
            </div>
        </div>
    );
};
