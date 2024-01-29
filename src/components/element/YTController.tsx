import { albumState } from "@states/album";
import { Next } from "./ui/Next";
import { Play } from "./ui/Play";
import { Prev } from "./ui/Prev";
import { Pause } from "./ui/Pause";
import { useSnapshot } from "valtio";

export const YTController = () => {
    const snap = useSnapshot(albumState);

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
            {snap.player && (
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
            )}
        </div>
    );
};
