import React from "react";
import largeImg from '@/assets/11.jpg'
import smallImg from '@/assets/1.png'
import { Input, Button } from "./components";
const App = () => {
    return (
        <div id='app'>
            <h1>App-demo</h1>
            <img src={largeImg} alt="" />
            <img src={smallImg} alt="" />
            <Input></Input>
            <Button></Button>
        </div>
    );
}

export default App;