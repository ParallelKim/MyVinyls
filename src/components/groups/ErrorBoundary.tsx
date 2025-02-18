import { Component, ErrorInfo, ReactNode } from "react";
import { Html } from "@react-three/drei";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div
                        style={{
                            color: "white",
                            background: "rgba(255, 0, 0, 0.8)",
                            padding: "20px",
                            borderRadius: "10px",
                            maxWidth: "80vw",
                            textAlign: "center",
                        }}
                    >
                        <h2>Something went wrong</h2>
                        <p>{this.state.error?.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "5px",
                                border: "none",
                                background: "white",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </Html>
            );
        }

        return this.props.children;
    }
}
