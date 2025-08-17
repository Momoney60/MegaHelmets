"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { ControlsPanel } from "@/components/ControlsPanel";
import { useDesignerStore } from "@/store/useDesignerStore";

const HelmetCanvas = dynamic(() => import("@/components/HelmetCanvas").then((m) => ({ default: m.HelmetCanvas })), { ssr: false });

async function svgToPngDataUrl(svg: SVGSVGElement, scale = 2): Promise<string> {
	const xml = new XMLSerializer().serializeToString(svg);
	const svg64 = typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(xml))) : Buffer.from(xml).toString("base64");
	const image64 = `data:image/svg+xml;base64,${svg64}`;
	return await new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = svg.clientWidth * scale;
			canvas.height = svg.clientHeight * scale;
			const ctx = canvas.getContext("2d")!;
			ctx.scale(scale, scale);
			ctx.drawImage(img, 0, 0);
			resolve(canvas.toDataURL("image/png"));
		};
		img.src = image64;
	});
}

export const DesignerPage: React.FC = () => {
	const stageRef = useRef<HTMLDivElement>(null);

	const handleExport = async () => {
		const svg = document.querySelector("svg") as SVGSVGElement | null;
		if (!svg) return;
		const dataUrl = await svgToPngDataUrl(svg, 2);
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = `${useDesignerStore.getState().username || "helmet"}.png`;
		a.click();
	};

	const handleEmail = async () => {
		const svg = document.querySelector("svg") as SVGSVGElement | null;
		if (!svg) return;
		const dataUrl = await svgToPngDataUrl(svg, 2);
		const res = await fetch("/api/send-helmet", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: useDesignerStore.getState().username,
				imageDataUrl: dataUrl,
				config: useDesignerStore.getState().serialize(),
			}),
		});
		if (!res.ok) {
			alert("Failed to send. Please try again later.");
			return;
		}
		alert("Sent to Alex successfully! ✉️");
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col lg:flex-row gap-6 items-start">
				<div className="flex-1 flex items-center justify-center">
					<div ref={stageRef} className="overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-2xl bg-gradient-to-br from-white to-neutral-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
						<HelmetCanvas />
					</div>
				</div>
				<ControlsPanel onExport={handleExport} onEmail={handleEmail} />
			</div>
		</div>
	);
};