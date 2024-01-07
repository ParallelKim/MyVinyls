import { Geometry, Base, Addition, Subtraction } from "@react-three/csg";
import { Center, MeshReflectorMaterial, Text3D } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { albumState } from "@states/album";
import { useEffect, useRef, useState } from "react";
import { DoubleSide, Group } from "three";
import { subscribe, useSnapshot } from "valtio";

export const AlbumInfo = () => {
    const snap = useSnapshot(albumState);
    const scene = useThree((state) => state.scene);

    const htmlRef = useRef<Group>(null);

    const [hoveredIndex, setHoveredIndex] = useState(0);

    useEffect(
        () =>
            subscribe(albumState, () => {
                if (albumState.album) {
                    const lpObj = scene.getObjectByName(
                        "lpOBJ-" + albumState.album.id
                    );

                    if (lpObj && htmlRef.current) {
                        lpObj.add(htmlRef.current);
                    }
                }
            }),
        [scene]
    );

    const len = snap.album?.list.length ?? 2;

    return (
        <group
            ref={htmlRef}
            renderOrder={-1}
        >
            {snap.album && (
                <group>
                    <mesh
                        name="panel"
                        position={[0, 0, -10]}
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
                        <MeshReflectorMaterial
                            color="#000"
                            transparent
                            opacity={0.7}
                            side={DoubleSide}
                            mixStrength={1} // Strength of the reflections
                            mixContrast={1} // Contrast of the reflections
                            resolution={256} // Off-buffer resolution, lower=faster, higher=better quality, slower
                            mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                            depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                            minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                            maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                            depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                            reflectorOffset={0.2}
                        />
                    </mesh>
                    <group
                        name="text"
                        scale={0.8}
                        position={[0, 0, -5]}
                    >
                        <Center position={[1, 9, 0]}>
                            <Text3D font="/Pretendard.json">
                                {snap.album.title}
                            </Text3D>
                        </Center>
                        <group position={[4, 6.9, 0]}>
                            {snap.album.list.map((song, idx) => {
                                const x =
                                    10 *
                                    Math.cos(
                                        Math.asin(
                                            1 - (2 * (idx + 2)) / (len + 3)
                                        )
                                    );

                                return (
                                    <group
                                        key={song}
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
                                            console.log(song, idx);
                                        }}
                                    >
                                        <Center right>
                                            <Text3D
                                                font="/Pretendard.json"
                                                size={0.5}
                                            >
                                                {idx + 1}. {song}
                                            </Text3D>
                                        </Center>
                                        <Center position={[4, 0, 1]}>
                                            <mesh>
                                                <planeGeometry args={[10, 1]} />
                                                <MeshReflectorMaterial
                                                    transparent
                                                    opacity={0}
                                                    mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                                                />
                                            </mesh>
                                        </Center>
                                    </group>
                                );
                            })}
                            {hoveredIndex > 0 && (
                                <mesh
                                    name="background"
                                    position={[2.5, -7, 0]}
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
                                    <MeshReflectorMaterial
                                        color="#FFF"
                                        transparent
                                        opacity={0.7}
                                        side={DoubleSide}
                                        mixStrength={1} // Strength of the reflections
                                        mixContrast={1} // Contrast of the reflections
                                        resolution={256} // Off-buffer resolution, lower=faster, higher=better quality, slower
                                        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                                        depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                                        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                                        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                                        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                                        reflectorOffset={0.2}
                                    />
                                </mesh>
                            )}
                        </group>
                    </group>
                </group>
            )}
        </group>
    );
};
