import { Html } from "@react-three/drei";
import { setPlayer } from "@states/album";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

interface YTVProps {
    playlist: string;
    onStateChange: (event: YouTubeEvent<number>) => void;
    onError: (event: YouTubeEvent<number>) => void;
    isLoop: boolean;
}

export const YTPlayer = ({
    playlist,
    onStateChange,
    onError,
    isLoop,
}: YTVProps) => {
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
