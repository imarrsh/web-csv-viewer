/**
 * Generates a hash from a given input
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
