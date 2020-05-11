import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize-static-mixin.js';

class HtmlEditor extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			prop1: { type: String },
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static get resources() {
		return {
			'ar': { term1: 'Term 1' },
			'da': { term1: 'Term 1' },
			'de': { term1: 'Term 1' },
			'en': { term1: 'Term 1' },
			'es': { term1: 'Term 1' },
			'fr': { term1: 'Term 1' },
			'ja': { term1: 'Term 1' },
			'ko': { term1: 'Term 1' },
			'nl': { term1: 'Term 1' },
			'pt': { term1: 'Term 1' },
			'sv': { term1: 'Term 1' },
			'tr': { term1: 'Term 1' },
			'tr-tr': { term1: 'Term 1' },
			'zh': { term1: 'Term 1' },
			'zh-cn': { term1: 'Term 1' },
			'zh-tw': { term1: 'Term 1' }
		};
	}

	constructor() {
		super();

		this.prop1 = 'htmleditor';
	}

	render() {
		return html`
			<h2>Hello ${this.prop1}!</h2>
			<div>Localization Example: ${this.localize('term1')}</div>
		`;
	}
}
customElements.define('d2l-htmleditor', HtmlEditor);
