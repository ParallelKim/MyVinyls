import { Html } from '@react-three/drei';

export const LoadingFallback = () => {
    return (
        <Html center>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '20px',
                borderRadius: '10px',
            }}>
                <div className="loader" style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '10px',
                }}/>
                <div>Loading...</div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </Html>
    );
};
