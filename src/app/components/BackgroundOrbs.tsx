export function BackgroundOrbs() {
  return (
    <>
      {/* Layer 1 - Deep red/crimson sweep from bottom left */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "120vw",
          height: "120vh",
          bottom: "-20vh",
          left: "-20vw",
          background: "radial-gradient(ellipse at bottom left, rgba(160,25,10,0.7) 0%, rgba(120,15,5,0.3) 35%, transparent 65%)",
          filter: "blur(90px)",
          animation: "ambientBreath 12s ease-in-out infinite alternate",
          zIndex: 0,
        }}
      />

      {/* Layer 2 - Bright orange/amber hotspot center-right */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "80vw",
          height: "80vh",
          top: "10vh",
          right: "-10vw",
          background: "radial-gradient(ellipse at center, rgba(220,90,20,0.6) 0%, rgba(180,60,10,0.3) 40%, transparent 65%)",
          filter: "blur(70px)",
          animation: "ambientBreath 9s ease-in-out infinite alternate",
          animationDelay: "2s",
          zIndex: 0,
        }}
      />

      {/* Layer 3 - Warm yellow accent top right */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "50vw",
          height: "50vh",
          top: "-5vh",
          right: "5vw",
          background: "radial-gradient(ellipse at top right, rgba(240,160,30,0.4) 0%, rgba(200,100,10,0.15) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "ambientBreath 15s ease-in-out infinite alternate",
          animationDelay: "4s",
          zIndex: 0,
        }}
      />

      {/* Layer 4 - Cool dark purple/grey counterbalance top left */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "60vw",
          height: "60vh",
          top: "-10vh",
          left: "-10vw",
          background: "radial-gradient(ellipse at top left, rgba(40,30,50,0.8) 0%, transparent 60%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      {/* Layer 5 - Deep shadow vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0.06,
          zIndex: 2,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
