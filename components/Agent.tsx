
"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({
                   userName,
                   userId,
                   interviewId,
                   type,
                   questions,
               }: AgentProps) => {
    const router = useRouter();

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");

    // ✅ ensure summary is requested only once per call
    const summaryRequestedRef = useRef(false);

    /* -------------------- VAPI EVENTS -------------------- */
    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: any) => {
            if (
                message?.type === "transcript" &&
                message?.transcriptType === "final"
            ) {
                setMessages((prev) => [
                    ...prev,
                    { role: message.role, content: message.transcript },
                ]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
        };
    }, []);

    /* -------------------- LIVE TRANSCRIPT -------------------- */
    useEffect(() => {
        if (messages.length > 0 && callStatus !== CallStatus.FINISHED) {
            setLastMessage(messages[messages.length - 1].content);
        }
    }, [messages, callStatus]);

    /* -------------------- SUMMARY GENERATOR -------------------- */
    const generateSummary = useCallback(
        async (msgs: SavedMessage[]) => {
            if (summaryRequestedRef.current) return;
            summaryRequestedRef.current = true;

            const transcript = msgs
                .map((m) => `${m.role}: ${m.content}`)
                .join("\n");

            // ✅ EARLY END / SHORT INTERVIEW
            if (transcript.trim().length < 100) {
                setLastMessage(
                    "Interview completed.\n\n" +
                    "You ended the interview early, so a full evaluation could not be generated.\n\n" +
                    "Tip:\n" +
                    "• Try answering at least 3–4 questions\n" +
                    "• Speak in complete sentences"
                );
                return;
            }

            try {
                const res = await fetch("/api/interview-summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transcript }),
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Summary API error:", data);
                    setLastMessage(
                        "Interview completed.\n\n" +
                        "You ended the interview early, so a full evaluation could not be generated.\n\n" +
                        "Tip:\n" +
                        "• Try answering at least 3–4 questions\n" +
                        "• Speak in complete sentences"
                    );
                    return;
                }

                if (typeof data?.summary === "string" && data.summary.trim()) {
                    setLastMessage(data.summary);
                } else {
                    setLastMessage(
                        "Interview completed.\n\n" +
                        "You ended the interview early, so a full evaluation could not be generated.\n\n" +
                        "Tip:\n" +
                        "• Try answering at least 3–4 questions\n" +
                        "• Speak in complete sentences"
                    );
                }
            } catch (error) {
                console.error("Summary fetch error:", error);
                setLastMessage(
                    "Interview completed.\n\n" +
                    "You ended the interview early, so a full evaluation could not be generated.\n\n" +
                    "Tip:\n" +
                    "• Try answering at least 3–4 questions\n" +
                    "• Speak in complete sentences"
                );
            }
        },
        [] // ❗ no stale closure
    );

    /* -------------------- CALL END → SUMMARY -------------------- */
    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            const timeout = setTimeout(() => {
                generateSummary(messages); // ✅ always latest messages
            }, 700);

            return () => clearTimeout(timeout);
        }
    }, [callStatus, messages, generateSummary]);

    /* -------------------- START CALL -------------------- */
    const handleCall = async () => {
        summaryRequestedRef.current = false;
        setMessages([]);
        setLastMessage("");

        try {
            setCallStatus(CallStatus.CONNECTING);

            const formattedQuestions = questions
                ? questions.map((q: string) => `- ${q}`).join("\n")
                : "";

            await vapi.start("aaa4fd93-4c39-458c-aca4-f7df2fbb8717", {
                variableValues: {
                    username: userName ?? "Guest",
                    userid: userId ?? "",
                    questions: formattedQuestions,
                },
            });
        } catch (error: any) {
            console.error("Vapi error:", error);
            setCallStatus(CallStatus.INACTIVE);
        }
    };

    /* -------------------- END CALL -------------------- */
    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    /* -------------------- UI -------------------- */
    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="ai"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>


                <div className="card-border">
                    <div className="card-content">
                        <div className="flex items-center justify-center size-[120px] rounded-full bg-gray-700 text-white text-4xl font-semibold">
                            {userName?.charAt(0)?.toUpperCase() || "G"}
                        </div>
                        <h3>{userName}</h3>
                    </div>
                </div>

            </div>

            {lastMessage && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p className="animate-fadeIn whitespace-pre-line">
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                    <button className="btn-call" onClick={handleCall}>
                        {callStatus === "CONNECTING" ? "..." : "Call"}
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;
