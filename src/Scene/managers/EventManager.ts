import { Album } from "@/types/Album";

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
    type: "LP_SELECTED" | "LP_UNSELECTED" | "LP_PLAYING";
    payload: {
        album: Album | null;
        lpId: string | null;
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
                if (
                    this.selectedLpId &&
                    this.selectedLpId !== event.payload.lpId
                ) {
                    this.unselect();
                }

                this.selectedLpId = event.payload.lpId;
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
                payload: { album: null, lpId: this.selectedLpId },
            })
        );
        this.selectedLpId = null;
    }

    select({
        album,
        onUnselect,
        onPlaying,
    }: {
        album: Album;
        onUnselect: () => void;
        onPlaying: () => void;
    }) {
        this.emit({
            type: "LP_SELECTED",
            payload: { album, lpId: album.id },
        });

        const unsubscribe = this.subscribe((event) => {
            if (event.type === "LP_UNSELECTED") {
                onUnselect();
                unsubscribe();
            } else if (event.type === "LP_PLAYING") {
                onPlaying();
            }
        });
    }
}

export const eventManager = new EventManager();
