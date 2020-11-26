import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item-button.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import 'tinymce/tinymce.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { requestInstance } from '@brightspace-ui/core/mixins/provider-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

const templates = [{
	name: 'Accordion Container',
	description: 'An accordion container for one or more panels.',
	steps: [{
		type: 'create',
		create: () => {
			const targetId = getUniqueId();
			const labelId = getUniqueId();
			return {
				scripts: [{ src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj' }, { src: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js', integrity: 'sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx' }],
				styleSheets: [{ href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css', integrity: 'sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2' }],
				html: `
					<div class="accordion" id="accordionExample">
						<div class="card">
							<div class="card-header" id="${labelId}">
								<h2 class="mb-0">
									<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#${targetId}" aria-expanded="true" aria-controls="${targetId}">
										Accordion Panel Heading
									</button>
								</h2>
							</div>
							<div id="${targetId}" class="collapse show" aria-labelledby="${labelId}" data-parent="#accordionExample">
								<div class="card-body">
								<p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker</p>
								<p>Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.</p>
								<p>Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.</p>
								</div>
							</div>
						</div>
						<div>placeholder</div>
					</div>`
			};
		}
	}]
}, {
	name: 'Accordion Panel',
	description: 'An accordion panel to be placed inside an accordion container.',
	steps: [{
		type: 'create',
		create: () => {
			const targetId = getUniqueId();
			const labelId = getUniqueId();
			return {
				scripts: [{ src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj' }, { src: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js', integrity: 'sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx' }],
				styleSheets: [{ href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css', integrity: 'sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2' }],
				html: `
					<div class="card">
						<div class="card-header" id="${labelId}">
							<h2 class="mb-0">
								<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#${targetId}" aria-expanded="false" aria-controls="${targetId}">
									Accordion Panel Heading
								</button>
							</h2>
						</div>
						<div id="${targetId}" class="collapse" aria-labelledby="${labelId}" data-parent="#accordionExample">
							<div class="card-body">
								<p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker</p>
								<p>Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.</p>
								<p>Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.</p>
							</div>
						</div>
					</div>
				`
			};
		}
	}]
}, {
	name: 'Alert (primary)',
	description: 'A simple primary alert.',
	steps: [{
		type: 'create',
		create: () => {
			return {
				styleSheets: [{ href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css', integrity: 'sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2' }],
				html: `
					<div class="alert alert-primary" role="alert">
						A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
					</div>`
			};
		}
	}]
}, {
	name: 'Alert (choice)',
	description: 'An alert template that prompts for the type of alert.',
	steps: [{
		type: 'properties',
		getProperties: () => {
			return [
				{ key: 'type', type: 'select', label: 'Type', default: 'primary', values: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] },
				{ key: 'dismissable', type: 'checkbox', label: 'Dismissable', default: true }
			];
		}
	}, {
		type: 'create',
		create: (state) => {
			return {
				scripts: [{ src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj' }, { src: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js', integrity: 'sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx' }],
				styleSheets: [{ href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css', integrity: 'sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2' }],
				html: `
					<div class="alert alert-${state.type} ${state.dismissable ? 'alert-dismissible fade show' : ''}" role="alert">
						A simple ${state.type} alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
						${state.dismissable ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' : ''}
					</div>`
			};
		}
	}]
}, {
	name: 'Alert (text)',
	description: 'An alert template that prompts for the type of alert and text.',
	steps: [{
		type: 'properties',
		getProperties: () => {
			return [
				{ key: 'type', type: 'select', label: 'Type', default: 'primary', values: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] },
				{ key: 'heading', type: 'text', label: 'Heading', default: '' },
				{ key: 'primaryMessage', type: 'text', label: 'Primary Message', default: '' },
				{ key: 'supportingMessage', type: 'text', label: 'Supporting Message', default: '' },
				{ key: 'dismissable', type: 'checkbox', label: 'Dismissable', default: true }
			];
		}
	}, {
		type: 'create',
		create: (state) => {
			return {
				scripts: [{ src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj' }, { src: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js', integrity: 'sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx' }],
				styleSheets: [{ href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css', integrity: 'sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2' }],
				html: `
					<div class="alert alert-${state.type} ${state.dismissable ? 'alert-dismissible fade show' : ''}" role="alert">
						<h4 class="alert-heading">${state.heading}</h4>
						<p>${state.primaryMessage}</p>
						<hr>
						<p>${state.supportingMessage}</p>
						${state.dismissable ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' : ''}
					</div>`
			};
		}
	}]
}, {
	name: 'Collapsible Section (with opener)',
	description: 'A collapsible container including a button toggle.',
	steps: [{
		type: 'properties',
		getProperties: () => {
			return [
				{ key: 'buttonText', type: 'text', label: 'Button Text', default: '' },
				{ key: 'collapsed', type: 'checkbox', label: 'Collapsed', default: false }
			];
		}
	}, {
		type: 'create',
		create: (state) => {
			const targetId = getUniqueId();
			return {
				scripts: [{ src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj' }, { src: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js', integrity: 'sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx' }],
				styleSheets: [{ href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css', integrity: 'sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2' }],
				html: `
					<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#${targetId}" aria-expanded="${state.collapse ? 'false' : 'true'}" aria-controls="${targetId}">
						${state.buttonText}
					</button>
					<div class="collapse" id="${targetId}" class="${state.collapse ? '' : 'collapse show'}">
						<div class="card card-body">
							Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.
						</div>
					</div>`
			};
		}
	}]
}];

const templateStrings = [
	{ text: 'templateAlert', value: `
		<div class="alert alert-primary" role="alert">
			A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
		</div>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
		<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>`
	}
];

tinymce.PluginManager.add('d2l-templates', function(editor) {

	if (!requestInstance(editor.getElement(), 'fullPage')) return;

	editor.ui.registry.addButton('d2l-templates', {
		tooltip: 'Insert Template',
		icon: 'template',
		onAction: () => {
			const root = editor.getElement().getRootNode();

			let dialog = root.querySelector('d2l-htmleditor-templates-dialog');
			if (!dialog) dialog = root.appendChild(document.createElement('d2l-htmleditor-templates-dialog'));

			dialog.opener = root.host;
			dialog.opened = true;

			dialog.addEventListener('d2l-htmleditor-templates-dialog-close', (e) => {

				const contextNode = (editor.selection ? editor.selection.getNode() : null);
				if (contextNode) {
					editor.selection.select(contextNode);
				}
				editor.insertContent(`${e.detail.html}<p></p>`);

				const editorDocument = new DOMParser().parseFromString(editor.getContent(), 'text/html');

				let requiresContentUpdate = false;
				if (e.detail.styleSheets) {
					e.detail.styleSheets.forEach(styleSheet => {
						if (!editorDocument.head.querySelector(`link[href="${styleSheet.href}"]`)) {
							requiresContentUpdate = true;
							const elem = editorDocument.createElement('link');
							elem.rel = 'stylesheet';
							elem.href = styleSheet.href;
							if (styleSheet.integrity) elem.integrity = styleSheet.integrity;
							elem.crossOrigin = 'anonymous';
							editorDocument.head.appendChild(elem);
						}
					});
				}
				if (e.detail.scripts) {
					e.detail.scripts.forEach(script => {
						if (!editorDocument.body.querySelector(`script[src="${script.src}"]`)) {
							requiresContentUpdate = true;
							const elem = editorDocument.createElement('script');
							elem.src = script.src;
							if (script.integrity) elem.integrity = script.integrity;
							elem.crossOrigin = 'anonymous';
							editorDocument.body.appendChild(elem);
						}
					});
				}
				if (requiresContentUpdate) editor.setContent(editorDocument.documentElement.outerHTML);

			}, { once: true });

		}
	});

	editor.ui.registry.addAutocompleter('d2l-templates', {
		ch: '$',
		minChars: 0,
		columns: 1,
		fetch: pattern => {
			const matchedChars = templateStrings.filter(char => {
				return char.text.indexOf(pattern) !== -1;
			});

			return new tinymce.util.Promise(resolve => {
				const results = matchedChars.map(char => {
					//console.log(char.value);
					//console.log(char.text);
					return {
						value: char.value,
						text: char.text,
						icon: null
					};
				});
				resolve(results);
			});
		},
		matches: (rng, text) => {
			return text.startsWith('$template');
		},
		onAction: (autocompleteApi, rng, value) => {
			editor.selection.setRng(rng);
			editor.insertContent(value);
			autocompleteApi.hide();
		}
	});

});

class TemplatesDialog extends LitElement {

	static get properties() {
		return {
			opened: { type: Boolean },
			_stepIndex: { type: Number },
			_templateIndex: { type: Number }
		};
	}

	static get styles() {
		return [inputLabelStyles, inputStyles, selectStyles, css`
			.d2l-htmleditor-templates-field {
				margin-top: 0.8rem;
			}
			.d2l-htmleditor-templates-field:first-child {
				margin-top: 0;
			}
		`];
	}

	constructor() {
		super();
		this.opened = false;
		this._propertyState = {};
		this._stepIndex = -1;
		this._templateIndex = -1;
	}

	render() {
		let content;
		if (this._templateIndex === -1) {

			content = html`
				<d2l-list>
					${templates.map((template, index) => html`
						<d2l-list-item-button data-template-index="${index}" @d2l-list-item-button-click="${this._handleListItemClick}">
							<d2l-list-item-content>
								<div>${template.name}</div>
								<div slot="secondary">${template.description}</div>
							</d2l-list-item-content>
						</d2l-list-item-button>
					`)}
				</d2l-list>
			`;

		} else {

			const template = templates[this._templateIndex];
			const step = template.steps[this._stepIndex];
			const isCreateNext = (template.steps.length > this._stepIndex + 1 && template.steps[this._stepIndex + 1].type === 'create');

			if (step.type === 'properties') {

				const properties = step.getProperties(this._getPropertyState());
				content = repeat(properties, property => property.key, property => {

					const value = this._propertyState[property.key] ? this._propertyState[property.key].value : property.default;

					switch (property.type) {
						case 'select':
							return html`
								<div class="d2l-htmleditor-templates-field">
									<label>
										<span class="d2l-input-label">${property.label}</span>
										<select class="d2l-input-select" data-property-key="${property.key}">
											${property.values.map((optionValue) => html`<option value="${optionValue}" ?selected="${value === optionValue}">${optionValue}</option>`)}
										</select>
									</label>
								</div>
							`;
						case 'checkbox':
							return html`
								<div class="d2l-htmleditor-templates-field">
									<d2l-input-checkbox data-property-key="${property.key}" ?checked="${value}">${property.label}</d2l-input-checkbox>
								</div>
							`;
						case 'text':
							return html`
								<div class="d2l-htmleditor-templates-field">
									<label>
										<span class="d2l-input-label">${property.label}</span>
										<d2l-input-text data-property-key="${property.key}" value="${value}"></d2l-input-text>
									</label>
								</div>
							`;
					}

				});
				content = [content, html`
					<d2l-button slot="footer" primary @click="${this._handleNextClick}">
						${isCreateNext ? 'Create' : 'Next'}
					</d2l-button>
				`];
				if (this._stepIndex > 0) {
					content.push(html`<d2l-button slot="footer" @click="${this._handleBackClick}">Back</d2l-button>`);
				}

			}

		}

		return html`
			<d2l-dialog title-text="Insert Template" ?opened="${this.opened}" @d2l-dialog-close="${this._handleClose}">
				${content}
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	_create(step) {

		const result = step.create(this._getPropertyState());

		this.opened = false;

		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-templates-dialog-close', {
				bubbles: true,
				detail: result
			}
		));

	}

	_getPropertyState() {
		const state = {};
		for (const prop in this._propertyState) {
			state[prop] = this._propertyState[prop].value;
		}
		return state;
	}

	_handleBackClick() {
		this._stepIndex -= 1;
	}

	_handleClose() {
		// dialog may have closed in several ways, so we need to make sure state is in sync
		this.opened = false;
		this._propertyState = {};
		this._stepIndex = -1;
		this._templateIndex = -1;
	}

	_handleListItemClick(e) {
		const templateIndex = Number(e.target.getAttribute('data-template-index'));
		const template = templates[templateIndex];
		if (template.steps[0].type === 'create') {
			this._create(template.steps[0]);
		} else if (template.steps[0].type === 'properties') {
			this._templateIndex = templateIndex;
			this._stepIndex = 0;
		}
	}

	_handleNextClick() {
		const template = templates[this._templateIndex];

		this.shadowRoot.querySelectorAll('[data-property-key]').forEach((elem) => {
			const key = elem.getAttribute('data-property-key');
			this._propertyState[key] = {
				stepIndex: this._stepIndex,
				value: elem.tagName === 'D2L-INPUT-CHECKBOX' ? elem.checked : elem.value
			};
		});

		if (template.steps[this._stepIndex + 1].type === 'create') {
			this._create(template.steps[this._stepIndex + 1]);
		} else {
			this._stepIndex += 1;
		}
	}

	_open() {
		this.opened = true;
	}

}

customElements.define('d2l-htmleditor-templates-dialog', TemplatesDialog);
