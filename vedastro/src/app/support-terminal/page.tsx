"use client";

import Link from "next/link";
import { Mail, MessageCircle, ArrowLeft } from "lucide-react";

export default function SupportTerminalPage() {
    return (
        <main className="min-h-screen bg-[#080503] px-6 py-24 text-white">
            <div className="mx-auto max-w-4xl">

                {/* Back */}
                <Link
                    href="/home"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
                        VedAstro Support
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Support Terminal
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
                        Need help with your VedAstro account, consultation, orders,
                        payments, or any other issue? Our support team is here to help.
                    </p>
                </div>

                {/* Support Cards */}
                <div className="grid gap-6 sm:grid-cols-2">

                    {/* Email Support */}
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <Mail className="h-6 w-6" />
                        </div>

                        <h2 className="text-xl font-semibold">
                            Email Support
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Send us an email for account, order, payment, or technical
                            support.
                        </p>

                        <a
                            href="mailto:support@vedastro.com"
                            className="mt-5 inline-block text-sm font-semibold text-amber-500 transition-colors hover:text-amber-400"
                        >
                            support@vedastro.com
                        </a>
                    </div>

                    {/* General Support */}
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <MessageCircle className="h-6 w-6" />
                        </div>

                        <h2 className="text-xl font-semibold">
                            General Support
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            For questions about consultations, astrologers, shop orders,
                            or other VedAstro services.
                        </p>

                        <p className="mt-5 text-sm font-semibold text-gray-300">
                            Our support team will assist you.
                        </p>
                    </div>

                </div>

                {/* Help Section */}
                <section className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold">
                        How can we help?
                    </h2>

                    <div className="mt-5 space-y-4 text-sm leading-7 text-gray-400">
                        <p>
                            <span className="font-semibold text-gray-200">
                                Account Issues:
                            </span>{" "}
                            Contact us if you are having trouble logging in or accessing
                            your account.
                        </p>

                        <p>
                            <span className="font-semibold text-gray-200">
                                Consultation:
                            </span>{" "}
                            Contact support if you experience an issue while booking or
                            attending an astrologer consultation.
                        </p>

                        <p>
                            <span className="font-semibold text-gray-200">
                                Orders:
                            </span>{" "}
                            For questions regarding your shop order, delivery, cancellation,
                            or order status, contact our support team.
                        </p>

                        <p>
                            <span className="font-semibold text-gray-200">
                                Payments:
                            </span>{" "}
                            If your payment was deducted but your order or consultation was
                            not confirmed, please contact support with your transaction
                            details.
                        </p>
                    </div>
                </section>

                <div className="mt-10 text-center text-xs text-gray-500">
                    <p>
                        Support Terminal
                    </p>
                    <p className="mt-1">
                        We are here to help make your experience better.
                    </p>
                </div>

            </div>
        </main>
    );
}