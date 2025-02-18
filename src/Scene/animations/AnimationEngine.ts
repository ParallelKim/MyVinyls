import gsap from "gsap";
import { YouTubePlayer } from "react-youtube";
import { Album } from "@/types/Album"

export type AnimationStatus =
    | "idle"
    | "focusing"
    | "loading"
    | "starting"
    | "ready"
    | "playing"
    | "changing"
    | "returning"
    | "error";

export type AnimationEvent = {
    type: "LP_SELECTED" | "LP_UNSELECTED";
    payload: {
        album: any; // 실제 타입에 맞게 수정 (예: Album)
        lpId: string | null;
    };
};

export class EventManager {
    private handlers: ((event: AnimationEvent) => void)[] = [];
    private selectedLpId: string | null = null;

    subscribe(handler: (event: AnimationEvent) => void) {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter((h) => h !== handler);
        };
    }

    emit(event: AnimationEvent) {
        try {
            if (event.type === "LP_SELECTED") {
                if (
                    this.selectedLpId &&
                    this.selectedLpId !== event.payload.lpId
                ) {
                    // 기존 LP 해제 이벤트 발행
                    this.handlers.forEach((handler) =>
                        handler({
                            type: "LP_UNSELECTED",
                            payload: { album: null, lpId: this.selectedLpId },
                        })
                    );
                }

                this.selectedLpId = event.payload.lpId;
            } else if (event.type === "LP_UNSELECTED") {
                this.selectedLpId = null;
            }
            this.handlers.forEach((handler) => handler(event));
        } catch (error) {
            console.error("UnifiedEventManager - 이벤트 발행 중 에러:", error);
        }
    }

    isSelected(lpId: string): boolean {
        return this.selectedLpId === lpId;
    }

    unselect() {
        this.handlers.forEach((handler) =>
            handler({
                type: "LP_UNSELECTED",
                payload: { album: null, lpId: this.selectedLpId },
            })
        );
        this.selectedLpId = null;
    }

    select(album: Album) {
        this.emit({
            type: "LP_SELECTED",
            payload: { album, lpId: album.id },
        });
    }
}

export class TimelineManager {
    private timeline: gsap.core.Timeline | null = null;
    private lastSongIndex: number | null = null;

    constructor(
        private onError?: (error: { code: string; message: string }) => void
    ) {}

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
        console.error("[BaseTimelineManager]", error);
        this.onError?.(error);
    }
}

export const eventManager = new EventManager();
