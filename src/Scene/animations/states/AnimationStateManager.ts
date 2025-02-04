import { CameraControls } from "@react-three/drei";
import { Group } from "three";

export type AnimationStatus =
    | "idle"
    | "focusing"
    | "starting"
    | "ready"
    | "playing";

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
            case "focusing":
                // Will be implemented later
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

            case "idle":
                this.setIsPlaying(false);
                break;
        }
    }

    private async handleStartingState() {
        const { controls, root } = this.context;

        this.setIsPlaying(true);
        controls.smoothTime = 1;

        if (root.lpPlayer) {
            const { x, y, z } = root.lpPlayer.position;
            controls.setOrbitPoint(x, y, z);
            controls.fitToBox(root.lpPlayer, true, {
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
}
