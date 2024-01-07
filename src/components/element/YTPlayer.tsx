import { Html } from "@react-three/drei";
import YouTube from "react-youtube";
import { YouTubeEvent } from "react-youtube";

interface YTVProps {
    onReady: (event: YouTubeEvent<number>) => void;
    onStateChange: (event: YouTubeEvent<number>) => void;
    onError: (event: YouTubeEvent<number>) => void;
    isLoop: boolean;
}
export const YoutubeVideo = ({
    onReady,
    onStateChange,
    onError,
    isLoop,
}: YTVProps) => {
    const playlist = "OLAK5uy_kwUBAtUZb46mNA16pZV0qTh5Yqk6X5byc";

    return (
        <Html
            transform
            occlude="blending"
            position={[0, 0.2, 0]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        >
            <YouTube
                onReady={onReady}
                onStateChange={onStateChange}
                onError={onError}
                opts={{
                    width: 360,
                    height: 270,
                    playerVars: {
                        controls: 0,
                        autoplay: 1,
                        loop: isLoop ? 1 : 0,
                        listType: "playlist",
                        list: playlist ?? "",
                    },
                }}
            />
        </Html>
    );
};
