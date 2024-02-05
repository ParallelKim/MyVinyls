import { Geometry, Base, Addition, Subtraction, Brush } from "@react-three/csg";
import { Center, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { albumState } from "@states/album";
import { useEffect, useRef, useState } from "react";
import { DoubleSide, Group } from "three";
import { subscribe, useSnapshot } from "valtio";

export const AlbumInfo = () => {
    const snap = useSnapshot(albumState);
    const scene = useThree((state) => state.scene);

    const panelRef = useRef<Group>(null);
    const progressRef = useRef<Brush>(null);

    const [hoveredIndex, setHoveredIndex] = useState(0);

    const len = snap.album?.list.length ?? 2;
    const player = snap.player;

    useEffect(
        () =>
            subscribe(albumState, () => {
                if (albumState.album) {
                    const lpObj = scene.getObjectByName(
                        "lpOBJ-" + albumState.album.id
                    );

                    if (lpObj && panelRef.current) {
                        lpObj.add(panelRef.current);
                    }
                }
            }),
        [scene]
    );

    useFrame(({ clock }) => {
        if (progressRef.current) {
            const cur = clock.getElapsedTime();
            const duration = snap.duration ?? 1;

            console.log(cur / duration);

            progressRef.current.position.x += (0.01 * cur) / duration;
        }
    });

    return (
        <group ref={panelRef}>
            {snap.album && (
                <group>
                    <mesh
                        name="panel"
                        position={[0, 1, -10]}
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
                        />
                    </mesh>
                    <group
                        name="text"
                        scale={0.8}
                        position={[0, 0, -5]}
                    >
                        <Text
                            position={[4, 9.5, 0]}
                            fontSize={1.5}
                            // renderOrder={-1}
                            font="/Pretendard.woff"
                        >
                            {snap.album.title}
                        </Text>
                        <group position={[4.5, 7.1, 0]}>
                            {snap.album.list.map((song, idx) => {
                                const x =
                                    9 *
                                    Math.cos(
                                        Math.asin(
                                            1 - (2 * (idx + 2)) / (len + 3)
                                        )
                                    );

                                return (
                                    <group
                                        key={song}
                                        renderOrder={2}
                                        position={[
                                            x,
                                            (-(idx + 1) * 13) / len,
                                            0,
                                        ]}
                                        onPointerEnter={() =>
                                            setHoveredIndex(idx + 1)
                                        }
                                        onPointerLeave={() =>
                                            setHoveredIndex(0)
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            if (player) {
                                                player.playVideoAt(idx); // player.playerInfo.playerListIndex에 저장됨
                                                console.log(player);
                                            }
                                        }}
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
                                                <planeGeometry args={[10, 1]} />
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
                                    position={[2, -7, 0]}
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
                                                        (13 * hoveredIndex) /
                                                            len,

                                                    0,
                                                ]}
                                            >
                                                <boxGeometry
                                                    args={[20, 30, 20]}
                                                />
                                            </Subtraction>
                                            <Subtraction
                                                position={[
                                                    5,
                                                    -8.5 -
                                                        (13 * hoveredIndex) /
                                                            len,
                                                    0,
                                                ]}
                                            >
                                                <boxGeometry
                                                    args={[20, 30, 20]}
                                                />
                                            </Subtraction>
                                        </>
                                    </Geometry>
                                    <meshBasicMaterial
                                        color="#FFF"
                                        transparent
                                        opacity={0.7}
                                    />
                                </mesh>
                            )}
                            {snap.status === "playing" &&
                                (() => {
                                    const currentIndex =
                                        snap.player?.playerInfo.playlistIndex;
                                    if (
                                        typeof currentIndex === "number" &&
                                        currentIndex >= 0
                                    ) {
                                        return (
                                            <group>
                                                <mesh
                                                    name="playingBack"
                                                    position={[2.5, -7, -0.2]}
                                                >
                                                    <Geometry>
                                                        <Base>
                                                            <planeGeometry
                                                                args={[10, 20]}
                                                            />
                                                        </Base>
                                                        <Addition
                                                            position={[5, 0, 0]}
                                                        >
                                                            <circleGeometry
                                                                args={[
                                                                    10,
                                                                    64,
                                                                    -Math.PI /
                                                                        2,
                                                                    Math.PI,
                                                                ]}
                                                            />
                                                        </Addition>
                                                        <Subtraction
                                                            position={[
                                                                5,
                                                                -(
                                                                    13 *
                                                                    (currentIndex +
                                                                        1)
                                                                ) / len,
                                                                0,
                                                            ]}
                                                        >
                                                            <Geometry>
                                                                <Base
                                                                    position={[
                                                                        0, 22.5,
                                                                        0,
                                                                    ]}
                                                                >
                                                                    <boxGeometry
                                                                        args={[
                                                                            20,
                                                                            30,
                                                                            20,
                                                                        ]}
                                                                    />
                                                                </Base>
                                                                <Addition
                                                                    position={[
                                                                        0, -8.5,
                                                                        0,
                                                                    ]}
                                                                >
                                                                    <boxGeometry
                                                                        args={[
                                                                            20,
                                                                            30,
                                                                            20,
                                                                        ]}
                                                                    />
                                                                </Addition>
                                                            </Geometry>
                                                        </Subtraction>
                                                    </Geometry>
                                                    <meshBasicMaterial
                                                        color="#FFF"
                                                        transparent
                                                        opacity={0.2}
                                                        side={DoubleSide}
                                                    />
                                                </mesh>
                                            </group>
                                        );
                                    }
                                })()}
                        </group>
                    </group>
                </group>
            )}
        </group>
    );
};
