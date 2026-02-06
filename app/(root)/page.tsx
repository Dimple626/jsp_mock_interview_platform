
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

async function Home() {
    return (
        <>
            {/* HERO SECTION */}
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice real interview questions & get instant feedback
                    </p>

                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>

                <Image
                    src="/robot.png"
                    alt="AI Interview Assistant"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            {/* INFO SECTION (REPLACEMENT) */}
            <section className="mt-16 space-y-12 max-w-3xl">
                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        How PrepWise Helps You
                    </h2>
                    <ul className="mt-4 space-y-3 text-gray-300">
                        <li> Practice real interview questions with AI</li>
                        <li>Get instant feedback on your answers</li>
                        <li> Improve communication & confidence</li>
                        <li>Experience real interview-like conversations</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Who Is This For?
                    </h2>
                    <ul className="mt-4 space-y-3 text-gray-300">
                        <li> Students preparing for placements</li>
                        <li> Freshers & job seekers</li>
                        <li> Anyone practicing mock interviews</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Demo Mode
                    </h2>
                    <p className="mt-4 text-gray-300">
                        Interview history and personalized insights will appear here
                        once you complete practice interviews.
                    </p>
                </div>
            </section>
        </>
    );
}

export default Home;
