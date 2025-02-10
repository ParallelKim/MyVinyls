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
        try {
            if (event.type === "LP_SELECTED") {
                if (
                    this.selectedLpId &&
                    this.selectedLpId !== event.payload.lpId
                ) {
                    // 기존 앨범이 선택되어 있다면 먼저 deselection 이벤트 발행
                    this.handlers.forEach((handler) =>
                        handler({
                            type: "LP_UNSELECTED",
                            payload: { album: null, lpId: this.selectedLpId },
                        })
                    );
                    // deselection 애니메이션이 실행될 시간을 주기 위해 딜레이 후 새 선택 이벤트 발행
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
            console.error("LP 이벤트 발행 중 에러 발생: ", error);
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
