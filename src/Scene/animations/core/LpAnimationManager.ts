import { Group, Vector3, Matrix4, Object3D, Camera } from "three";
import { AnimationStatus } from "../states/AnimationStateManager";
import { easeOutLerp } from "utils/position";

type UpdateParams = {
    delta: number;
    currentAnim: AnimationStatus;
    camera: Camera;
    lpGroup: Group;
    coverRef: Group;
    recordRef: Group;
    isSelected: boolean;
    initialState: {
        position: Vector3;
        rotation: Vector3;
    } | null;
};

export class LpAnimationManager {
    private readonly temp = new Vector3();

    // LP와 커버의 상대 위치
    private readonly COVER_POS = {
        init: new Vector3(0, 0, 0),
        focus: new Vector3(3.5, 0, 0),
        play: new Vector3(-50, 0, 0),
    };

    private readonly RECORD_POS = {
        init: new Vector3(0.5, 0, 0.3),
        focus: new Vector3(0, 0, 0.1),
        play: new Vector3(0, 0, 0),
    };

    private readonly CAMERA_DISTANCE = -5; // 원하는 카메라와의 거리

    private updateDeselectionAnimation(
        lpGroup: Group,
        coverRef: Group,
        recordRef: Group,
        initialState: { position: Vector3; rotation: Vector3 }
    ) {
        // LP deselection 시 위치 보간
        easeOutLerp({
            target: lpGroup.position,
            goal: initialState.position,
            speedFactor: 15,
        });

        // 회전 보간
        lpGroup.rotation.x +=
            (initialState.rotation.x - lpGroup.rotation.x) * 0.1;
        lpGroup.rotation.y +=
            (initialState.rotation.y - lpGroup.rotation.y) * 0.1;
        lpGroup.rotation.z +=
            (initialState.rotation.z - lpGroup.rotation.z) * 0.1;

        // 커버와 레코드의 초기 상태 복귀
        easeOutLerp({
            target: coverRef.position,
            goal: this.COVER_POS.init,
            speedFactor: 0.1,
        });
        easeOutLerp({
            target: recordRef.position,
            goal: this.RECORD_POS.init,
            speedFactor: 0.1,
        });
    }

    private updateFocusingAnimation(
        delta: number,
        camera: Camera,
        lpGroup: Group,
        coverRef: Group,
        recordRef: Group
    ) {
        // 카메라와의 거리 설정
        this.temp.set(0, 0, this.CAMERA_DISTANCE);
        camera.localToWorld(this.temp);
        lpGroup.parent?.worldToLocal(this.temp);

        easeOutLerp({
            target: lpGroup.position,
            goal: this.temp,
            speedFactor: 15,
        });
        easeOutLerp({
            target: coverRef.position,
            goal: this.COVER_POS.focus,
            speedFactor: 0.1,
        });
        easeOutLerp({
            target: recordRef.position,
            goal: this.RECORD_POS.focus,
            speedFactor: 0.1,
        });

        lpGroup.lookAt(camera.position.clone().negate());
    }

    private updatePlayingAnimation(delta: number, recordRef: Group) {
        recordRef.rotation.y += delta * 2;
    }

    update({
        delta,
        currentAnim,
        camera,
        lpGroup,
        coverRef,
        recordRef,
        isSelected,
        initialState,
    }: UpdateParams) {
        if (!isSelected && initialState) {
            this.updateDeselectionAnimation(
                lpGroup,
                coverRef,
                recordRef,
                initialState
            );
            return;
        }

        if (currentAnim === "focusing" && isSelected) {
            this.updateFocusingAnimation(
                delta,
                camera,
                lpGroup,
                coverRef,
                recordRef
            );
        }

        if (currentAnim === "playing" && isSelected) {
            this.updatePlayingAnimation(delta, recordRef);
        }
    }
}
