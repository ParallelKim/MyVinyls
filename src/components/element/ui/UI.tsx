import { Html } from "@react-three/drei";
import { YTController } from "../YTController";

export const UI = () => {
    return (
        <Html
            fullscreen
            occlude
            wrapperClass="ui-wrapper" // higher z than three js canvas' z
        >
            <YTController />
        </Html>
    );
};
