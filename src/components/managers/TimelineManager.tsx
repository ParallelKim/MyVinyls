import gsap from "gsap";

import { YouTubePlayer } from "react-youtube";
import { AnimationStatus } from "./EventManager";

export class TimelineManager {
    private timeline: gsap.core.Timeline | null = null;
    private lastSongIndex: number | null = null;

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
                message: "타임라인 초기화에 실패했습니다.",
            });
        }
    }

    async syncWithYouTube(player: YouTubePlayer | null) {
        if (this.timeline && player) {
            try {
                const currentTime = await player.getCurrentTime();
                this.timeline.seek(currentTime);
            } catch (error) {
                this.handleError({
                    code: "YOUTUBE_SYNC_ERROR",
                    message: "YouTube 플레이어 동기화에 실패했습니다.",
                });
            }
        }
    }

    handleStateChange(status: AnimationStatus) {
        if (!this.timeline) return;
        try {
            switch (status) {
                case "playing":
                    this.timeline.play();
                    break;
                case "ready":
                case "changing":
                case "returning":
                case "error":
                    this.timeline.pause();
                    break;
            }
        } catch (error) {
            this.handleError({
                code: "PLAYBACK_STATE_ERROR",
                message: "재생 상태 변경 처리에 실패했습니다.",
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
                message: "곡 변경 처리에 실패했습니다.",
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
                message: "타임라인 정리 중 에러가 발생했습니다.",
            });
        }
    }

    private handleError(error: { code: string; message: string }) {
        console.error("[TimelineManager]", error);
    }
}

export const timelineManager = new TimelineManager();
