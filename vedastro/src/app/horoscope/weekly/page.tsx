"use client";

import Link from "next/link";

export default function WeeklyHoroscopePage() {
	return (
		<section className="container mx-auto px-4 py-10 text-white">
			<div className="max-w-3xl rounded-3xl border border-white/10 bg-slate-950/80 p-6 md:p-8">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">Horoscope</p>
				<h1 className="mt-3 text-4xl font-black">Weekly Horoscope</h1>
				<p className="mt-4 text-slate-400">Weekly horoscope route restored. Add the weekly summary UI later.</p>
				<div className="mt-6">
					<Link href="/horoscope" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950">Back to Horoscope</Link>
				</div>
			</div>
		</section>
	);
}
