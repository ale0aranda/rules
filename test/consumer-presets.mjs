const modulePresets = [
	{
		name: "commitlint",
		specifier: "@ale0aranda/rules/commitlint",
	},
	{
		name: "lintStaged",
		specifier: "@ale0aranda/rules/lint-staged",
	},
	{
		name: "biome",
		specifier: "@ale0aranda/rules/biome",
		json: true,
	},
	{
		name: "biomeBase",
		specifier: "@ale0aranda/rules/biome/base",
		json: true,
	},
	{
		name: "biomeWeb",
		specifier: "@ale0aranda/rules/biome/web",
		json: true,
	},
	{
		name: "biomeNode",
		specifier: "@ale0aranda/rules/biome/node",
		json: true,
	},
	{
		name: "biomeLibrary",
		specifier: "@ale0aranda/rules/biome/library",
		json: true,
	},
	{
		name: "biomeMonorepo",
		specifier: "@ale0aranda/rules/biome/monorepo",
		json: true,
	},
	{
		name: "renovate",
		specifier: "@ale0aranda/rules/renovate",
		json: true,
	},
	{
		name: "knip",
		specifier: "@ale0aranda/rules/knip",
		json: true,
	},
	{
		name: "typescriptBase",
		specifier: "@ale0aranda/rules/typescript/base",
		json: true,
	},
	{
		name: "typescriptWeb",
		specifier: "@ale0aranda/rules/typescript/web",
		json: true,
	},
	{
		name: "typescriptNode",
		specifier: "@ale0aranda/rules/typescript/node",
		json: true,
	},
	{
		name: "typescriptLibrary",
		specifier: "@ale0aranda/rules/typescript/library",
		json: true,
	},
	{
		name: "vitestBase",
		specifier: "@ale0aranda/rules/vitest/base",
	},
	{
		name: "vitestNode",
		specifier: "@ale0aranda/rules/vitest/node",
	},
	{
		name: "vitestWeb",
		specifier: "@ale0aranda/rules/vitest/web",
	},
	{
		name: "tsupBase",
		specifier: "@ale0aranda/rules/tsup/base",
		named: ["defineTsupConfig"],
	},
	{
		name: "tsupLibrary",
		specifier: "@ale0aranda/rules/tsup/library",
		named: ["defineTsupLibraryConfig"],
	},
	{
		name: "tsupCli",
		specifier: "@ale0aranda/rules/tsup/cli",
		named: ["defineTsupCliConfig"],
	},
	{
		name: "unbuildBase",
		specifier: "@ale0aranda/rules/unbuild/base",
		named: ["defineUnbuildConfig"],
	},
	{
		name: "unbuildLibrary",
		specifier: "@ale0aranda/rules/unbuild/library",
		named: ["defineUnbuildLibraryConfig"],
	},
	{
		name: "esbuildBase",
		specifier: "@ale0aranda/rules/esbuild/base",
		named: ["defineEsbuildConfig"],
	},
	{
		name: "esbuildNode",
		specifier: "@ale0aranda/rules/esbuild/node",
		named: ["defineEsbuildNodeConfig"],
	},
	{
		name: "esbuildCli",
		specifier: "@ale0aranda/rules/esbuild/cli",
		named: ["defineEsbuildCliConfig"],
	},
	{
		name: "esbuildScript",
		specifier: "@ale0aranda/rules/esbuild/script",
		named: ["defineEsbuildScriptConfig"],
	},
	{
		name: "viteBase",
		specifier: "@ale0aranda/rules/vite/base",
		named: ["defineViteConfig"],
	},
	{
		name: "viteReact",
		specifier: "@ale0aranda/rules/vite/react",
		named: ["defineViteReactConfig"],
	},
	{
		name: "viteLibrary",
		specifier: "@ale0aranda/rules/vite/library",
		named: ["defineViteLibraryConfig"],
	},
	{
		name: "nextBase",
		specifier: "@ale0aranda/rules/next/base",
		named: ["defineNextConfig"],
	},
	{
		name: "playwright",
		specifier: "@ale0aranda/rules/playwright",
		named: [],
		defaultType: "function",
	},
];

