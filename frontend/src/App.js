import React, {useState} from "react";
import Studies from "./Studies";
import TestPage from "./TestPage";
import Background from './components/Background';
import './LogIn.css'
import '../src/components/Background.css';



function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

    const handleLogin = (username, password) => {
        // Replace these with your actual username and password validation logic
        const correctUsername = "admin"; // Example username
        const correctPassword = "password"; // Example password

        if (username === correctUsername && password === correctPassword) {
            setIsLoggedIn(true); // Set login status to true
        } else {
            setErrorMessage("Invalid username or password"); // Show error message
        }
    };

    return (
        <Background>
            {isLoggedIn ? (
                <Studies /> // Render the Studies component if logged in
            ) : (
                <div className="login-box">
                    <h2>Login</h2>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="login-input"
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="login-input"
                    />
                    <button
                        className="login-button"
                        onClick={() => {
                            const username = document.getElementById("username").value;
                            const password = document.getElementById("password").value;
                            handleLogin(username, password);
                        }}
                    >
                        Login
                    </button>
                    <p>For access, please contact MBRL administrators.</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            )}
        </Background>
    );
}

export default App;
