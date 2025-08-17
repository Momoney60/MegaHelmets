import { DesignerPage } from "@/components/DesignerPage";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-black dark:to-zinc-900 text-neutral-900 dark:text-neutral-100 p-6">
			<div className="mx-auto max-w-[1400px]">
				<div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight">Helmet Lab</h1>
						<p className="text-neutral-600 dark:text-neutral-400">Design a vector-perfect football helmet. Save or send when done.</p>
					</div>
				</div>
				<DesignerPage />
			</div>
		</div>
	);
}
