import gsap from "gsap";
import { YouTubePlayer } from "react-youtube";
import { AnimationStatus } from "../states/AnimationStateManager";

export class TimelineManager {
    private timeline: gsap.core.Timeline | null = null;
    private lastSongIndex: number | null = null;

    initialize(duration: number) {
        this.timeline = gsap.timeline().to(".yt-progress-indicator", {
            lazy: true,
            delay: 0,
            duration,
            ease: "none",
            left: "100%",
        });
    }

    async syncWithYouTube(player: YouTubePlayer | null) {
        if (this.timeline && player) {
            this.timeline.seek(await player.getCurrentTime());
        }
    }

    handlePlaybackStateChange(status: AnimationStatus) {
        if (!this.timeline) return;

        if (status === "playing") {
            this.timeline.play();
        } else if (status === "ready") {
            this.timeline.pause();
        }
    }

    handleSongChange(currentIndex: number | null) {
        if (!this.timeline) return;

        if (currentIndex !== this.lastSongIndex) {
            if (typeof currentIndex === "number") {
                this.timeline.restart();
                this.lastSongIndex = currentIndex;
            } else {
                this.lastSongIndex = null;
                this.timeline.restart();
                this.timeline.seek(0);
            }
        }
    }

    cleanup() {
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
    }
}
