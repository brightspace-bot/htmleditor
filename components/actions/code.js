import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

// TODO: responsive sizing
// TODO: code formatting (enhancement)
// TODO: localize

class Dialog extends LitElement {

	static get properties() {
		return {
			html: { type: String },
			opened: { type: Boolean, reflect: true },
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
			}
		`];
	}

	constructor() {
		super();
		this.opened = false;
		this.html = '';
	}

	render() {
		return html`<d2l-dialog title-text="HTML Source Editor" ?opened="${this.opened}" @d2l-dialog-close="${this._handleClose}">
			<d2l-input-checkbox checked @change="${this._handleWordwrap}">Word wrap</d2l-input-checkbox>
			<textarea aria-label="HTML Source Code" class="d2l-input" wrap="${this._wordWrap ? 'soft' : 'off'}">${this.html}</textarea>
			<d2l-button slot="footer" primary data-dialog-action="insert">Save</d2l-button>
			<d2l-button slot="footer" data-dialog-action="">Cancel</d2l-button>
		</d2l-dialog>`;
	}

	_handleClose(e) {
		this.opened = false;
		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-code-dialog-close', {
				bubbles: true,
				detail: { action: e.detail.action, html: this.shadowRoot.querySelector('textarea').value }
			}
		));
	}

	_handleWordwrap(e) {
		this._wordWrap = e.target.checked;
	}

}

customElements.define('d2l-htmleditor-code-dialog', Dialog);
