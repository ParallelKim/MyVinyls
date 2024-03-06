import { Vector3 } from "three";

const origin = new Vector3();

export const easeOutLerp = ({
    target,
    goal,
    speedFactor = 1,
    onEnded,
}: {
    target: Vector3;
    goal?: Vector3;
    speedFactor?: number;
    onEnded?: () => void;
}) => {
    goal = goal ?? origin;
    const dis = goal.distanceTo(target);

    if (dis === 0) return;

    const speed = Math.min(0.1, 1 / dis) * speedFactor;

    target.lerp(goal, speed);

    if (dis < 0.01 && dis > 0) {
        target.copy(goal);
        onEnded?.();
    }
};
