import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class ToggleButton extends RtlMixin(LitElement) {

	static get properties() {
		return {
			active: { type: Boolean },
			command: { type: String },
			disabled: { type: Boolean },
			text: { type: String }
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

	constructor() {
		super();
		this._active = false;
	}

	render() {
		return html`<button ?disabled="${this.disabled}" @click="${this._handleClick}">${this.text} ${this.active} </button>`;
	}

}

customElements.define('d2l-htmleditor-toggle-button', ToggleButton);
