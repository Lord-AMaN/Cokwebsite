/**
 * Extracts a YouTube video ID from any common link shape:
 *   - https://www.youtube.com/watch?v=ID
 *   - https://youtu.be/ID
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 *   - https://www.youtube.com/live/ID
 * Tolerates: missing "https://", surrounding quote marks, extra whitespace,
 * and trailing query params (?feature=share, etc).
 * Unlisted videos work the same as public ones — "unlisted" only affects
 * whether the video shows up in YouTube's own search/browse, not embedding.
 */
export function getYouTubeId(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;

  let cleaned = rawUrl.trim().replace(/^['"]+|['"]+$/g, '');
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  let u: URL;
  try {
    u = new URL(cleaned);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0];
    return id || null;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (u.pathname === '/watch') {
      return u.searchParams.get('v');
    }
    const match = u.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
    if (match) return match[2];
  }

  return null;
}