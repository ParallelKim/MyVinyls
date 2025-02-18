import { Camera, Group, Vector3 } from "three";
import { easeOutLerp } from "utils/position";

const temp = new Vector3();

const COVER_POS = {
    init: new Vector3(0, 0, 0),
    focus: new Vector3(3.5, 0, 0),
    play: new Vector3(-50, 0, 0),
    placing: new Vector3(-50, 0, 0),
};

const RECORD_POS = {
    init: new Vector3(0.5, 0, 0.3),
    focus: new Vector3(0, 0, 0.1),
    play: new Vector3(0, 1.5, 0),
};

const CAMERA_DISTANCE = -5; // 원하는 카메라와의 거리

export const focusLp = (
    camera: Camera,
    lpGroup: Group,
    coverRef: Group,
    recordRef: Group
) => {
    // 카메라와의 거리 설정
    temp.set(0, 0, CAMERA_DISTANCE);
    camera.localToWorld(temp);
    lpGroup.parent?.worldToLocal(temp);

    easeOutLerp({
        target: lpGroup.position,
        goal: temp,
        speedFactor: 15,
    });
    easeOutLerp({
        target: coverRef.position,
        goal: COVER_POS.focus,
        speedFactor: 0.1,
    });
    easeOutLerp({
        target: recordRef.position,
        goal: RECORD_POS.focus,
        speedFactor: 0.1,
    });

    lpGroup.lookAt(camera.position.clone().negate());
};

export const returnLp = (
    lpGroup: Group,
    coverRef: Group,
    recordRef: Group,
    order: number,
    callback: () => void
) => {
    temp.set(order * -12, 0, 0);

    easeOutLerp({
        target: lpGroup.position,
        goal: temp,
        speedFactor: 15,
    });
    easeOutLerp({
        target: coverRef.position,
        goal: COVER_POS.init,
        speedFactor: 0.1,
    });
    easeOutLerp({
        target: recordRef.position,
        goal: RECORD_POS.init,
        speedFactor: 0.1,
    });

    if (temp.distanceTo(lpGroup.position) < 0.01) {
        lpGroup.position.copy(temp);
        lpGroup.rotation.set(Math.PI / 8, 0, 0);
        recordRef.rotation.set(0, 0, 0);
        recordRef.position.copy(RECORD_POS.init);
        coverRef.position.copy(COVER_POS.init);
        callback();
    }
};

export const playLp = (
    camera: Camera,
    lpGroup: Group,
    coverRef: Group,
    recordRef: Group
) => {
    easeOutLerp({
        target: camera.position,
        goal: COVER_POS.play,
        speedFactor: 15,
    });
};

export const placeLp = (coverRef: Group, recordRef: Group, station: Group) => {
    // 카메라와의 거리 설정
    temp.copy(station.position);
    recordRef.parent?.worldToLocal(temp);

    easeOutLerp({
        target: recordRef.position,
        goal: temp,
        speedFactor: 15,
    });

    easeOutLerp({
        target: coverRef.position,
        goal: COVER_POS.placing,
        speedFactor: 0.1,
    });

    coverRef.lookAt(new Vector3(0, 0, 1));
};
