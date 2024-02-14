import { youtubeState } from "@constants/youtubeState";
import { Html } from "@react-three/drei";
import { albumState, setAlbumStatus, setPlayer } from "@states/album";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useSnapshot } from "valtio";

export const YTPlayer = () => {
    const isLoop = false;

    const snap = useSnapshot(albumState);
    const query = snap.album?.url.split("=") ?? [];
    const playlist = query.pop();

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
