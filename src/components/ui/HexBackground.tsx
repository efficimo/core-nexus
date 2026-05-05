import type { ReactElement } from "react";
import { useEffect, useRef } from "react";

type Props = {
  vignette?: boolean;
};

export function HexBackground({ vignette = false }: Props): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
      ctx!.clearRect(0, 0, w, h);

      const S = 30;
      const cw = Math.sqrt(3) * S;
      const ch = 1.5 * S;
      const cols = Math.ceil(w / cw) + 2;
      const rows = Math.ceil(h / ch) + 2;
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const offset = r % 2 !== 0 ? cw / 2 : 0;
          const hx = c * cw + offset;
          const hy = r * ch;
          const dx = hx - cx;
          const dy = hy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = 1 - Math.min(dist / maxDist, 1);
          const alpha = t * t * 0.12 + 0.015;

          ctx!.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            const x = hx + (S - 1) * Math.sin(a);
            const y = hy - (S - 1) * Math.cos(a);
            i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
          }
          ctx!.closePath();
          ctx!.strokeStyle = `rgba(46,106,255,${alpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }

      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
      grad.addColorStop(0, "rgba(46,106,255,0.04)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
    }

    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(draw);
    });
    ro.observe(canvas.parentElement!);
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      {vignette && (
        <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,transparent_20%,rgba(5,7,11,0.8)_100%)]" />
      )}
    </>
  );
}
