import { Addition, Base, Geometry, Subtraction } from "@react-three/csg";
import { Center, Text } from "@react-three/drei";
import { useState } from "react";
import { DoubleSide } from "three";

import usePlayerStore from "@/states/playerStore";
import useAnimationStore from "@/states/animationStore";
import { ThreeEvent } from "@react-three/fiber";
import { eventManager } from "@/components/managers/EventManager";

export const AlbumInfo = () => {
    const [hoveredIndex, setHoveredIndex] = useState(0);
    const { album, currentIndex } = usePlayerStore();
    const { currentAnim } = useAnimationStore();

    console.log(album, currentAnim);

    // 앨범이 없거나 focusing 상태가 아니면 렌더링하지 않음
    if (!album || currentAnim !== "focusing") {
        return null;
    }

    const len = album?.list.length ?? 2;

    const handlePlay = async (e: ThreeEvent<MouseEvent>, idx: number) => {
        e.stopPropagation();

        eventManager.emit({
            type: "LP_PLAYING",
            payload: {
                album,
                lpId: album.id,
                songIndex: idx,
            },
        });
    };

    return (
        <group
            name="album info"
            scale={0.06}
            position={[-0.3, 0, 0]}
        >
            <group>
                <mesh
                    name="panel"
                    position={[0, 0, 0]}
                >
                    <Geometry>
                        <Base>
                            <planeGeometry args={[20, 20]} />
                        </Base>
                        <Addition position={[10, 0, 0]}>
                            <circleGeometry
                                args={[10, 64, -Math.PI / 2, Math.PI]}
                            />
                        </Addition>
                    </Geometry>
                    <meshBasicMaterial
                        color="#000"
                        transparent
                        opacity={0.7}
                        side={DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
                <group
                    name="text"
                    position={[0, 0, 0.5]}
                >
                    <Text
                        position={[4, 8.2, 0]}
                        fontSize={1.5}
                        font="/Pretendard.woff"
                    >
                        {album.title}
                    </Text>
                    <group position={[3, 7, 0]}>
                        {album.list.map((song, idx) => {
                            const x =
                                9 *
                                Math.cos(
                                    Math.asin(1 - (2 * (idx + 2)) / (len + 3))
                                );

                            return (
                                <group
                                    key={song}
                                    renderOrder={2}
                                    position={[x, (-(idx + 1) * 13) / len, 0]}
                                    onPointerEnter={() =>
                                        setHoveredIndex(idx + 1)
                                    }
                                    onPointerLeave={() => setHoveredIndex(0)}
                                    onClick={(e) => handlePlay(e, idx)}
                                >
                                    <Text
                                        font="/Pretendard.woff"
                                        anchorX="left"
                                        anchorY="middle"
                                        fontSize={0.7}
                                        material-depthTest={false}
                                    >
                                        {idx + 1}. {song}
                                    </Text>
                                    <Center
                                        position={[4, 0, 0]}
                                        renderOrder={1}
                                    >
                                        <mesh>
                                            <planeGeometry
                                                args={[10, 13 / len]}
                                            />
                                            <meshBasicMaterial
                                                transparent
                                                opacity={0}
                                                depthTest={false}
                                            />
                                        </mesh>
                                    </Center>
                                </group>
                            );
                        })}
                        {hoveredIndex > 0 && (
                            <mesh
                                name="background"
                                position={[2, -7, -0.4]}
                                renderOrder={1}
                            >
                                <Geometry>
                                    <Base>
                                        <planeGeometry args={[10, 20]} />
                                    </Base>
                                    <Addition position={[5, 0, 0]}>
                                        <circleGeometry
                                            args={[
                                                10,
                                                64,
                                                -Math.PI / 2,
                                                Math.PI,
                                            ]}
                                        />
                                    </Addition>
                                    <>
                                        <Subtraction
                                            position={[
                                                5,
                                                22.5 -
                                                    (13 * hoveredIndex) / len,

                                                0,
                                            ]}
                                        >
                                            <boxGeometry args={[20, 30, 20]} />
                                        </Subtraction>
                                        <Subtraction
                                            position={[
                                                5,
                                                -8.5 -
                                                    (13 * hoveredIndex) / len,
                                                0,
                                            ]}
                                        >
                                            <boxGeometry args={[20, 30, 20]} />
                                        </Subtraction>
                                    </>
                                </Geometry>
                                <meshBasicMaterial color="#F88" />
                            </mesh>
                        )}
                        {typeof currentIndex === "number" &&
                            currentIndex >= 0 && (
                                <group>
                                    <mesh
                                        name="playingBack"
                                        position={[2, -7, -0.35]}
                                    >
                                        <Geometry>
                                            <Base>
                                                <planeGeometry args={[8, 30]} />
                                            </Base>
                                            <Addition position={[4, 0, 0]}>
                                                <circleGeometry
                                                    args={[
                                                        10,
                                                        64,
                                                        -Math.PI / 2,
                                                        Math.PI,
                                                    ]}
                                                />
                                            </Addition>
                                            <Subtraction
                                                position={[
                                                    5,
                                                    -(
                                                        13 *
                                                        ((currentIndex ?? 0) +
                                                            1)
                                                    ) / len,
                                                    0,
                                                ]}
                                            >
                                                <Geometry>
                                                    <Base
                                                        position={[0, 22.5, 0]}
                                                    >
                                                        <boxGeometry
                                                            args={[20, 30, 20]}
                                                        />
                                                    </Base>
                                                    <Addition
                                                        position={[0, -8.5, 0]}
                                                    >
                                                        <boxGeometry
                                                            args={[20, 30, 20]}
                                                        />
                                                    </Addition>
                                                </Geometry>
                                            </Subtraction>
                                        </Geometry>
                                        <meshBasicMaterial color="#F44" />
                                    </mesh>
                                </group>
                            )}
                    </group>
                </group>
            </group>
        </group>
    );
};
