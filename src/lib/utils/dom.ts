/**
 * Creates a temporary anchor link for downloading a file
 *
 * @param filename
 * @param text
 */
export function download(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:text/csv;charset=utf-8,' + encodeURIComponent(text),
	);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
