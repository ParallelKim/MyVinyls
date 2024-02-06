// import { useGSAP } from "@gsap/react";
// import { albumState } from "@states/album";
// import { FocusedAlbum } from "../types/Album";
// import gsap from "gsap";
// import { useRef, useEffect } from "react";
// import { useSnapshot, subscribe } from "valtio";
// import { refState } from "@states/refState";

// export const AnimationManager = () => {
//     const snap = useSnapshot(albumState);
//     const refSnap = useSnapshot(refState);

//     useEffect(() =>
//         subscribe(albumState, () => {
//             (() => {
//                 const anim = youtubeTimeline.current;
//                 if (!anim) return;
//                 if (albumState.status === "playing") {
//                     anim.play();
//                 } else if (albumState.status === "paused") {
//                     anim.pause();
//                 } else if (albumState.status === "unstarted") {
//                     anim.seek(0);
//                 }
//             })();
//         })
//     );

//     return null;
// };
