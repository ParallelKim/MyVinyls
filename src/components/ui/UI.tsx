import { YTController } from "./YTController";

// TODO: 카메라컨트롤이랑 잘 작동하지 않음, 이후 HTML 컴포넌트로 변경할 것
export const UI = () => {
    return (
        <div
            className="ui-wrapper" // higher z than three js canvas' z
        >
            <YTController />
        </div>
    );
};
