export const TargetMesh = ({
    size,
    color = "green",
    ...props
}: JSX.IntrinsicElements["mesh"] & { size: number; color?: string }) => {
    return (
        <mesh {...props}>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.5}
            />
        </mesh>
    );
};
