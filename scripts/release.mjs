import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const { name, version } = packageJson;

let published = false;

try {
	execFileSync("npm", ["view", `${name}@${version}`, "version"], {
		stdio: "ignore",
	});

	published = true;
} catch {
	published = false;
}

if (published) {
	console.log(`${name}@${version} is already published.`);
	process.exit(0);
}

execFileSync("pnpm", ["publish", "--access", "public"], {
	stdio: "inherit",
});
