"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function SubmissionActions({ id, csrf, current }: { id: string; csrf: string; current: string }) { const [message, setMessage] = useState(""); const router = useRouter(); async function update(status: string) { const response = await fetch("/api/admin/submissions", { method: "POST", headers: { "Content-Type": "application/json", "x-csrf-token": csrf }, body: JSON.stringify({ id, status }) }); setMessage(response.ok ? "Updated" : "Could not update"); router.refresh(); } return <div className="submission-actions"><span>{current}</span><button onClick={() => update("REVIEWED")}>Mark reviewed</button><button onClick={() => update("DECLINED")}>Decline</button><small>{message}</small></div>; }
