import { Vector3 } from "three";

const origin = new Vector3();

export const easeOutLerp = ({
    target,
    goal,
    speedFactor = 1,
    onEnded,
    onUpdate,
}: {
    target: Vector3;
    goal?: Vector3;
    speedFactor?: number;
    onEnded?: () => void;
    onUpdate?: (dis: number) => void;
}) => {
    goal = goal ?? origin;
    const dis = goal.distanceTo(target);

    if (dis === 0) return;

    onUpdate?.(dis);

    if (dis < 0.001 && dis > 0) {
        target.copy(goal);
        onEnded?.();
    }

    const alpha = Math.min(0.1, 1 / dis) * speedFactor;

    target.lerp(goal, alpha);
};
