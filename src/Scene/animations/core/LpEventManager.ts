import { Album } from "../../../types/Album";

export type LpEvent = {
    type: "LP_SELECTED" | "LP_UNSELECTED";
    payload: {
        album: Album | null;
        lpId: string | null;
    };
};

type EventHandler = (event: LpEvent) => void;

export class LpEventManager {
    private handlers: EventHandler[] = [];
    private selectedLpId: string | null = null;

    subscribe(handler: EventHandler) {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter((h) => h !== handler);
        };
    }

    emit(event: LpEvent) {
        // LP_SELECTED 이벤트일 때 이전 선택과 다른 LP라면 자동으로 교체
        if (
            event.type === "LP_SELECTED" &&
            event.payload.lpId !== this.selectedLpId
        ) {
            this.selectedLpId = event.payload.lpId;
            this.handlers.forEach((handler) => handler(event));
        } else if (event.type === "LP_UNSELECTED") {
            this.selectedLpId = null;
            this.handlers.forEach((handler) => handler(event));
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

// 싱글톤 인스턴스 생성
export const lpEventManager = new LpEventManager();
