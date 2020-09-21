const chalk = require('chalk'),
	fs = require('fs'),
	path = require('path');

const langsPath = path.join(__dirname, '../tinymce/langs');
const outputPath = path.join(__dirname, '../generated');

function getTinyMCELangs() {
	const langs = fs.readdirSync(langsPath);
	return langs.filter((lang) => {
		if (lang.substr(0, 1) === '.') return false;
		return true;
	}).map((lang) => {
		return lang.replace('.js', '');
	});
}

function createLangsExport(langs) {
	if (!fs.existsSync(outputPath)) {
		fs.mkdirSync(outputPath);
	}

	langs = langs.map((lang) => {
		return `'${lang}'`;
	});

	const destPath = path.join(outputPath, 'langs.js');

	// eslint-disable-next-line prefer-template
	const output = '// auto-generated\n' + 'export const tinymceLangs = [' + langs.join(', ') + '];\n';

	fs.writeFileSync(destPath, output);

}

function generate() {

	console.log(chalk.yellow('Generating langs...'));

	const langs = getTinyMCELangs();

	console.log(langs.join(', '));

	createLangsExport(langs);

	console.log(chalk.green('tinyMCE lang export generated.\n'));
}

try {
	generate();
	process.exit(0);
} catch (err) {
	console.error(chalk.red(err));
	process.exit(1);
}
