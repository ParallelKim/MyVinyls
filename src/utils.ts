import { Vector3 } from "three";

export const lerp = (from: number, to: number, speed: number) => {
    const r = (1 - speed) * from + speed * to;
    return Math.abs(from - to) < 0.001 ? to : r;
};

export const lerp3V = (from: Vector3, to: Vector3, factor: number) => {
    const dis = from.distanceTo(to);
    if (dis < 0.001) {
        from.copy(to);
        return;
    }

    const speed = dis / factor;

    from.multiplyScalar(1 - speed);
    from.add(to.clone().multiplyScalar(speed));
};
