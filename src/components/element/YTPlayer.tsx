import { youtubeState } from "@constants/youtubeState";
import { Html, useBounds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { albumState, setAlbumStatus, setPlayer } from "@states/album";
import { refState } from "@states/refState";
import { useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { Vector3 } from "three";
import { lerp3Vec } from "utils";
import { useSnapshot } from "valtio";

const LP_PLAYER_POS = new Vector3(-26, -25, 10);

export const YTPlayer = () => {
    const lerped = useRef(false);
    const isLoop = false;

    const snap = useSnapshot(albumState);
    const query = snap.album?.url.split("=") ?? [];
    const playlist = query.pop();

    const bounds = useBounds();

    useFrame(() => {
        if (
            snap.status === "playing" &&
            refState.lpPlayer &&
            refState.currentRecord &&
            refState.root
        ) {
            // lerp3Vec(refState.root.position, LP_PLAYER_POS);
            // lerp3Vec(refState.currentRecord.position, LP_PLAYER_POS);
            // if (
            //     refState.root.position.distanceTo(LP_PLAYER_POS) <= 0.5 &&
            //     !lerped.current
            // ) {
            //     lerped.current = true;
            bounds.refresh(refState.lpPlayer).fit();
            // }
        }
    });

    if (!playlist) return null;

    return (
        <Html
            transform
            occlude="blending"
            position={[0, 2.5, -0.16]}
            rotation={[Math.PI / 4.75, Math.PI, 0]}
            scale={0.2}
        >
            <YouTube
                onReady={(event) => {
                    setPlayer(
                        event.target as YouTubePlayer & {
                            playerInfo: { playlistIndex: number };
                        }
                    );
                }}
                onStateChange={async function (e) {
                    const statusStr = youtubeState[e.data];
                    console.log(e, statusStr);
                    setAlbumStatus(statusStr, await e.target.getDuration());
                }}
                opts={{
                    width: 340,
                    height: 270,
                    playerVars: {
                        color: "white",
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        autoplay: 0,
                        loop: isLoop ? 1 : 0,
                        listType: "playlist",
                        list: playlist,
                    },
                }}
            />
        </Html>
    );
};
