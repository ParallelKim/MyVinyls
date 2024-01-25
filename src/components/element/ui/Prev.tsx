import { SVGProps } from "react";

export const Prev = (props: SVGProps<SVGSVGElement>) => (
    <svg
        className="yt-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="3rem"
        height="3rem"
        fill="currentColor"
        {...props}
    >
        <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z" />
    </svg>
);
