<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>ULTRA RUNNER - Maintenance</title>
    <style>
        :root { --primary: #3b82f6; --accent: #ec4899; --bg: #020617; }
        body { margin: 0; overflow: hidden; background: var(--bg); font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; cursor: wait; }
        #bg-canvas { position: fixed; inset: 0; z-index: -1; filter: blur(4px); }
        .update-box { text-align: center; z-index: 100; padding: 40px; background: rgba(255, 255, 255, 0.02); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        .loader-ring { width: 80px; height: 80px; border: 5px solid rgba(255, 255, 255, 0.1); border-top: 5px solid var(--accent); border-radius: 50%; margin: 0 auto 25px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        h1 { font-size: 32px; margin: 0; background: linear-gradient(45deg, #fff, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px; text-transform: uppercase; }
        .msg { color: #94a3b8; font-size: 16px; margin-top: 10px; letter-spacing: 4px; font-weight: bold; animation: flash 2s infinite; }
        @keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .overlay { position: fixed; inset: 0; z-index: 9999; background: transparent; }
    </style>
</head>
<body>
    <div class="overlay"></div>
    <canvas id="bg-canvas"></canvas>
    <div class="update-box">
        <div class="loader-ring"></div>
        <h1>Update is coming</h1>
        <div class="msg">PLEASE WAIT...</div>
        <div style="margin-top: 40px; font-size: 11px; color: #475569;">STATUS: MAINTENANCE MODE</div>
    </div>
    <script>
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let stars = [];
        function init() {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            stars = []; for(let i=0; i<100; i++) stars.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2});
        }
        function draw() {
            ctx.fillStyle = "#020617"; ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.fillStyle = "white"; stars.forEach(s => { s.y += s.s * 0.1; if(s.y > canvas.height) s.y = 0; ctx.fillRect(s.x, s.y, s.s, s.s); });
            requestAnimationFrame(draw);
        }
        window.addEventListener('keydown', e => e.preventDefault());
        window.oncontextmenu = () => false;
        window.onresize = init;
        init(); draw();
    </script>
</body>
</html>
