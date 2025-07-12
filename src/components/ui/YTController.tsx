import usePlayerStore from "@/states/playerStore";
import { eventManager } from "../managers/EventManager";
import { Next } from "./Next";
import { Pause } from "./Pause";
import { Play } from "./Play";
import { Prev } from "./Prev";

export const YTController = () => {
    const { player, album, currentIndex, status, duration } = usePlayerStore();

    const isFirst = currentIndex === 0;
    const isLast = album && album.list.length - 1 === currentIndex;

    const control = {
        play: async () => {
            if (!player) return;
            await player.playVideo();
            eventManager.emit({
                type: "LP_RESUME",
                payload: { album: album, lpId: album?.id },
            });
        },
        pause: async () => {
            if (!player) return;
            await player.pauseVideo();
            if (album) {
                eventManager.emit({
                    type: "LP_PAUSED",
                    payload: { album: album, lpId: album.id },
                });
            }
        },
        prev: async () => {
            if (!player || isFirst) return;
            await player.previousVideo();
        },
        next: async () => {
            if (!player || isLast) return;
            await player.nextVideo();
        },
    };

    const isControllerInit = player && album && duration;

    return (
        <div
            className={
                "yt-controller " +
                (isControllerInit ? "yt-ctrl-visible" : "yt-ctrl-hidden")
            }
        >
            <div className="yt-progress">
                <div className="yt-progress-bar yt-progress-indicator" />
                <div className="yt-progress-indicator">⌾</div>
            </div>
            <div
                className={
                    "yt-buttons" + (player ? "" : " yt-buttons-disabled")
                }
            >
                <Prev onClick={control.prev} />
                {status === "ready" ? (
                    <Play onClick={control.play} />
                ) : (
                    <Pause onClick={control.pause} />
                )}
                <Next onClick={control.next} />
            </div>
        </div>
    );
};
