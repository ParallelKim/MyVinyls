import { Album } from "@/types/Album";
import type { LpManager } from "./LpManager";

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

type AnimationEventType =
    | "LP_SELECTED"
    | "LP_UNSELECTED"
    | "LP_PLAYING"
    | "LP_PAUSED"
    | "LP_RESUME";

export type AnimationEvent = {
    type: AnimationEventType;
    payload: {
        album: Album | null;
        lpId?: string;
        songIndex?: number;
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
                const needUnselect =
                    this.selectedLpId &&
                    this.selectedLpId !== event.payload.lpId;

                if (needUnselect) this.unselect();

                this.selectedLpId = event.payload.lpId ?? null;
            }
            this.handlers.forEach((handler) => handler(event));
            if (event.type === "LP_UNSELECTED") {
                this.selectedLpId = null;
            }
        } catch (error) {
            console.error("EventManager - 이벤트 발행 중 에러:", error);
        }
    }

    isSelected(lpId: string): boolean {
        return this.selectedLpId === lpId;
    }

    unselect() {
        this.handlers.forEach((handler) =>
            handler({
                type: "LP_UNSELECTED",
                payload: { album: null, lpId: this.selectedLpId ?? undefined },
            })
        );
        this.selectedLpId = null;
    }

    select(lpManager: LpManager) {
        this.emit({
            type: "LP_SELECTED",
            payload: { album: lpManager.album, lpId: lpManager.album.id },
        });

        const unsubscribe = this.subscribe((event) => {
            if (event.type === "LP_PLAYING") lpManager.lpState = "placing";
            if (event.type === "LP_PAUSED") lpManager.lpState = "paused";
            if (event.type === "LP_RESUME") lpManager.lpState = "playing";
            if (event.type === "LP_UNSELECTED") {
                lpManager.lpState = "returning";
                unsubscribe();
            }
        });
    }
}

export const eventManager = new EventManager();
