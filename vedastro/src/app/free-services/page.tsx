"use client";

import Link from "next/link";

const services = [
	{
		title: "Kundli",
		href: "/free-services/kundli",
		description: "Generate and review your birth chart details.",
	},
	{
		title: "Matching",
		href: "/free-services/matching",
		description: "Check compatibility between two profiles.",
	},
	{
		title: "Numerology",
		href: "/free-services/numerology",
		description: "Explore number-based guidance and patterns.",
	},
	{
		title: "Name Numerology",
		href: "/free-services/name-numerology",
		description: "Review the numerology influence of a name.",
	},
];

export default function FreeServicesPage() {
	return (
		<section className="container mx-auto px-4 py-10 text-white">
			<div className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">
					Free Services
				</p>
				<h1 className="mt-3 text-4xl font-black">Guidance tools for everyday use</h1>
				<p className="mt-4 text-slate-400">
					Browse the available free services below. Each page is now a valid Next.js route so the production build can complete cleanly.
				</p>
			</div>

			<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{services.map((service) => (
					<Link
						key={service.href}
						href={service.href}
						className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:border-amber-400/40 hover:bg-white/5"
					>
						<h2 className="text-lg font-bold text-white">{service.title}</h2>
						<p className="mt-2 text-sm text-slate-400">{service.description}</p>
					</Link>
				))}
			</div>
		</section>
	);
}
