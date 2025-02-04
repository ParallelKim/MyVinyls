import { Html } from "@react-three/drei";
import YouTube, { YouTubePlayer } from "react-youtube";

import { youtubeState } from "@constants/youtubeState";
import useAlbumStore from "@states/albumStore";

export const YTPlayer = () => {
    const { album, setPlayer, setStatus } = useAlbumStore();
    const isLoop = false;

    const query = album?.url.split("list=") ?? [];
    const playlist = query.pop();

    if (!playlist) return null;

    return (
        <Html
            transform
            occlude
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
                    setStatus(statusStr, await e.target.getDuration());
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
