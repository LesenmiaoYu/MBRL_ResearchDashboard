import React from "react";
import Studies from "./Studies";
import TestPage from "./TestPage";
import Background from './components/Background';
import '../src/components/Background.css';



function App() {
    return (
        <Background>
            <TestPage/>
            {//<Studies />
                 }
        </Background>
    );
}

export default App;
