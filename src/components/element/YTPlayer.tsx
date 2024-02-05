import { Html, useBounds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { albumState, setPlayer } from "@states/album";
import { refState } from "@states/refState";
import { useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Vector3 } from "three";
import { lerp3Vec } from "utils";
import { useSnapshot } from "valtio";

const LP_PLAYER_POS = new Vector3(-26, -25, 10);

interface YTVProps {
    onStateChange: (event: YouTubeEvent<number>) => void;
    onError: (event: YouTubeEvent<number>) => void;
    isLoop: boolean;
}

export const YTPlayer = ({ onStateChange, onError, isLoop }: YTVProps) => {
    const lerped = useRef(false);

    const snap = useSnapshot(albumState);
    const query = snap.album?.url.split("=") ?? [];
    const playlist = query[query.length - 1] ?? "";

    const bounds = useBounds();

    useFrame(() => {
        if (
            snap.status === "playing" &&
            refState.lpPlayer &&
            refState.currentRecord &&
            refState.root
        ) {
            lerp3Vec(refState.root.position, LP_PLAYER_POS);
            lerp3Vec(refState.currentRecord.position, LP_PLAYER_POS);

            if (
                refState.root.position.distanceTo(LP_PLAYER_POS) <= 0.5 &&
                !lerped.current
            ) {
                lerped.current = true;

                bounds.refresh(refState.lpPlayer).fit();
            }
        }
    });

    return (
        <Html
            transform
            occlude="blending"
            position={[0, 0.2, 0]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        >
            <YouTube
                onReady={(event) => {
                    setPlayer(
                        event.target as YouTubePlayer & {
                            playerInfo: { playlistIndex: number };
                        }
                    );
                }}
                onStateChange={onStateChange}
                onError={onError}
                opts={{
                    width: 360,
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
