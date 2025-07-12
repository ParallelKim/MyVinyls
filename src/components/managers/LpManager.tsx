import type { ThreeEvent } from "@react-three/fiber";
import type { RefObject } from "react";
import {
    Vector3,
    type Camera,
    type Group,
    type Object3D,
    type Scene,
} from "three";
import { lerp } from "three/src/math/MathUtils.js";

import { COVER, LP_ROOT, RECORD } from "@/constants/lp";
import type { Album } from "@/types/Album";
import { easeOutLerp } from "@/utils/position";
import { eventManager } from "./EventManager";

const temp = new Vector3();
const CAMERA_DISTANCE = -1.05; // 원하는 카메라와의 거리

export class LpManager {
    public lpState:
        | "idle"
        | "focus"
        | "placing"
        | "paused"
        | "playing"
        | "returning" = "idle";

    public rotationSpeed = 0;

    get lpGroupRef() {
        return this.groupRef.current as Group;
    }
    get coverRef() {
        return this.lpGroupRef?.getObjectByName("cover") as Group;
    }
    get recordRef() {
        return this.lpGroupRef?.getObjectByName("record") as Group;
    }

    constructor(
        public album: Album,
        public order: number,
        public groupRef: RefObject<Group>
    ) {}

    public onClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!this.lpGroupRef) return;

        const isSelected = eventManager.isSelected(this.album.id);

        if (isSelected) {
            eventManager.unselect();
        } else {
            this.lpState = "focus";
            eventManager.select(this);
        }
    };

    public onFrame = ({
        scene,
        controls,
        camera,
    }: {
        scene: Scene;
        controls: any;
        camera: Camera;
    }) => {
        if (this.lpState === "idle") return;
        if (this.lpState === "focus") this.focus(camera);
        if (this.lpState === "returning") this.return();
        if (this.lpState === "placing") {
            const station = scene.getObjectByName("stationTarget");
            if (!station) return;

            this.place(station, controls);
        }
        if (this.lpState === "playing") this.play();
        if (this.lpState === "paused") this.pause();

        this.recordRef.rotation.z += this.rotationSpeed;
    };

    focus = (camera: Camera) => {
        // 카메라와의 거리 설정
        temp.set(0.01, 0, CAMERA_DISTANCE);
        camera.localToWorld(temp);
        this.lpGroupRef.parent?.worldToLocal(temp);

        easeOutLerp({
            target: this.lpGroupRef.position,
            goal: temp,
        });
        easeOutLerp({
            target: this.coverRef.position,
            goal: COVER.POS.focus,
            speedFactor: 0.1,
        });
        easeOutLerp({
            target: this.recordRef.position,
            goal: RECORD.POS.focus,
            speedFactor: 0.01,
        });

        this.lpGroupRef.lookAt(camera.position.clone());
    };

    return = () => {
        temp.set(this.order * 0.4, 0, 0);

        easeOutLerp({
            target: this.lpGroupRef.position,
            goal: temp,
            speedFactor: 15,
        });
        easeOutLerp({
            target: this.coverRef.position,
            goal: COVER.POS.init,
            speedFactor: 0.1,
        });
        easeOutLerp({
            target: this.recordRef.position,
            goal: RECORD.POS.init,
            speedFactor: 0.1,
        });

        if (temp.distanceTo(this.lpGroupRef.position) < 0.01) {
            this.lpGroupRef.position.copy(temp);
            this.lpGroupRef.rotation.set(...LP_ROOT.ROT.init);
            this.recordRef.position.copy(RECORD.POS.init);
            this.recordRef.rotation.set(0, 0, -Math.PI / 2);
            this.coverRef.position.copy(COVER.POS.init);
            this.lpState = "idle";
        }
    };

    place = (station: Object3D, controls: any) => {
        temp.set(0, 0, 0);

        this.lpGroupRef.rotation.set(0, 0, 0);

        station.localToWorld(temp);
        this.lpGroupRef.worldToLocal(temp);
        easeOutLerp({
            target: this.recordRef.position,
            goal: temp,
            speedFactor: 1,
        });
        this.recordRef.rotation.set(-Math.PI / 2, 0.0, 0);

        easeOutLerp({
            target: this.coverRef.position,
            goal: COVER.POS.placing,
            speedFactor: 0.1,
        });

        if (temp.distanceTo(this.recordRef.position) < 0.01) {
            this.recordRef.position.copy(temp);
            controls.rotate(0, -Math.PI / 8, true);
            this.lpState = "playing";
        }
    };

    play = () => {
        this.rotationSpeed = lerp(this.rotationSpeed, Math.PI / 180, 0.02);
    };

    pause = () => {
        this.rotationSpeed = lerp(this.rotationSpeed, 0, 0.02);
    };
}
