export const toEmbedUrl = (url: string): string => {
	try {
		const parsed = new URL(url);
		// youtube.com/watch?v=ID
		if (
			(parsed.hostname === "www.youtube.com" ||
				parsed.hostname === "youtube.com") &&
			parsed.searchParams.has("v")
		) {
			return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
		}
		// youtu.be/ID
		if (parsed.hostname === "youtu.be") {
			return `https://www.youtube.com/embed${parsed.pathname}`;
		}
		// already an embed URL or other provider – return as-is
		return url;
	} catch {
		return url;
	}
};
