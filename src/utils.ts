import { Vector3 } from "three";

export const lerp = (from: number, to: number, speed: number) => {
    const r = (1 - speed) * from + speed * to;
    return Math.abs(from - to) < 0.001 ? to : r;
};

export const lerp3Vec = (from: Vector3, to: Vector3, speed: number = 1) => {
    const dis = from.distanceTo(to);

    if (dis === 0) return;

    if (dis < 0.001) {
        from.copy(to);
        return;
    }

    const velocity = speed * Math.min(0.1, 1 / dis);
    from.lerp(to, velocity);
};
