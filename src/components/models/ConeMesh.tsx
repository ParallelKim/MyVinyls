import { MeshReflectorMaterial } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide, Shape } from "three";

export const Triangle = () => {
    const shape = useMemo(() => {
        const shape = new Shape();
        shape.moveTo(0, 0);

        const radius = 10;
        const segments = 64;
        let theta_next, x_next, y_next, j;
        for (let i = segments / 4 - 1; i < (3 * segments) / 4 - 1; i++) {
            const theta = ((i + 1) / segments) * Math.PI * 2;
            const x = radius * Math.cos(theta);
            const y = radius * Math.sin(theta);
            j = i + 2;
            if (j - 1 === segments) j = 1;
            theta_next = (j / segments) * Math.PI * 2.0;
            x_next = radius * Math.cos(theta_next);
            y_next = radius * Math.sin(theta_next);
            shape.lineTo(x, y);
            shape.lineTo(x_next, y_next);
        }

        shape.lineTo(7 * Math.sqrt(3), 0);
        shape.lineTo(0, 10);

        return shape;
    }, []);
    return (
        <mesh
            position={[0, 0, 1]}
            scale={1 / 8}
        >
            <shapeGeometry args={[shape]} />
            <MeshReflectorMaterial
                color="#999"
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
    );
};
