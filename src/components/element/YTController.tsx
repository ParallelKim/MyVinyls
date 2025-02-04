import useAlbumStore from "@states/albumStore";
import { Next } from "./ui/Next";
import { Pause } from "./ui/Pause";
import { Play } from "./ui/Play";
import { Prev } from "./ui/Prev";

export const YTController = () => {
    const { player, album, currentIndex, duration, status } = useAlbumStore();

    const isFirst = currentIndex === 0;
    const isLast = album && album.list.length - 1 === currentIndex;

    const control = (action: "play" | "pause" | "prev" | "next") => async () => {
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
            <div className={"yt-buttons " + (player ? "" : "yt-buttons-disabled")}>
                <Prev onClick={control("prev")}/>
                {status !== "paused" ? (
                    <Pause onClick={control("pause")} />
                ) : (
                    <Play onClick={control("play")} />
                )}
                <Next onClick={control("next")}/>
            </div>
        </div>
    );
};
