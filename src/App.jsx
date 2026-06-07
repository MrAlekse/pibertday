import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import Cake from "./components/Cake";
import Camera from "./components/Camera";
import "./App.css"

const words = [
    "Lagas kana",
    "Have a wonderful day!",
    "Another year survive",
    "+1",
    "Happy Birthday ate pat",
    "Wishing you all the happiness",
    "Librehi daw ak"
];

export default function App() {
    const [candlesOut, setCandlesOut] = useState(false);

    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const audioRef = useRef(null);

    useEffect(() => {
        if (!candlesOut) return;

        const word = words[wordIndex];
        let timeout;

        if (!isDeleting && letterIndex < word.length) {
            timeout = setTimeout(() => setLetterIndex(i => i + 1), 120);
        }
        else if (isDeleting && letterIndex > 0) {
            timeout = setTimeout(() => setLetterIndex(i => i - 1), 80);
        }
        else if (!isDeleting && letterIndex === word.length) {
            timeout = setTimeout(() => setIsDeleting(true), 1000);
        }
        else if (isDeleting && letterIndex === 0) {
            setIsDeleting(false);
            setWordIndex(i => (i + 1) % words.length);
        }

        return () => clearTimeout(timeout);
    }, [letterIndex, isDeleting, wordIndex, candlesOut]);

    const displayedText = words[wordIndex].substring(0, letterIndex);

    const handleBlow = () => {
        setCandlesOut(true);

        if (!audioRef.current) {
            // Use a relative path without a leading slash so GitHub Pages links it correctly
            audioRef.current = new Audio("happybirthday.mp3");
            audioRef.current.loop = true;
        }
        audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
    };

    return (
        <div className="app">
            {candlesOut && <Confetti />}

            <h1>Happy Birthday 20th</h1>
            <h2>Patricia June Husain!</h2>

            <div className="message-container" style={{ minHeight: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!candlesOut ? (
                    <p>Make a Wish!</p>
                ) : (
                    <p>
                        <span className="text-blue-400" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {displayedText}
                            <span className="cursor">|</span>
                        </span>
                    </p>
                )}
            </div>

            <Cake candlesOut={candlesOut} />
            <div className="camera-container" style={{ minHeight: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {!candlesOut && <Camera onBlow={handleBlow} />}
            </div>
        </div>
    );
}