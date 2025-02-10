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
                break;

            case "focusing":
                break;

            case "loading":
                // 로딩 상태에서는 카메라 위치 유지
                break;

            case "starting":
                break;

            case "ready":
                break;

            case "playing":
                break;

            case "changing":
                break;

            case "returning":
                break;

            case "error":
                break;
        }
    }
}
