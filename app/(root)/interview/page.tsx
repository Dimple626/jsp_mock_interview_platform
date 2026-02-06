

"use client";

import Agent from "@/components/Agent";

export default function InterviewPage() {
    return (
        <div className="relative min-h-screen bg-gray-900 text-white">

            {/* ❌ BACKGROUND LAYER (sirf visual, NO clicks) */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl pointer-events-none" />

            {/* ✅ CONTENT LAYER (CLICKABLE) */}
            <div className="relative z-50 flex items-center justify-center min-h-screen pointer-events-auto">
                <Agent
                    userName="Guest"
                    userId="guest"
                    interviewId="demo"
                    type="interview"
                    questions={[]}
                />


            </div>

        </div>
    );
}