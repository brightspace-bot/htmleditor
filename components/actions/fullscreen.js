import '../toolbar/button-toggle.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class FullscreenButton extends LitElement {

	static get properties() {
		return {
			_active: { type: Boolean }
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

	render() {
		return html`<d2l-htmleditor-button-toggle ?active="${this._active}" @click="${this._handleClick}" text="Fullscreen"></d2l-htmleditor-button-toggle>`;
	}

	_handleClick() {
		this._active = !this._active;
		this.getRootNode().host._fullscreen = this._active;
	}

}

customElements.define('d2l-htmleditor-button-fullscreen', FullscreenButton);
