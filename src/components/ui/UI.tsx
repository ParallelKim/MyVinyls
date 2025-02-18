import { YTController } from "./YTController";

export const UI = () => {
    return (
        <div
            className="ui-wrapper" // higher z than three js canvas' z
        >
            <YTController />
        </div>
    );
};
