import { useAtomValue } from "jotai";
import YouTube from "react-youtube";
import { YouTubeEvent } from "react-youtube";
import { playlistAtom } from "../../atoms/playlistAtom";

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
    const playlist = useAtomValue(playlistAtom);

    return (
        <YouTube
            onReady={onReady}
            onStateChange={onStateChange}
            onError={onError}
            opts={{
                playerVars: {
                    controls: 0,
                    autoplay: 1,
                    loop: isLoop ? 1 : 0,
                    listType: "playlist",
                    list: playlist ?? "",
                },
            }}
        />
    );
};
