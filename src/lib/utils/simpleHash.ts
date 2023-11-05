/**
 * Generates a simple hash from a given input
 *
 * {@link https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781?permalink_comment_id=4738050#gistcomment-4738050}
 *
 * @param str
 * @returns
 */
export default function simpleHash(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash &= hash; // Convert to 32bit integer
	}
	return (hash >>> 0).toString(36);
}
