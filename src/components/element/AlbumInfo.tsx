import { MeshReflectorMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { albumState } from "@states/album";
import { useEffect, useRef } from "react";
import { DoubleSide, Group } from "three";
import { subscribe, useSnapshot } from "valtio";

export const AlbumInfo = () => {
    const snap = useSnapshot(albumState);
    const scene = useThree((state) => state.scene);

    const htmlRef = useRef<Group>(null);

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

    return (
        <group
            ref={htmlRef}
            position={[5, 0, -10]}
        >
            {albumState.album && (
                <group position={[-5, 0, -5]}>
                    <mesh>
                        <planeGeometry args={[30, 30]} />
                        <MeshReflectorMaterial
                            transparent
                            opacity={0.7}
                            side={DoubleSide}
                            blur={[1, 1]}
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
                    <mesh position={[15, 0, 0]}>
                        <circleGeometry
                            args={[15, 64, -Math.PI / 2, Math.PI]}
                        />
                        <MeshReflectorMaterial
                            transparent
                            opacity={0.7}
                            side={DoubleSide}
                            blur={[1, 1]}
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
                    {/* <Html
                        scale={3}
                        occlude="blending"
                        transform
                        style={{
                            width: 400,
                            height: 400,
                            backgroundColor: "black",
                            opacity: 0.7,
                            borderRadius: "0 0 50% 50%",
                            overflow: "hidden",
                        }}
                        material={}
                    >
                        <div>
                            <div>Track</div>
                            <ol>
                                {(snap.album?.list ?? []).map((song) => (
                                    <li key={song}>{song}</li>
                                ))}
                            </ol>
                        </div>
                    </Html> */}
                </group>
            )}
        </group>
    );
};
