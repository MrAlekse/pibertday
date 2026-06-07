import "./Cake.css";

export default function Cake({ candlesOut }) {
    return (
        <div>
            <div className="cake-container">
                <div className="candles">
                    {[1, 2, 3, 4, 5].map((candle) => (
                        <div key={candle} className="candle">
                            {!candlesOut && <div className="flame"></div>}
                        </div>
                    ))}
                </div>

                <div className="top-layer">
                    <div className="cake-drip"></div>
                </div>

                <div className="first-layers"></div>
                <div className="first-filling"></div>
                <div className="first-layer"></div>
                <div className="first-filling"></div>
                <div className="first-layer"></div>
            </div>

            <div className="plate"></div>
        </div>
    );
}