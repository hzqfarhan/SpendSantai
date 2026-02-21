"use client";

export const BackgroundOrbs = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Primary indigo orb */}
            <div
                className="orb"
                style={{
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                    top: "-10%",
                    right: "-5%",
                    animation: "float-orb 20s ease-in-out infinite",
                }}
            />
            {/* Purple orb */}
            <div
                className="orb"
                style={{
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
                    bottom: "-15%",
                    left: "-10%",
                    animation: "float-orb 25s ease-in-out infinite reverse",
                }}
            />
            {/* Subtle cyan accent */}
            <div
                className="orb"
                style={{
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
                    top: "40%",
                    left: "30%",
                    animation: "float-orb 18s ease-in-out infinite 5s",
                }}
            />
        </div>
    );
};
