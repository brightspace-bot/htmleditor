import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

const defaultProperties = {
	width: {value: 100, units: '%'},
	hasShadow: true
};

class Dialog extends LitElement {

	static get properties() {
		return {
			hrData: { type: Object },
			opened: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [inputLabelStyles, selectStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			label,
			.d2l-input-label {
				display: inline-block;
			}
			.d2l-htmleditor-hr-dialog-height {
				display: block;
			}
			.d2l-htmleditor-hr-dialog-width > d2l-input-text {
				margin-right: 0.8rem;
			}
			.d2l-htmleditor-hr-dialog-height > d2l-input-text,
			.d2l-htmleditor-hr-dialog-width > d2l-input-text {
				width: 4rem;
			}
			.d2l-htmleditor-hr-dialog-height,
			.d2l-htmleditor-hr-dialog-shadow {
				margin-top: 0.8rem;
			}
		`];
	}

	constructor() {
		super();
		this.opened = false;
		this.hrData = defaultProperties;
	}

	render() {
		const height = (this.hrData.height ? this.hrData.height : '');
		const width = (this.hrData.width && this.hrData.width.value) ? this.hrData.width.value : defaultProperties.width.value;
		const units = (this.hrData.width && this.hrData.width.units === 'px') ? 'px' : defaultProperties.width.units;
		return html`<d2l-dialog width="400" title-text="Horizontal Rule" ?opened="${this.opened}" @d2l-dialog-close="${this._handleClose}">
			<div class="d2l-htmleditor-hr-dialog-width">
				<d2l-input-text label="Width" .value="${width}"></d2l-input-text>
				<label>
					<span class="d2l-input-label">Width Type</span>
					<select class="d2l-input-select" .value="${units}">
						<option>%</option>
						<option>px</option>
					</select>
				</label>
			</div>
			<div class="d2l-htmleditor-hr-dialog-height">
				<d2l-input-text label="Height" .value="${height}"></d2l-input-text>
			</div>
			<div class="d2l-htmleditor-hr-dialog-shadow">
				<d2l-input-checkbox ?checked="${this.hrData.hasShadow}">Display Shadow</d2l-input-checkbox>
			</div>
			<d2l-button slot="footer" primary data-dialog-action="create">Create</d2l-button>
			<d2l-button slot="footer" data-dialog-action="">Cancel</d2l-button>
		</d2l-dialog>`;
	}

	_handleClose() {
		this.opened = false;

		let width = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-width d2l-input-text').value;
		if (!Number.isInteger(Number.parseInt(width))) width = defaultProperties.width.value;
		let widthUnits = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-width select').value;
		if (widthUnits !== 'px') widthUnits = defaultProperties.width.units;
		let height = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-height d2l-input-text').value;
		if (!Number.isInteger(Number.parseInt(height))) height = '';
		const shadow = this.shadowRoot.querySelector('d2l-input-checkbox').checked;

		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-hr-dialog-close', {
				bubbles: true,
				detail: { html: `<hr style="width: ${width}${widthUnits}; height: ${height}px; color: #ffffff; border-style: ${shadow ? 'inset' : 'solid'}; border-width: 1px; border-color: #cccccc;" />` }
			}
		));
	}

}

customElements.define('d2l-htmleditor-hr-dialog', Dialog);
