import { Html } from "@react-three/drei";
import YouTube, { YouTubePlayer } from "react-youtube";

import { youtubeState } from "@/constants/youtubeState";
import usePlayerStore from "@/states/playerStore";

export const YTPlayer = () => {
    const { album, setPlayer, setStatus } = usePlayerStore();
    const isLoop = false;

    const query = album?.url.split("list=") ?? [];
    const playlist = query.pop();

    const options = {
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
    } as const;

    return (
        <Html
            renderOrder={-10}
            transform
            occlude="blending"
            scale={0.034}
            position={[-0.051, 0.463, -1.18]}
            rotation={[-Math.PI / 4.8, 0, 0]}
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
                    setStatus(statusStr, await e.target.getDuration());
                }}
                opts={options}
            />
        </Html>
    );
};
