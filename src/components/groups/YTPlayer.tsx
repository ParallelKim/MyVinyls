import { Html } from "@react-three/drei";
import YouTube, { YouTubePlayer } from "react-youtube";

import { youtubeState } from "@/constants/youtubeState";
import usePlayerStore from "@/states/playerStore";

export const YTPlayer = () => {
    const { album, setPlayer, setStatus } = usePlayerStore();
    const isLoop = false;

    const query = album?.url.split("list=") ?? [];
    const playlist = query.pop();

    if (!playlist) return null;

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
            transform
            occlude
            scale={0.05}
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
