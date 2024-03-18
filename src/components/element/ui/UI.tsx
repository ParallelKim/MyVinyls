import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { YTController } from "../YTController";

// TODO: 카메라컨트롤이랑 잘 작동하지 않음, 이후 HTML 컴포넌트로 변경할 것
export const UI = () => {
    const { gl } = useThree();

    return (
        <Html
            fullscreen
            occlude
            wrapperClass="ui-wrapper" // higher z than three js canvas' z
            portal={
                gl.domElement.parentNode instanceof HTMLElement
                    ? { current: gl.domElement.parentNode }
                    : undefined
            }
        >
            <YTController />
        </Html>
    );
};
