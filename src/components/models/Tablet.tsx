import { YoutubeVideo } from "@components/element/YTPlayer";
import { youtubeState } from "@constants/youtubeState";
import { useBounds, useGLTF } from "@react-three/drei";
import { albumState, setAlbumStatus } from "@states/album";
import { GLTF } from "three-stdlib";
import { useSnapshot } from "valtio";

type GLTFResult = GLTF & {
    nodes: {
        Box010: THREE.Mesh;
        Box011: THREE.Mesh;
        Box012: THREE.Mesh;
        Box013: THREE.Mesh;
        Color177: THREE.Mesh;
        Color178: THREE.Mesh;
        Cylinder011: THREE.Mesh;
        Cylinder012: THREE.Mesh;
        Cylinder013: THREE.Mesh;
        Cylinder014: THREE.Mesh;
        Mesh042: THREE.Mesh;
        Mesh042_1: THREE.Mesh;
        Mesh042_2: THREE.Mesh;
        Line034: THREE.Mesh;
        Line037: THREE.Mesh;
        Mesh033: THREE.Mesh;
        Mesh033_1: THREE.Mesh;
        Mesh033_2: THREE.Mesh;
        Mesh033_3: THREE.Mesh;
        Mesh033_4: THREE.Mesh;
        Mesh033_5: THREE.Mesh;
        Text003: THREE.Mesh;
    };
    materials: {
        ["body line.001"]: THREE.MeshPhysicalMaterial;
        ["Body.001"]: THREE.MeshPhysicalMaterial;
        ["08 - Default.001"]: THREE.MeshPhysicalMaterial;
        ["logo.001"]: THREE.MeshPhysicalMaterial;
        ["03 - Default.001"]: THREE.MeshPhysicalMaterial;
        ["19 - Default.001"]: THREE.MeshPhysicalMaterial;
        ["02 - Default.001"]: THREE.MeshPhysicalMaterial;
        ["14 - Default.001"]: THREE.MeshPhysicalMaterial;
        ["20 - Default.001"]: THREE.MeshPhysicalMaterial;
        ["09 - Default.001"]: THREE.MeshPhysicalMaterial;
    };
};

export const Tablet = (props: JSX.IntrinsicElements["group"]) => {
    const { nodes, materials } = useGLTF("/ipad.glb") as GLTFResult;

    const snap = useSnapshot(albumState);
    const query = snap.album?.url.split("=");

    const bounds = useBounds();

    return (
        <group
            {...props}
            dispose={null}
            position={[15, 25, 0]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
        >
            {(() => {
                if (query?.length && query?.length > 0) {
                    const playlist = query[query?.length - 1] ?? "";

                    return (
                        <YoutubeVideo
                            playlist={playlist}
                            onStateChange={async function (e) {
                                const statusStr = youtubeState[e.data];
                                console.log(e, statusStr);
                                setAlbumStatus(
                                    statusStr,
                                    await e.target.getDuration()
                                );

                                if (statusStr === "playing") {
                                    bounds.lookAt({ target: [0, -10, 0] });
                                }
                            }}
                            onError={function () {}}
                            isLoop={false}
                        />
                    );
                }
            })()}
            <group position={[0.033, 0, -0.053]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Box010.geometry}
                    material={materials["body line.001"]}
                    position={[4.163, 0.036, 0.02]}
                    rotation={[0, 0, -Math.PI / 2]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Box011.geometry}
                    material={materials["Body.001"]}
                    position={[4.164, 0.039, -4.026]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                    scale={0.963}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Box012.geometry}
                    material={materials["Body.001"]}
                    position={[3.487, 0.038, -5.457]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={0.963}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Box013.geometry}
                    material={materials["Body.001"]}
                    position={[4.164, 0.039, -4.503]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                    scale={0.963}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Color177.geometry}
                    material={materials["08 - Default.001"]}
                    position={[-0.008, 0.15, 0.008]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Color178.geometry}
                    material={materials["logo.001"]}
                    position={[-0.014, -0.086, -0.111]}
                    rotation={[0, 0, -Math.PI]}
                />
                <group
                    position={[-0.008, -0.065, 5.08]}
                    rotation={[0, 0, -Math.PI]}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder011.geometry}
                        material={materials["03 - Default.001"]}
                        position={[-0.197, -0.012, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder012.geometry}
                        material={materials["03 - Default.001"]}
                        position={[0, -0.012, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder013.geometry}
                        material={materials["03 - Default.001"]}
                        position={[0.197, -0.012, 0]}
                    />
                </group>
                <group
                    position={[3.729, -0.115, -5.02]}
                    rotation={[0, 0, -Math.PI]}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder014.geometry}
                        material={materials["08 - Default.001"]}
                        position={[0.001, 0.033, -0.001]}
                    />
                    <group position={[0, -0.039, 0]}>
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes.Mesh042.geometry}
                            material={materials["Body.001"]}
                        />
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes.Mesh042_1.geometry}
                            material={materials["19 - Default.001"]}
                        />
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes.Mesh042_2.geometry}
                            material={materials["02 - Default.001"]}
                        />
                    </group>
                </group>
                <group
                    position={[-0.008, 0.037, 0.008]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Line034.geometry}
                        material={materials["body line.001"]}
                        position={[-0.589, 5.171, 0.106]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={-1}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Line037.geometry}
                        material={materials["body line.001"]}
                        position={[-0.589, -5.171, 0.106]}
                        rotation={[-Math.PI / 2, 0, -Math.PI]}
                    />
                </group>
                <group
                    position={[0.27, 0.154, 0.263]}
                    rotation={[0, 0, -Math.PI]}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Mesh033.geometry}
                        material={materials["Body.001"]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Mesh033_1.geometry}
                        material={materials["02 - Default.001"]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Mesh033_2.geometry}
                        material={materials["14 - Default.001"]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Mesh033_3.geometry}
                        material={materials["20 - Default.001"]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Mesh033_4.geometry}
                        material={materials["19 - Default.001"]}
                    />
                </group>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Text003.geometry}
                    material={materials["body line.001"]}
                    position={[-0.078, -0.075, 3.375]}
                    rotation={[0, 0, -Math.PI]}
                />
            </group>
        </group>
    );
};

useGLTF.preload("/ipad.glb");
