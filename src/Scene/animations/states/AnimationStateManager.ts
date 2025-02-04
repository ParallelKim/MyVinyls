import { CAMERA_SETTINGS } from "@constants/sceneConstants";
import { CameraControls } from "@react-three/drei";
import { Group } from "three";

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

interface AnimationContext {
    controls: CameraControls;
    root: Group & {
        lpPlayer?: Group;
        currentRecord?: Group;
    };
}

export class AnimationStateManager {
    private context: AnimationContext;
    private setIsPlaying: (isPlaying: boolean) => void;
    private setCurrentAnim: (state: AnimationStatus) => void;

    constructor(
        context: AnimationContext,
        setIsPlaying: (isPlaying: boolean) => void,
        setCurrentAnim: (state: AnimationStatus) => void
    ) {
        this.context = context;
        this.setIsPlaying = setIsPlaying;
        this.setCurrentAnim = setCurrentAnim;
    }

    async handleState(currentState: AnimationStatus) {
        switch (currentState) {
            case "idle":
                await this.handleIdleState();
                break;

            case "focusing":
                await this.handleFocusingState();
                break;

            case "loading":
                // 로딩 상태에서는 카메라 위치 유지
                break;

            case "starting":
                await this.handleStartingState();
                break;

            case "ready":
                await this.handleReadyState();
                break;

            case "playing":
                await this.handlePlayingState();
                break;

            case "changing":
                await this.handleChangingState();
                break;

            case "returning":
                await this.handleReturningState();
                break;

            case "error":
                await this.handleErrorState();
                break;
        }
    }

    private async handleIdleState() {
        const { controls } = this.context;

        this.setIsPlaying(false);
        controls.smoothTime = 1;

        // App의 초기 카메라 위치로 복귀
        await controls.setPosition(...CAMERA_SETTINGS.POSITION);
        await controls.setTarget(0, 0, 0);
    }

    private async handleFocusingState() {
        const { controls, root } = this.context;

        // focusing 상태로 먼저 설정
        this.setCurrentAnim("focusing");

        if (root.currentRecord) {
            controls.smoothTime = 0.8;

            // 선택된 LP를 중심으로 카메라 이동
            await controls.fitToBox(root.currentRecord, true, {
                paddingLeft: 2,
                paddingRight: 0.5,
                paddingTop: 0.5,
                paddingBottom: 0.5,
            });

            // 약간 측면에서 보는 각도로 조정
            await controls.rotate(Math.PI / 6, 0, true);
        }
    }

    private async handleStartingState() {
        const { controls, root } = this.context;

        this.setIsPlaying(true);
        controls.smoothTime = 1;

        if (root.lpPlayer) {
            const { x, y, z } = root.lpPlayer.position;
            controls.setOrbitPoint(x, y, z);
            await controls.fitToBox(root.lpPlayer, true, {
                paddingBottom: 2,
                paddingTop: 2,
            });
        }

        await controls.rotateAzimuthTo(Math.PI, true);
        await controls.rotatePolarTo(0, true);
        this.setCurrentAnim("ready");
    }

    private async handleReadyState() {
        const { controls, root } = this.context;

        if (root.currentRecord) {
            await controls.fitToBox(root.currentRecord, true, {
                cover: true,
            });

            controls.smoothTime = 0.25;
            this.setCurrentAnim("playing");
        }
    }

    private async handlePlayingState() {
        const { controls } = this.context;
        await controls.rotatePolarTo(Math.PI / 3, true);
    }

    private async handleChangingState() {
        const { controls, root } = this.context;

        // 현재 LP를 플레이어에서 제거하는 애니메이션
        if (root.currentRecord) {
            controls.smoothTime = 0.5;
            await controls.fitToBox(root.currentRecord, true, {
                paddingTop: 1,
            });
        }

        // 새로운 LP가 설정되면 ready 상태로 전환
        this.setCurrentAnim("ready");
    }

    private async handleReturningState() {
        this.setCurrentAnim("idle");
    }

    private async handleErrorState() {
        const { controls } = this.context;

        // 오류 상태에서는 현재 카메라 위치 유지
        controls.smoothTime = 0.5;
    }
}
