import { COVER, LP_ROOT, RECORD } from "@/constants/lp";
import { Camera, Group, Vector3 } from "three";
import { easeOutLerp } from "utils/position";

const temp = new Vector3();

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
        goal: COVER.POS.focus,
        speedFactor: 0.1,
    });
    easeOutLerp({
        target: recordRef.position,
        goal: RECORD.POS.focus,
        speedFactor: 0.1,
    });

    lpGroup.lookAt(camera.position.clone());
};

export const returnLp = (
    lpGroup: Group,
    coverRef: Group,
    recordRef: Group,
    order: number,
    callback: () => void
) => {
    temp.set(order * 0.4, 0, 0);

    easeOutLerp({
        target: lpGroup.position,
        goal: temp,
        speedFactor: 15,
    });
    easeOutLerp({
        target: coverRef.position,
        goal: COVER.POS.init,
        speedFactor: 0.1,
    });
    easeOutLerp({
        target: recordRef.position,
        goal: RECORD.POS.init,
        speedFactor: 0.1,
    });

    if (temp.distanceTo(lpGroup.position) < 0.01) {
        lpGroup.position.copy(temp);
        lpGroup.rotation.set(...LP_ROOT.ROT.init);
        recordRef.rotation.set(0, 0, 0);
        recordRef.position.copy(RECORD.POS.init);
        coverRef.position.copy(COVER.POS.init);
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
        goal: COVER.POS.play,
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
        goal: COVER.POS.placing,
        speedFactor: 0.1,
    });

    coverRef.lookAt(new Vector3(0, 0, 1));
};
