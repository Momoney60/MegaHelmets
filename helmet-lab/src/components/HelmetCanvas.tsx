"use client";

import React, { useMemo, useRef, useState } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";
import { FACEMASK_BARS, HELMET_STAGE_HEIGHT, HELMET_STAGE_WIDTH, RIVETS, SHELL_FACE_CUTOUT_PATH, SHELL_OUTLINE_PATH, EAR_HOLE } from "@/lib/helmetPaths";

type Dragging = { type: "decal" | "text"; id: string; offsetX: number; offsetY: number } | null;

export const HelmetCanvas: React.FC = () => {
	const state = useDesignerStore();
	const svgRef = useRef<SVGSVGElement | null>(null);
	const [dragging, setDragging] = useState<Dragging>(null);

	const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
		if (!dragging) return;
		const pt = (e.target as SVGElement).ownerSVGElement || svgRef.current;
		if (!pt) return;
		const rect = pt.getBoundingClientRect();
		const x = e.clientX - rect.left - dragging.offsetX;
		const y = e.clientY - rect.top - dragging.offsetY;
		if (dragging.type === "decal") {
			state.updateDecal(dragging.id, { x, y });
		} else {
			state.updateText(dragging.id, { x, y });
		}
	};

	const stopDragging = () => setDragging(null);

	const facemaskLines = useMemo(() => FACEMASK_BARS.map((b) => b.points.map((n) => n.toFixed(1)).join(",")), []);

	return (
		<svg ref={svgRef} width={HELMET_STAGE_WIDTH} height={HELMET_STAGE_HEIGHT} viewBox={`0 0 ${HELMET_STAGE_WIDTH} ${HELMET_STAGE_HEIGHT}`} className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl select-none touch-none" onPointerMove={handlePointerMove} onPointerUp={stopDragging} onPointerLeave={stopDragging}>
			<defs>
				<mask id="shellMask">
					<rect x="0" y="0" width="100%" height="100%" fill="black" />
					<path d={SHELL_OUTLINE_PATH} fill="white" />
					<path d={SHELL_FACE_CUTOUT_PATH} fill="black" />
				</mask>
				<linearGradient id="glossGrad" x1="350" y1="90" x2="450" y2="350" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
					<stop offset="100%" stopColor="rgba(255,255,255,0)" />
				</linearGradient>
				<linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
					<stop offset="20%" stopColor="rgba(255,255,255,0)" />
					<stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
					<stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
				</linearGradient>
			</defs>

			{/* Shell */}
			<path d={SHELL_OUTLINE_PATH} fill={state.shellColorPrimary} stroke={state.shellStrokeColor} strokeWidth={state.shellStrokeWidth} filter={`drop-shadow(10px 14px 24px rgba(0,0,0,${state.shadowIntensity}))`} />
			<path d={SHELL_OUTLINE_PATH} fill={state.shellColorSecondary} opacity="0.15" />
			<path d={SHELL_FACE_CUTOUT_PATH} fill="#111827" opacity="0.9" />

			{/* Stripes under mask */}
			<g mask="url(#shellMask)">
				{state.stripes.map((s) => (
					<polyline key={s.id} points={s.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" opacity={s.opacity} />
				))}

				{/* Decals */}
				{state.decals.map((d) => (
					<image key={d.id} href={d.src} x={d.x} y={d.y} width={400 * d.scale} height={400 * d.scale} opacity={d.opacity} transform={`rotate(${d.rotation}, ${d.x}, ${d.y})`} style={{ cursor: "grab" }} onPointerDown={(e) => {
						const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
						setDragging({ type: "decal", id: d.id, offsetX: e.clientX - rect.left - d.x, offsetY: e.clientY - rect.top - d.y });
					}} />
				))}

				{/* Text */}
				{state.texts.map((t) => (
					<text key={t.id} x={t.x} y={t.y} fontFamily={t.fontFamily} fontWeight={t.fontStyle.includes("bold") ? "700" : "400"} fontStyle={t.fontStyle.includes("italic") ? "italic" : "normal"} fill={t.fill} stroke={t.stroke} strokeWidth={t.strokeWidth} transform={`scale(${t.scale}) rotate(${t.rotation}, ${t.x}, ${t.y})`} style={{ cursor: "grab" }} onPointerDown={(e) => {
						const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
						setDragging({ type: "text", id: t.id, offsetX: e.clientX - rect.left - t.x, offsetY: e.clientY - rect.top - t.y });
					}}>
						{t.text}
					</text>
				))}
			</g>

			{/* Hardware */}
			{state.showEarHole && (
				<g>
					<circle cx={EAR_HOLE.x} cy={EAR_HOLE.y} r={EAR_HOLE.radius} fill="#0b0b0b" opacity="0.9" />
					<circle cx={EAR_HOLE.x + 6} cy={EAR_HOLE.y - 4} r={EAR_HOLE.radius - 8} fill="#18181b" opacity="0.7" />
				</g>
			)}
			{state.showRivets && RIVETS.map((r, i) => (
				<circle key={i} cx={r.x} cy={r.y} r={6} fill="#111" stroke="#ddd" strokeWidth={2} />
			))}

			{/* Facemask */}
			<g>
				{FACEMASK_BARS.map((b, i) => (
					<polyline key={i} points={b.points.map((p) => p.toString()).join(",")} fill="none" stroke={state.facemaskColor} strokeWidth={b.width} strokeLinecap="round" />
				))}
			</g>

			{/* Overlays */}
			{state.metallic && <rect x="0" y="0" width="100%" height="100%" fill="url(#metalGrad)" opacity="0.35" />}
			<path d={SHELL_OUTLINE_PATH} fill="url(#glossGrad)" opacity={state.shellGloss} />
		</svg>
	);
};

export default HelmetCanvas;