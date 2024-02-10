import { albumState } from "@states/album";
import { Next } from "./ui/Next";
import { Play } from "./ui/Play";
import { Prev } from "./ui/Prev";
import { Pause } from "./ui/Pause";
import { useSnapshot } from "valtio";

export const YTController = () => {
    const snap = useSnapshot(albumState);

    const control = (action: "play" | "pause") => async () => {
        if (albumState.player) {
            if (action === "play") {
                await albumState.player.playVideo();
            } else if (action === "pause") {
                await albumState.player.pauseVideo();
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