const importOptions = (preset) =>
	preset.json ? ', { with: { type: "json" } }' : "";

export function createConsumerVerification() {
	const imports = modulePresets
		.map(
			({ name, specifier, ...preset }) =>
				`const ${name}Module = await import("${specifier}"${importOptions(preset)});`,
		)
		.join("\n");

	const defaults = modulePresets
		.map(({ name }) => `const ${name} = ${name}Module.default;`)
		.join("\n");

	const namedExports = modulePresets
		.flatMap(({ name, named = [] }) =>
			named.map(
				(exportName) => `const ${exportName} = ${name}Module.${exportName};`,
			),
		)
		.join("\n");

	const presetNames = modulePresets.map(({ name }) => name);
	const functionNames = modulePresets.flatMap(({ named = [] }) => named);
	const defaultTypes = Object.fromEntries(
		modulePresets.map(({ name, defaultType = "object" }) => [
			name,
			defaultType,
		]),
	);

	return `
${imports}
${defaults}
${namedExports}

const presets = {
	${presetNames.join(",\n\t")},
};

const functions = {
	${functionNames.join(",\n\t")},
};

const assert = (condition, message) => {
	if (!condition) {
		throw new Error(message);
	}
};

const defaultTypes = ${JSON.stringify(defaultTypes)};

for (const [name, preset] of Object.entries(presets)) {
	assert(
		preset && typeof preset === defaultTypes[name],
		\`Preset failed to load: \${name}\`,
	);
}

for (const [name, helper] of Object.entries(functions)) {
	assert(typeof helper === "function", \`Helper failed to load: \${name}\`);
}

assert(commitlint.rules, "Commitlint preset could not be loaded");
assert(Object.keys(lintStaged).length > 0, "lint-staged preset could not be loaded");
assert(biome.formatter && biome.linter, "Default Biome preset could not be loaded");
assert(biome === biomeBase, "Default Biome export is not the base preset");
assert(
	[biomeWeb, biomeNode, biomeLibrary, biomeMonorepo].every(
		(preset) => !Object.hasOwn(preset, "extends"),
	),
	"Specialized Biome presets must not extend other configurations",
);
assert(
	biomeNode.linter?.rules?.suspicious?.noConsole === "off",
	"Biome Node.js preset must allow console usage",
);
assert(
	biomeLibrary.linter?.rules?.suspicious?.noConsole === "error",
	"Biome library preset must reject console usage",
);
assert(renovate.packageRules, "Renovate preset could not be loaded");
assert(Array.isArray(knip.include), "Knip preset could not be loaded");
assert(
	[typescriptBase, typescriptWeb, typescriptNode, typescriptLibrary].every(
		(preset) => preset.compilerOptions,
	),
	"A TypeScript preset could not be loaded",
);
assert(
	tsupBase.entry && tsupLibrary.dts && tsupCli.banner?.js,
	"A tsup preset could not be loaded",
);
assert(
	unbuildBase.entries && unbuildLibrary.rollup?.emitCJS === false,
	"An unbuild preset could not be loaded",
);
assert(
	esbuildBase.format === "esm" &&
		esbuildNode.packages === "external" &&
		esbuildCli.banner?.js === "#!/usr/bin/env node\\n" &&
		esbuildScript.entryPoints,
	"An esbuild preset could not be loaded",
);
assert(
	viteBase.build?.outDir === "dist" &&
		viteReact.plugins?.length &&
		viteLibrary.build?.lib?.formats?.[0] === "es",
	"A Vite preset could not be loaded",
);
assert(
	nextBase.poweredByHeader === false &&
		nextBase.typescript?.ignoreBuildErrors === false,
	"Next.js preset could not be loaded",
);
`;
}
