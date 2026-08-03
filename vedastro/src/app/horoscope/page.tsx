"use client";

import Link from "next/link";

const horoscopeRoutes = [
	{ title: "Daily", href: "/horoscope/daily", description: "Today's planetary overview." },
	{ title: "Weekly", href: "/horoscope/weekly", description: "Seven-day trend summary." },
	{ title: "Monthly", href: "/horoscope/monthly", description: "Monthly forecast highlights." },
	{ title: "Yearly", href: "/horoscope/yearly", description: "Year-ahead guidance." },
];

export default function HoroscopePage() {
	return (
		<section className="container mx-auto px-4 py-10 text-white">
			<div className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">Horoscope</p>
				<h1 className="mt-3 text-4xl font-black">Horoscope Hub</h1>
				<p className="mt-4 text-slate-400">Select a forecast view. These routes are now valid modules so the production build can proceed.</p>
			</div>

			<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{horoscopeRoutes.map((item) => (
					<Link key={item.href} href={item.href} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:border-amber-400/40 hover:bg-white/5">
						<h2 className="text-lg font-bold text-white">{item.title}</h2>
						<p className="mt-2 text-sm text-slate-400">{item.description}</p>
					</Link>
				))}
			</div>
		</section>
	);
}
