import { create } from "zustand";

export type Stripe = {
	id: string;
	points: { x: number; y: number }[];
	width: number;
	color: string;
	opacity: number;
};

export type Decal = {
	id: string;
	src: string;
	x: number;
	y: number;
	scale: number;
	rotation: number;
	opacity: number;
};

export type TextMark = {
	id: string;
	text: string;
	fontFamily: string;
	fontStyle: "regular" | "bold" | "italic" | "bold-italic";
	fill: string;
	stroke: string;
	strokeWidth: number;
	x: number;
	y: number;
	scale: number;
	rotation: number;
};

export type HelmetConfig = {
	username: string;
	shellColorPrimary: string;
	shellColorSecondary: string;
	shellGloss: number; // 0..1
	facemaskColor: string;
	shellStrokeColor: string;
	shellStrokeWidth: number;
	stripes: Stripe[];
	decals: Decal[];
	texts: TextMark[];
	showRivets: boolean;
	showEarHole: boolean;
	facemaskStyle: "standard" | "bulldog" | "qb";
	shadowIntensity: number; // 0..1
	metallic: boolean;
};

export type DesignerState = HelmetConfig & {
	selectedLayerId: string | null;
	setUsername: (v: string) => void;
	set: (p: Partial<HelmetConfig>) => void;
	addStripe: (s: Stripe) => void;
	updateStripe: (id: string, patch: Partial<Stripe>) => void;
	removeStripe: (id: string) => void;
	addDecal: (d: Decal) => void;
	updateDecal: (id: string, patch: Partial<Decal>) => void;
	removeDecal: (id: string) => void;
	addText: (t: TextMark) => void;
	updateText: (id: string, patch: Partial<TextMark>) => void;
	removeText: (id: string) => void;
	selectLayer: (id: string | null) => void;
	reset: () => void;
	serialize: () => string;
	hydrate: (json: string) => void;
};

const defaultState: HelmetConfig = {
	username: "",
	shellColorPrimary: "#e85d04",
	shellColorSecondary: "#000000",
	shellGloss: 0.6,
	facemaskColor: "#f4f4f5",
	shellStrokeColor: "#111827",
	shellStrokeWidth: 3,
	stripes: [],
	decals: [],
	texts: [],
	showRivets: true,
	showEarHole: true,
	facemaskStyle: "standard",
	shadowIntensity: 0.35,
	metallic: false,
};

export const useDesignerStore = create<DesignerState>((set, get) => ({
	...defaultState,
	selectedLayerId: null,
	setUsername: (v) => set({ username: v }),
	set: (p) => set(p),
	addStripe: (s) => set({ stripes: [...get().stripes, s] }),
	updateStripe: (id, patch) => set({
		stripes: get().stripes.map((s) => (s.id === id ? { ...s, ...patch } : s)),
	}),
	removeStripe: (id) => set({ stripes: get().stripes.filter((s) => s.id !== id) }),
	addDecal: (d) => set({ decals: [...get().decals, d] }),
	updateDecal: (id, patch) => set({
		decals: get().decals.map((d) => (d.id === id ? { ...d, ...patch } : d)),
	}),
	removeDecal: (id) => set({ decals: get().decals.filter((d) => d.id !== id) }),
	addText: (t) => set({ texts: [...get().texts, t] }),
	updateText: (id, patch) => set({
		texts: get().texts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
	}),
	removeText: (id) => set({ texts: get().texts.filter((t) => t.id !== id) }),
	selectLayer: (id) => set({ selectedLayerId: id }),
	reset: () => set({ ...defaultState }),
	serialize: () => JSON.stringify({
		username: get().username,
		shellColorPrimary: get().shellColorPrimary,
		shellColorSecondary: get().shellColorSecondary,
		shellGloss: get().shellGloss,
		facemaskColor: get().facemaskColor,
		shellStrokeColor: get().shellStrokeColor,
		shellStrokeWidth: get().shellStrokeWidth,
		stripes: get().stripes,
		decals: get().decals,
		texts: get().texts,
		showRivets: get().showRivets,
		showEarHole: get().showEarHole,
		facemaskStyle: get().facemaskStyle,
		shadowIntensity: get().shadowIntensity,
		metallic: get().metallic,
	}),
	hydrate: (json) => {
		try {
			const parsed = JSON.parse(json) as HelmetConfig;
			set({ ...defaultState, ...parsed });
		} catch {}
	},
}));