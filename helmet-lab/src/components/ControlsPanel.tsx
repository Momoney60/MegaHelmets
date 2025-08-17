"use client";

import React, { useMemo, useRef, useState } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";
import { Plus, Palette, Type, Image as ImageIcon, Save, Mail } from "lucide-react";
import { useDropzone } from "react-dropzone";

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<label className="text-sm text-neutral-500">{label}</label>
			<input type="color" className="h-8 w-12 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" value={value} onChange={(e) => onChange(e.target.value)} />
		</div>
	);
}

export const ControlsPanel: React.FC<{ onExport: () => void; onEmail: () => void }> = ({ onExport, onEmail }) => {
	const state = useDesignerStore();
	const [activeTab, setActiveTab] = useState<"colors" | "graphics" | "text" | "share">("colors");
	const onDrop = useMemo(
		() => (accepted: File[]) => {
			accepted.forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					useDesignerStore.getState().addDecal({
						id: `decal-${Date.now()}`,
						src: reader.result as string,
						x: 520,
						y: 260,
						scale: 0.4,
						rotation: 0,
						opacity: 1,
					});
				};
				reader.readAsDataURL(file);
			});
		},
		[],
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

	const usernameRef = useRef<HTMLInputElement>(null);

	return (
		<div className="w-full lg:w-[360px] xl:w-[420px] flex flex-col gap-4 p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl">
			<div className="flex items-center justify-between">
				<input ref={usernameRef} placeholder="Pick your username" value={state.username} onChange={(e) => state.setUsername(e.target.value)} className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600" />
				<button onClick={onExport} className="ml-2 inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-3 py-2 text-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"><Save size={16} />Export</button>
			</div>

			<div className="grid w-full grid-cols-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 text-sm">
				<button onClick={() => setActiveTab("colors")} className={`rounded-md py-2 ${activeTab === "colors" ? "bg-white dark:bg-neutral-700" : ""}`}>Colors</button>
				<button onClick={() => setActiveTab("graphics")} className={`rounded-md py-2 ${activeTab === "graphics" ? "bg-white dark:bg-neutral-700" : ""}`}>Graphics</button>
				<button onClick={() => setActiveTab("text")} className={`rounded-md py-2 ${activeTab === "text" ? "bg-white dark:bg-neutral-700" : ""}`}>Text</button>
				<button onClick={() => setActiveTab("share")} className={`rounded-md py-2 ${activeTab === "share" ? "bg-white dark:bg-neutral-700" : ""}`}>Share</button>
			</div>

			{activeTab === "colors" && (
				<div className="space-y-4">
					<div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 space-y-3">
						<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
							<Palette size={16} />
							<span className="text-sm font-medium">Shell</span>
						</div>
						<ColorInput label="Primary" value={state.shellColorPrimary} onChange={(v) => state.set({ shellColorPrimary: v })} />
						<ColorInput label="Secondary" value={state.shellColorSecondary} onChange={(v) => state.set({ shellColorSecondary: v })} />
						<div>
							<label className="text-sm text-neutral-500">Gloss: {(state.shellGloss * 100).toFixed(0)}%</label>
							<input type="range" min={0} max={1} step={0.01} value={state.shellGloss} onChange={(e) => state.set({ shellGloss: parseFloat(e.target.value) })} className="w-full" />
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm text-neutral-500">Metallic</label>
							<input type="checkbox" checked={state.metallic} onChange={(e) => state.set({ metallic: e.target.checked })} />
						</div>
					</div>

					<div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 space-y-3">
						<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
							<Palette size={16} />
							<span className="text-sm font-medium">Facemask</span>
						</div>
						<ColorInput label="Color" value={state.facemaskColor} onChange={(v) => state.set({ facemaskColor: v })} />
						<div>
							<label className="text-sm text-neutral-500">Shadow: {(state.shadowIntensity * 100).toFixed(0)}%</label>
							<input type="range" min={0} max={1} step={0.01} value={state.shadowIntensity} onChange={(e) => state.set({ shadowIntensity: parseFloat(e.target.value) })} className="w-full" />
						</div>
					</div>
				</div>
			)}

			{activeTab === "graphics" && (
				<div className="space-y-4">
					<div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center" {...getRootProps()}>
						<input {...getInputProps()} />
						<div className="flex flex-col items-center gap-2 text-neutral-600 dark:text-neutral-300">
							<ImageIcon size={24} />
							{isDragActive ? <p>Drop the image here...</p> : <p>Drag &apos;n&apos; drop decals here, or click to select</p>}
						</div>
					</div>
					<button className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => state.addStripe({ id: `stripe-${Date.now()}`, points: [{ x: 260, y: 130 }, { x: 500, y: 110 }, { x: 680, y: 150 }], width: 26, color: "#ffffff", opacity: 0.9 })}><Plus size={16} />Add Stripe</button>
				</div>
			)}

			{activeTab === "text" && (
				<div className="space-y-3">
					<button className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => state.addText({ id: `text-${Date.now()}`, text: state.username || "Team", fontFamily: "Arial", fontStyle: "bold", fill: "#ffffff", stroke: "#111827", strokeWidth: 2, x: 360, y: 210, scale: 1.2, rotation: -12 })}><Type size={16} />Add Text</button>
				</div>
			)}

			{activeTab === "share" && (
				<div className="space-y-4">
					<button onClick={onEmail} className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"><Mail size={16} />Send to Alex</button>
					<p className="text-xs text-neutral-500">Your final helmet image will be attached and sent automatically.</p>
				</div>
			)}
		</div>
	);
};