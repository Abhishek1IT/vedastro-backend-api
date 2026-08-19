"use client";

import Button from "@/src/components/common/Button";
import Link from "next/link";

export default function KundliPage() {
	function openLoginModal(event: React.MouseEvent<HTMLButtonElement>): void {
		throw new Error("Function not implemented.");
	}

	return (
		<section className="container mx-auto px-4 py-10 text-white">
			<div className="max-w-3xl rounded-3xl border border-white/10 bg-slate-950/80 p-6 md:p-8">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">
					Free Service
				</p>
				<h1 className="mt-3 text-4xl font-black">Kundli</h1>
				<p className="mt-4 text-slate-400">
					This route is now restored as a valid page. Hook your kundli generator or chart preview here when ready.
				</p>

				<div className="mt-6 flex flex-wrap gap-3">
					<Link href="/free-services" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950">
						Back to Free Services
					</Link>
					<Button onClick={openLoginModal}>
						Login
					</Button>
				</div>
			</div>
		</section>
	);
}
