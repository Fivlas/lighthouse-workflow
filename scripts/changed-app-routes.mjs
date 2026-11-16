import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PAGE_RE = /(^|\/)page\.(tsx|ts|jsx|js|mdx|md)$/;
const SPECIAL_RE =
    /(^|\/)(layout|template|loading|error|global-error|not-found|default)\.(tsx|ts|jsx|js)$/;

export const isRouteFile = (file) => PAGE_RE.test(file);

export const isSpecialAppFile = (file) => SPECIAL_RE.test(file);

const isPrivateSegment = (segment) => segment.startsWith("_");

const isParallelSegment = (segment) => segment.startsWith("@");

const isRouteGroupSegment = (segment) => /^\(.*\)$/.test(segment);

const isDynamicSegment = (segment) =>
    segment.startsWith("[") && segment.endsWith("]");

const stripInterceptorPrefix = (segment) =>
    segment.replace(/^\(\.\.\.\)|^\(\.\.\)|^\(\.\)/, "");

const segmentsFor = (root, file) =>
    path.relative(root, file).split(path.sep).slice(0, -1);

export const isPrivatePath = (root, file) =>
    segmentsFor(root, file).some(isPrivateSegment);

export const isDynamicPath = (root, file) =>
    segmentsFor(root, file).some(isDynamicSegment);

export const toRoute = (root, file) => {
    let relative = segmentsFor(root, file);

    if (relative.some(isPrivateSegment) || relative.some(isDynamicSegment)) {
        return null;
    }

    relative = relative
        .filter((segment) => !isRouteGroupSegment(segment))
        .filter((segment) => !isParallelSegment(segment))
        .map(stripInterceptorPrefix)
        .filter(Boolean);

    return "/" + relative.join("/");
};

export const walkPages = (dir) => {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const pages = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (isPrivateSegment(entry.name)) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            pages.push(...walkPages(fullPath));
            continue;
        }

        if (isRouteFile(fullPath)) {
            pages.push(fullPath);
        }
    }

    return pages;
};

export const getChangedRoutes = (root, changedFiles) => {
    const relevantChanges = changedFiles.filter((file) =>
        file.startsWith(`${root}/`),
    );

    const sharedChanges = relevantChanges.filter(
        (file) => !isRouteFile(file) && !isSpecialAppFile(file),
    );
    const specialChanges = relevantChanges.filter(isSpecialAppFile);
    const pageChanges = relevantChanges.filter(
        (file) =>
            isRouteFile(file) &&
            fs.existsSync(file) &&
            !isPrivatePath(root, file) &&
            !isDynamicPath(root, file),
    );

    const affectedFiles = new Set(pageChanges);

    if (sharedChanges.length > 0) {
        for (const file of walkPages(root)) {
            if (!isDynamicPath(root, file)) {
                affectedFiles.add(file);
            }
        }
    } else {
        for (const file of specialChanges) {
            for (const page of walkPages(path.dirname(file))) {
                if (!isDynamicPath(root, page)) {
                    affectedFiles.add(page);
                }
            }
        }
    }

    return [...new Set([...affectedFiles].map((file) => toRoute(root, file)))]
        .filter(Boolean)
        .sort();
};

const isCli =
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
    const [changedFilesPath, outputPath] = process.argv.slice(2);

    if (!changedFilesPath || !outputPath) {
        console.error(
            "Usage: node scripts/changed-app-routes.mjs <changed-files> <output-json>",
        );
        process.exit(1);
    }

    const roots = ["app", "src/app"];
    const root = roots.find((candidate) => fs.existsSync(candidate));

    if (!root) {
        console.error("Could not find app/ or src/app/");
        process.exit(1);
    }

    const changedFiles = fs
        .readFileSync(changedFilesPath, "utf8")
        .split("\n")
        .filter(Boolean);

    const relevantChanges = changedFiles.filter((file) =>
        file.startsWith(`${root}/`),
    );
    const routes = getChangedRoutes(root, changedFiles);

    fs.writeFileSync(outputPath, JSON.stringify(routes));

    console.log("Changed files:", relevantChanges);
    console.log("Routes to audit:", routes);
}
