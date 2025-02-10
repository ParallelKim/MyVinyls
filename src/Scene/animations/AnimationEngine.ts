/**
 * AnimationEngine 모듈은 이벤트 관리, 애니메이션 상태 전환, 타임라인 관리를 통합합니다.
 */

import gsap from "gsap";
import { Group, Vector3, Camera } from "three";
import { YouTubePlayer } from "react-youtube";

// -----------------------------------------
// 1. 애니메이션 상태 타입 (기존 AnimationStateManager.ts와 동일)
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

// -----------------------------------------
// 2. 공통 이벤트 타입 (기존 LpEventManager.ts와 유사)
export type AnimationEvent = {
    type: "LP_SELECTED" | "LP_UNSELECTED";
    payload: {
        album: any; // 실제 타입에 맞게 수정 (예: Album)
        lpId: string | null;
    };
};

// -----------------------------------------
// 3. UnifiedEventManager
//    LP 선택/해제 이벤트의 구독 및 발행을 통합 관리합니다.
export class UnifiedEventManager {
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
                    // 딜레이 후 새 LP 선택 이벤트 처리
                    setTimeout(() => {
                        this.selectedLpId = event.payload.lpId;
                        this.handlers.forEach((handler) => handler(event));
                    }, 500);
                } else {
                    this.selectedLpId = event.payload.lpId;
                    this.handlers.forEach((handler) => handler(event));
                }
            } else if (event.type === "LP_UNSELECTED") {
                this.selectedLpId = null;
                this.handlers.forEach((handler) => handler(event));
            }
        } catch (error) {
            console.error("UnifiedEventManager - 이벤트 발행 중 에러:", error);
        }
    }

    isSelected(lpId: string): boolean {
        return this.selectedLpId === lpId;
    }

    unselect() {
        this.selectedLpId = null;
        this.handlers.forEach((handler) =>
            handler({
                type: "LP_UNSELECTED",
                payload: { album: null, lpId: null },
            })
        );
    }
}

// -----------------------------------------
// 4. BaseAnimationStateManager
//    애니메이션 상태 전환을 위한 공통 로직 (UI 업데이트, 인터랙션 제어 등)
export class BaseAnimationStateManager {
    constructor(
        private context: { controls: any; root: Group },
        private setIsPlaying: (isPlaying: boolean) => void,
        private setCurrentAnim: (state: AnimationStatus) => void
    ) {}

    async handleState(currentState: AnimationStatus) {
        // 상태 전환 시 공통 처리 로직 (예: 인터랙션 제한, UI 업데이트 등)
        switch (currentState) {
            case "idle":
                // idle 상태 처리
                break;
            case "focusing":
                // focusing 상태 처리
                break;
            case "loading":
                // loading 상태에서는 카메라 위치 유지 등 처리
                break;
            case "starting":
                // starting 상태 처리
                break;
            case "ready":
                // ready 상태 처리
                break;
            case "playing":
                // playing 상태 처리
                break;
            case "changing":
                // changing 상태 처리
                break;
            case "returning":
                // returning 상태 처리
                break;
            case "error":
                // error 상태 처리
                break;
            default:
                break;
        }
    }
}

// -----------------------------------------
// 5. BaseTimelineManager
//    GSAP 타임라인을 관리하고, YouTube 동기화, 상태 업데이트 및 에러 핸들링을 일원화합니다.
export class BaseTimelineManager {
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

// unifiedEventManager 싱글톤 인스턴스 추가
export const unifiedEventManager = new UnifiedEventManager();
