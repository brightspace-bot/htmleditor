import 'tinymce/tinymce.js';

const replaceStrings = [
	{ text: 'Email', value: '{Email}' },
	{ text: 'ExternalEmail', value: '{ExternalEmail}' },
	{ text: 'FirstName', value: '{FirstName}' },
	{ text: 'InternalEmail', value: '{InternalEmail}' },
	{ text: 'LastName', value: '{LastName}' },
	{ text: 'OrgDefinedId', value: '{OrgDefinedId}' },
	{ text: 'OrgId', value: '{OrgId}' },
	{ text: 'OrgName', value: '{OrgName}' },
	{ text: 'OrgUnitCode', value: '{OrgUnitCode}' },
	{ text: 'OrgUnitId', value: '{OrgUnitId}' },
	{ text: 'OrgUnitName', value: '{OrgUnitName}' },
	{ text: 'OrgUnitPath', value: '{OrgUnitPath}' },
	{ text: 'OrgUnitTypeId', value: '{OrgUnitTypeId}' },
	{ text: 'RoleCode', value: '{RoleCode}' },
	{ text: 'RoleId', value: '{RoleId}' },
	{ text: 'RoleName', value: '{RoleName}' },
	{ text: 'UserId', value: '{UserId}' },
	{ text: 'UserName', value: '{UserName}' }
];

tinymce.PluginManager.add('d2l-replace-strings', function(editor) {

	editor.ui.registry.addAutocompleter('d2l-replace-strings', {
		ch: '{',
		minChars: 1,
		columns: 1,
		fetch: pattern => {
			const matchedChars = replaceStrings.filter(char => {
				return char.text.indexOf(pattern) !== -1;
			});

			return new tinymce.util.Promise(resolve => {
				const results = matchedChars.map(char => {
					return {
						value: char.value,
						text: char.text,
						icon: null
					}
				});
				resolve(results);
			});
		},
		onAction: (autocompleteApi, rng, value) => {
			editor.selection.setRng(rng);
			editor.insertContent(value);
			autocompleteApi.hide();
		}
	});

});
