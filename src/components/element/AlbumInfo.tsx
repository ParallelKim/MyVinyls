import { useAtomValue } from "jotai";
import { currentAlbumAtom } from "../../atoms/currentAlbumAtom";
import { Html } from "@react-three/drei";

export const AlbumInfo = () => {
    const currentAlbum = useAtomValue(currentAlbumAtom);

    if (!currentAlbum) return;

    return (
        <Html fullscreen>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        padding: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "1.5rem",
                        textAlign: "left",
                        color: "#e0e0e0",
                        background: "#242424CC",
                        borderRadius: "0 0.5rem 0.5rem 0",
                    }}
                >
                    <ol
                        style={{
                            margin: 0,
                            padding: 0,
                            listStylePosition: "inside",
                        }}
                    >
                        {currentAlbum.list.map((song) => (
                            <li key={song}>{song}</li>
                        ))}
                    </ol>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        color: "#e0e0e0",
                        background: "#242424CC",
                        borderRadius: "0.5rem 0 0 0.5rem",
                    }}
                ></div>
            </div>
        </Html>
    );
};
