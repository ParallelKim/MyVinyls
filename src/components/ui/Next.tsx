import { SVGProps } from "react";

export const Next = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="3rem"
        height="3rem"
        fill="currentColor"
        {...props}
    >
        <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z" />
    </svg>
);
