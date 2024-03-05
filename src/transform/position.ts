import { Vector3 } from "three";

export const easeOutLerp = (
    objectPos: Vector3,
    targetPos: Vector3,
    speedFactor: number = 1
) => {
    const dis = targetPos.distanceTo(objectPos);
    const speed = Math.min(0.1, 1 / dis) * speedFactor;

    objectPos.lerp(targetPos, speed);

    if (dis < 0.01 && dis > 0) {
        objectPos.copy(targetPos);
    }
};
