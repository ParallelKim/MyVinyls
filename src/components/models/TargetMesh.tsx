export const TargetMesh = ({
    planeArgs,
    ...props
}: JSX.IntrinsicElements["mesh"] & { planeArgs: [number, number] }) => {
    return (
        <mesh {...props}>
            <planeGeometry args={planeArgs} />
            <meshStandardMaterial color="green" />
        </mesh>
    );
};
