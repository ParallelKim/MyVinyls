import { Group, Vector3, Camera } from "three";
import { AnimationStatus } from "../AnimationEngine";
import { easeOutLerp } from "utils/position";

type UpdateParams = {
    delta: number;
    currentAnim: AnimationStatus;
    camera: Camera;
    lpGroup: Group;
    coverRef: Group;
    recordRef: Group;
    isSelected: boolean;
    station: Group;
    initialState: {
        position: Vector3;
        rotation: Vector3;
    } | null;
};

export class LpAnimationManager {
    private readonly temp = new Vector3();

    // loading 상태일 때, LP 레코드가 LP Player(예, station) 위로 이동하도록 함
    private updateLoadingAnimation(
        delta: number,
        recordRef: Group,
        station: Group
    ) {
        if (station) {
            station.getWorldPosition(this.temp);

            this.temp.y += 0.5; // 오프셋 조절
            if (recordRef.parent) {
                recordRef.parent.worldToLocal(this.temp);
            }

            easeOutLerp({
                target: recordRef.position,
                goal: this.temp,
                speedFactor: 10,
            });
            this.temp.y += 10;
            recordRef.lookAt(this.temp);
        }
    }

    // playing 상태에서는 지속적인 회전만 적용합니다.
    private updatePlayingAnimation(delta: number, recordRef: Group) {
        recordRef.rotation.y += delta * 2;
    }

    update({ delta, currentAnim, recordRef, station }: UpdateParams) {
        if (currentAnim === "loading") {
            this.updateLoadingAnimation(delta, recordRef, station);
        } else if (currentAnim === "playing") {
            this.updatePlayingAnimation(delta, recordRef);
        }
    }
}
