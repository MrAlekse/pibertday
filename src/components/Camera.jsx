import { useEffect, useRef } from "react";

export default function Camera({ onBlow }) {
    const videoRef = useRef();

    useEffect(() => {
        let audioContext;
        let analyser;

        async function init() {
            try {
                const videoStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });

                videoRef.current.srcObject = videoStream;

                const audioStream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });

                audioContext = new AudioContext();

                const source =
                    audioContext.createMediaStreamSource(
                        audioStream
                    );

                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;

                source.connect(analyser);

                const dataArray = new Uint8Array(
                    analyser.frequencyBinCount
                );

                function detectBlow() {
                    analyser.getByteFrequencyData(dataArray);

                    const average =
                        dataArray.reduce((a, b) => a + b, 0) /
                        dataArray.length;

                    if (average > 70) {
                        onBlow();
                    }

                    requestAnimationFrame(detectBlow);
                }

                detectBlow();
            } catch (err) {
                console.error(err);
            }
        }

        init();
    }, [onBlow]);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="350"
            style={{
                borderRadius: "10px",
                marginTop: "20px",
            }}
        />
    );
}