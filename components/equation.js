/* eslint no-useless-escape: 0 */

import { css, LitElement } from 'lit-element/lit-element.js';
import { getComposedActiveElement } from '@brightspace-ui/core/helpers/focus.js';
import { icons } from '../icons.js';

// TODO: localize the tooltip

const editorTypes = {
	Latex: 0,
	MathML: 1,
	Graphical: 2,
	Chemistry: 3
};

tinymce.PluginManager.add('d2l-equation', function(editor) {

	// bail if no LMS context
	if (!D2L.LP) return;

	editor.ui.registry.addIcon('d2l-equation-chemistry', icons['equation-chemistry']);
	editor.ui.registry.addIcon('d2l-equation-graphical', icons['equation-graphical']);
	editor.ui.registry.addIcon('d2l-equation-latex', icons['equation-latex']);
	editor.ui.registry.addIcon('d2l-equation-mathml', icons['equation-mathml']);

	const getSelectedMathImage = () => {
		const contextNode = (editor.selection ? editor.selection.getNode() : null);
		if (!contextNode) return null;
		if (contextNode.tagName !== 'IMG' || !contextNode.classList.contains('equation')) return null;
		return contextNode;
	};

	const getEditorTypeForImage = (node) => {
		if (node.getAttribute('data-d2l-mathml').indexOf('latex') > -1) {
			return editorTypes.Latex;
		} else if (node.getAttribute('data-d2l-mathml').indexOf('wiris') > -1 && node.getAttribute('data-d2l-mathml').indexOf('wiris-chemistry') === -1) {
			return editorTypes.Graphical;
		} else if (node.getAttribute('data-d2l-mathml').indexOf('wiris-chemistry') > -1) {
			return editorTypes.Chemistry;
		} else {
			return editorTypes.MathML;
		}
	};

	const launchEditor = (editorType) => {
		const root = editor.getElement().getRootNode();

		let dialog = root.querySelector('d2l-equation-dialog');
		if (!dialog) dialog = root.appendChild(document.createElement('d2l-equation-dialog'));

		const contextNode = getSelectedMathImage();
		if (contextNode && getEditorTypeForImage(contextNode) === editorType) {
			dialog.mathML = decodeURIComponent(contextNode.attributes.getNamedItem('data-d2l-mathml').value);
		}

		dialog.type = editorType;
		dialog.opened = true;
		dialog.addEventListener('d2l-equation-dialog-close', (e) => {
			const html = e.detail.html;
			if (html) editor.execCommand('mceInsertContent', false, html);
		}, { once: true });

	};

	editor.ui.registry.addSplitButton('d2l-equation', {
		icon: 'd2l-equation-graphical',
		tooltip: 'Equations',
		onAction: () => {
			launchEditor(editorTypes.Graphical);
		},
		onItemAction: (api, value) => launchEditor(value),
		select: (value) => {
			const contextNode = getSelectedMathImage();
			return (contextNode && value === getEditorTypeForImage(contextNode));
		},
		fetch: (callback) => {
			const contextNode = getSelectedMathImage();
			const editorType = (contextNode ? getEditorTypeForImage(contextNode) : null);
			callback([{
				type: 'choiceitem',
				icon: 'd2l-equation-graphical',
				text: 'Graphical Equation',
				value: editorTypes.Graphical,
				disabled: contextNode && editorType !== editorTypes.Graphical
			}, {
				type: 'choiceitem',
				icon: 'd2l-equation-latex',
				text: 'LaTeX Equation',
				value: editorTypes.Latex,
				disabled: contextNode && editorType !== editorTypes.Latex
			}, {
				type: 'choiceitem',
				icon: 'd2l-equation-mathml',
				text: 'MathML Equation',
				value: editorTypes.MathML,
				disabled: contextNode && editorType !== editorTypes.MathML
			}, {
				type: 'choiceitem',
				icon: 'd2l-equation-chemistry',
				text: 'Chemistry Equation',
				value: editorTypes.Chemistry,
				disabled: contextNode && editorType !== editorTypes.Chemistry
			}]);
		}
	});

	const convertToImages = (context) => {

		const func = (match) => {

			// get the title of the equation
			let title = match.match(/title=(\"|\')([^\"]*)(\"|\')/i);
			if ((title !== null) && (title.length === 4) && (title[2] !== null)) title = title[2];
			else title = '';

			const annotationRegex = /<annotation encoding="([^"]*)">/gi;
			const annotationMatch = annotationRegex.exec(match);

			let removeAnnotation = false;
			let imageClass;
			if (annotationMatch === null) {
				imageClass = 'mathmlequation';
				removeAnnotation = true;
			} else {
				if (annotationMatch[1].indexOf('wiris') > -1) {
					imageClass = 'graphicalequation';
				} else if (annotationMatch[1] === 'latex') {
					imageClass = 'latexequation';
				} else {
					imageClass = 'mathmlequation';
					removeAnnotation = true;
				}
			}
			imageClass = `equation ${imageClass}`;

			// remove whitespace and annotation markup to reduce query length
			let trimmedMml = match.replace(/>\s+</g, '><');
			if (removeAnnotation) {
				trimmedMml = trimmedMml.replace(/<annotation[\s\S]*<\/annotation>/g, '');
			} else {
				trimmedMml = trimmedMml.replace(/;\s+&/g, ';&');
			}
			const encodedMml = encodeURIComponent(trimmedMml);

			const previewImageSrc = `/wiris/editorservice.aspx/render.png?mml=${encodedMml}`;
			const placeholderImageSrc = "'/d2l/img/LP/htmlEditor/equation_unavailable.png'";
			const placeholderImageTitle = "'Preview image not available for this equation'";

			// if there's an error loading preview image, placeholder image will be shown instead
			const onError = `if (this.src != ${placeholderImageSrc}) this.src = ${placeholderImageSrc};
				this.alt = ${placeholderImageTitle};
				this.title = ${placeholderImageTitle};`;
			const imageHtml = `<img class="${imageClass}"
				title="${title}"
				alt="${title}"
				src="${previewImageSrc}"
				style="vertical-align: middle;"
				hspace="5"
				vspace="5"
				onerror="${onError}"
				data-d2l-mathml="${encodedMml}" \/>`;

			return imageHtml;
		};

		const appletFunc = (match) => {
			let math = match.match(/<math[^>]*>(.|\n|\r)*<\/math>/gi);
			if (math !== null && math.length > 0) {
				math = math[0];
			}
			return func(D2L.LP.Web.UI.Html.Math.AnnotateMathML('wiris', '', math, math));
		};

		context.content = context.content.replace(/<applet[^>]*>(.|\n|\r)*?(<math[^>]*>(.|\n|\r)*?<\/math>)(.|\n|\r)*?<\/applet>/gi, appletFunc);
		context.content = context.content.replace(/<math[^>]*>(.|\n|\r)*?<\/math>/gi, func);

	};

	const convertToMathML = (context) => {
		const func = (match) => {
			// find the MathML
			const hackRegEx = /^<img[^>]*\s+data-d2l-mathml=\"([^\"]*)\"(.|\n|\r)*/i;
			const hackResult = hackRegEx.exec(match);
			const hack = decodeURIComponent(hackResult[1]);
			return hack;
		};

		context.content = context.content.replace(/<img[^>]*\s+data-d2l-mathml=\"[^\"]*\"[^>]*>/gi, func);
	};

	editor.on('BeforeSetContent', (e) => {
		convertToImages(e);
	});

	editor.on('PostProcess', (e) => {
		if (e.get) convertToMathML(e);
	});

});

class EditorDialog extends LitElement {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			mathML: { type: String },
			type: { String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.opened = false;
		this.mathML = '';
		this.type = editorTypes.Graphical;
	}

	render() {
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (!changedProperties.has('opened')) return;

		if (this.opened) {

			const result = await (new Promise((resolve) => {

				const createResult = D2L.LP.Web.UI.Desktop.MasterPages.Dialog.OpenWithParam(
					getComposedActiveElement(),
					new D2L.LP.Web.Http.UrlLocation('/d2l/lp/math/createeditor'),
					{
						mathml: this.mathML,
						editorType: this.type
					}
				);

				createResult.AddReleaseListener(resolve);
				createResult.AddListener(mathML => {
					if (!mathML || mathML.length === 0) {
						resolve();
						return;
					}
					resolve(mathML);
				});

			}));

			this.opened = false;

			this.dispatchEvent(new CustomEvent(
				'd2l-equation-dialog-close', {
					bubbles: true,
					detail: { html: result }
				}
			));

		}

	}

}
customElements.define('d2l-equation-dialog', EditorDialog);
