import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Test connection to backend
        const testConnection = async () => {
            try {
                const response = await fetch('/api/health');
                if (response.ok) {
                    setIsConnected(true);
                }
            } catch (error) {
                console.error('Failed to connect to backend:', error);
                setIsConnected(false);
            }
        };

        testConnection();
    }, []);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Recipe Manager</h1>
                <div className="connection-status">
                    Status: {isConnected ? (
                        <span className="connected">Connected</span>
                    ) : (
                        <span className="disconnected">Disconnected</span>
                    )}
                </div>
            </header>

            <main className="app-main">
                <div className="welcome">
                    <h2>Welcome to Recipe Manager</h2>
                    <p>Your personal recipe collection and meal planning companion.</p>

                    {isConnected ? (
                        <div className="features">
                            <h3>Ready to start cooking!</h3>
                            <ul>
                                <li>✅ Backend API Connected</li>
                                <li>🔧 Frontend Setup Complete</li>
                                <li>🚀 Ready for Development</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="error">
                            <h3>Connection Error</h3>
                            <p>Unable to connect to the backend API. Please ensure the server is running on port 3001.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App; 