import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
	try {
		const { username, imageDataUrl, config } = await req.json();
		if (!imageDataUrl) {
			return NextResponse.json({ error: "Missing image" }, { status: 400 });
		}
		const base64 = imageDataUrl.split(",")[1] || imageDataUrl;
		const attachments: Array<{ filename: string; content: string }> = [
			{
				filename: `${username || "helmet"}.png`,
				content: base64,
			},
			{
				filename: `${username || "helmet"}-config.json`,
				content: Buffer.from(config || "{}").toString("base64"),
			},
		];
		const apiKey = process.env.RESEND_API_KEY;
		if (!apiKey) {
			return NextResponse.json({ ok: true, note: "No RESEND_API_KEY set; skipped sending." });
		}
		const resend = new Resend(apiKey);
		await resend.emails.send({
			from: "helmet-lab@resend.dev",
			to: "alex.morin9@gmail.com",
			subject: `New helmet from ${username || "anonymous"}`,
			html: `<p>New helmet submission from <strong>${username || "anonymous"}</strong>.</p>`,
			attachments,
		});
		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}