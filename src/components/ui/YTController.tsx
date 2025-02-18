import usePlayerStore from "@/states/playerStore";
import { Next } from "./Next";
import { Pause } from "./Pause";
import { Play } from "./Play";
import { Prev } from "./Prev";

export const YTController = () => {
    const { player, album, currentIndex, status, duration } = usePlayerStore();

    const isFirst = currentIndex === 0;
    const isLast = album && album.list.length - 1 === currentIndex;

    const control =
        (action: "play" | "pause" | "prev" | "next") => async () => {
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
                    await player.nextVideo();
                }
            }
        };

    return (
        <div
            className={
                "yt-controller " +
                (player && album && duration
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
                    "yt-buttons " + (player ? "" : "yt-buttons-disabled")
                }
            >
                <Prev onClick={control("prev")} />
                {status !== "ready" ? (
                    <Pause onClick={control("pause")} />
                ) : (
                    <Play onClick={control("play")} />
                )}
                <Next onClick={control("next")} />
            </div>
        </div>
    );
};
