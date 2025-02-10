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
    private originalParent: Object3D | null = null;
    private originalMatrix = new Matrix4();
    private currentAnim: AnimationStatus = "idle";

    private readonly temp = new Vector3();
    private readonly targetPosition = new Vector3();

    // LP와 커버의 상대 위치
    private readonly COVER_POS = {
        init: new Vector3(0, 0, 0),
        focus: new Vector3(-5, 0, 0),
        play: new Vector3(-50, 0, 0),
    };

    private readonly RECORD_POS = {
        init: new Vector3(0.5, 0, 0.3),
        focus: new Vector3(-0.5, 0, 0),
        play: new Vector3(0, 0, 0),
    };

    private readonly CAMERA_DISTANCE = -5; // 원하는 카메라와의 거리

    private readonly INIT_POS = {
        rotation: new Vector3(-Math.PI / 8, 0, 0),
        position: new Vector3(0, 0, 0),
    };

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
        // 선택되지 않은 상태일 때의 처리 (Deselection 시 애니메이션 실행)
        if (!isSelected && initialState) {
            easeOutLerp({
                target: lpGroup.position,
                goal: initialState.position,
                speedFactor: 15,
            });

            // 회전값도 부드럽게 초기 상태로 복귀 (lpGroup.rotation는 Euler 타입입니다)
            lpGroup.rotation.x +=
                (initialState.rotation.x - lpGroup.rotation.x) * 0.1;
            lpGroup.rotation.y +=
                (initialState.rotation.y - lpGroup.rotation.y) * 0.1;
            lpGroup.rotation.z +=
                (initialState.rotation.z - lpGroup.rotation.z) * 0.1;

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
            return; // deselection의 경우 focusing 등의 나머지 로직은 실행하지 않음
        }

        if (currentAnim === "focusing" && isSelected) {
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

            lpGroup.lookAt(camera.position);
        }

        // playing 상태의 애니메이션
        if (currentAnim === "playing" && isSelected) {
            recordRef.rotation.y += delta * 2;
        }
    }
}
