import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Cube: THREE.Mesh;
        Room_baked: THREE.Mesh;
        Floor_baked: THREE.Mesh;
    };
    materials: {
        ["Dark Wood"]: THREE.MeshStandardMaterial;
        Wall_material_baked: THREE.MeshPhysicalMaterial;
        Floor_material_baked: THREE.MeshPhysicalMaterial;
    };
};

export const RoomGroup = ({children, ...props}: JSX.IntrinsicElements["group"] & {children?: React.ReactNode}) => {
    const { nodes, materials } = useGLTF("/room-transformed.glb") as GLTFResult;

    return (
        <group
            {...props}
            dispose={null}
            renderOrder={1}
        >
            <mesh
                geometry={nodes.Cube.geometry}
                material={materials["Dark Wood"]}
                position={[0, 1.5, 0.443]}
                scale={[2, 1, 1]}
            />
            {/* <mesh
                geometry={nodes.Room_baked.geometry}
                material={
                    new MeshBasicMaterial({
                        color: "green",
                        opacity: 1,
                        side: 0,
                    })
                }
                position={[-2, 0, 0.454]}
            />
            <mesh
                geometry={nodes.Floor_baked.geometry}
                material={new MeshBasicMaterial({ color: "red", opacity: 1 })}
                position={[-2, 0, 0.454]}
            /> */}
            {children}
        </group>
    );
};

useGLTF.preload("/room-transformed.glb");
