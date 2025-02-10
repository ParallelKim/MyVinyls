import gsap from "gsap";
import { YouTubePlayer } from "react-youtube";
import { AnimationStatus } from "../states/AnimationStateManager";

interface TimelineError {
    code: string;
    message: string;
}

export class TimelineManager {
    private timeline: gsap.core.Timeline | null = null;
    private lastSongIndex: number | null = null;
    private onError?: (error: TimelineError) => void;

    constructor(onError?: (error: TimelineError) => void) {
        this.onError = onError;
    }

    initialize(duration: number) {
        try {
            if (this.timeline) {
                this.timeline.kill();
            }

            this.timeline = gsap.timeline().to(".yt-progress-indicator", {
                lazy: true,
                delay: 0,
                duration,
                ease: "none",
                left: "100%",
            });
        } catch (error) {
            this.handleError({
                code: "TIMELINE_INIT_ERROR",
                message: "Failed to initialize timeline",
            });
        }
    }

    async syncWithYouTube(player: YouTubePlayer | null) {
        try {
            if (this.timeline && player) {
                const currentTime = await player.getCurrentTime();
                this.timeline.seek(currentTime);
            }
        } catch (error) {
            this.handleError({
                code: "YOUTUBE_SYNC_ERROR",
                message: "Failed to sync with YouTube player",
            });
        }
    }

    handlePlaybackStateChange(status: AnimationStatus) {
        if (!this.timeline) return;

        try {
            switch (status) {
                case "playing":
                    this.timeline.play();
                    break;
                case "ready":
                case "changing":
                case "returning":
                    this.timeline.pause();
                    break;
                case "error":
                    this.timeline.pause();
                    break;
            }
        } catch (error) {
            this.handleError({
                code: "PLAYBACK_STATE_ERROR",
                message: "Failed to handle playback state change",
            });
        }
    }

    handleSongChange(currentIndex: number | null) {
        if (!this.timeline) return;

        try {
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
        } catch (error) {
            this.handleError({
                code: "SONG_CHANGE_ERROR",
                message: "Failed to handle song change",
            });
        }
    }

    cleanup() {
        try {
            if (this.timeline) {
                this.timeline.kill();
                this.timeline = null;
            }
        } catch (error) {
            this.handleError({
                code: "CLEANUP_ERROR",
                message: "Failed to cleanup timeline",
            });
        }
    }

    private handleError(error: TimelineError) {
        console.error("[TimelineManager]", error);
        this.onError?.(error);
    }
}
