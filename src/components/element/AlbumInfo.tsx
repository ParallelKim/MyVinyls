import { useAtomValue } from "jotai";
import { currentAlbumAtom } from "../../atoms/currentAlbumAtom";
import { Html } from "@react-three/drei";
import { JUNGWOO } from "../../constants/jungwoo";

export const AlbumInfo = () => {
    const currentAlbum = useAtomValue(currentAlbumAtom);

    if (!currentAlbum) return;

    return (
        <Html fullscreen>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "4rem",
                        color: "#e0e0e0",
                        background: "#242424CC",
                        borderRadius: "0 0.5rem 0.5rem 0",
                    }}
                >
                    <img
                        style={{
                            width: "10rem",
                            height: "10rem",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                        src={JUNGWOO.profile}
                    />
                    <div style={{ fontSize: "3rem", marginTop: "1rem" }}>
                        {currentAlbum.artist}
                    </div>
                </div>
                <div
                    style={{
                        padding: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "1.5rem",
                        textAlign: "left",
                        color: "#e0e0e0",
                        background: "#242424CC",
                        borderRadius: "0.5rem 0 0 0.5rem",
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
            </div>
        </Html>
    );
};
