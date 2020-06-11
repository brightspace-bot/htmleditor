import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '../toolbar/button.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

// TODO: responsive sizing
// TODO: code formatting (enhancement)
// TODO: localize

class CodeButton extends LitElement {

	static get properties() {
		return {
			_html: { type: String },
			_opened: { type: Boolean },
			_wordWrap: { type: Boolean }
		};
	}

	static get styles() {
		return [inputStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			textarea.d2l-input {
				height: 200px;
				resize: none;
			}
		`];
	}

	constructor() {
		super();
		this._opened = false;
	}

	render() {
		return html`
			<d2l-htmleditor-button @click="${this._openDialog}" text="HTML Source Editor"></d2l-htmleditor-button>
			<d2l-dialog title-text="HTML Source Editor" ?opened="${this._opened}" @d2l-dialog-close="${this._handleClose}">
				<d2l-input-checkbox checked @change="${this._handleWordwrap}">Word wrap</d2l-input-checkbox>
				<textarea aria-label="HTML Source Code" class="d2l-input" wrap="${this._wordWrap ? 'soft' : 'off'}">${this._html}</textarea>
				<d2l-button slot="footer" primary data-dialog-action="insert">Save</d2l-button>
				<d2l-button slot="footer" data-dialog-action="">Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	async _handleClose(e) {
		this._opened = false;
		if (e.detail.action !== 'insert') return;
		// TODO: filter the HTML?
		const editor = await this.getRootNode().host.getEditor();
		editor.setContent(this.shadowRoot.querySelector('textarea').value, {source_view: true});
	}

	_handleWordwrap(e) {
		this._wordWrap = e.target.checked;
	}

	async _openDialog() {
		const editor = await this.getRootNode().host.getEditor();
		this._html = editor.getContent({source_view: true});
		this._opened = true;
	}

}

customElements.define('d2l-htmleditor-button-code', CodeButton);
