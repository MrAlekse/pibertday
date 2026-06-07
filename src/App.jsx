import { useState } from "react";
import Confetti from "react-confetti";
import Cake from "./components/Cake";
import Camera from "./components/Camera";
import "./App.css";

export default function App() {
    const [candlesOut, setCandlesOut] = useState(false);

    const handleBlow = () => {
        setCandlesOut(true);
    };

    return (
        <div className="app">
            {!candlesOut ? (
                <>
                    <h1>Happy Birthday!</h1>
                    <p>Make a Wish!</p>

                    <Cake candlesOut={candlesOut} />
                    <Camera onBlow={handleBlow} />
                </>
            ) : (
                <>
                    <Confetti />
                    <h1>Happy Birthday!</h1>

                    <Cake candlesOut={candlesOut} />

                    <h2>Happy Birthday </h2>

                    <audio autoPlay loop>
                        <source src="/happybirthday.mp3" type="audio/mpeg" />
                    </audio>
                </>
            )}
        </div>
    );
}