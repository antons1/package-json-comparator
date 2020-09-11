const fs = require("fs");

const p1 = "./mbp.json";
const p2 = "./mpp.json";

console.log("Reading", p1, p2);

function readFileAndExtractData(path) {
    const fileData = fs.readFileSync(path, { encoding: 'utf-8' });
    const jsonData = JSON.parse(fileData);

    return {
        name: jsonData.name,
        dependencies: Object.assign({}, jsonData.dependencies, jsonData.devDependencies),
    }
}

function depsComparator(dep1, dep2) {
    const both = Object.keys(dep1).map((depName) => {
        if(dep2[depName]) return { name: depName, p1v: dep1[depName], p2v: dep2[depName] }
        else return null;
    });

    return both.filter((val) => val != null);
}

function getMissingPackages(base, comparator) {
    const basePackages = Object.keys(base);
    const compPackages = Object.keys(comparator);

    const notInBase = compPackages.filter((package) => !base[package])
    const notInComp = basePackages.filter((package) => !comparator[package])

    return [notInBase, notInComp]
}

const package1 = readFileAndExtractData(p1);
const package2 = readFileAndExtractData(p2);
const samePackages = depsComparator(package1.dependencies,package2.dependencies);
const [missingFrom1, missingFrom2] = getMissingPackages(package1.dependencies, package2.dependencies);

console.log("Comparing dependencies for", package1.name, "and", package2.name);

const nameL = 50;
const vL = 20;

function paddedString(str, len) {
    const padLength = len - str.length;
    return str + " ".repeat(padLength >= 0 ? padLength : 0);
}



console.log(`${paddedString("Package name", nameL)}${paddedString(package1.name, vL)}${paddedString(package2.name, vL)}`)
console.log("-".repeat(nameL+vL+vL))
samePackages.forEach(({name, p1v, p2v}) => console.log(`${paddedString(name, nameL)}${paddedString(p1v, vL)}${paddedString(p2v, vL)}`))
console.log();

console.log("Packages in", package2.name, "but not in", package1.name);
console.log("-".repeat(50))
missingFrom1.forEach((package) => console.log(package));
console.log();
console.log("Packages in", package1.name, "but not in", package2.name);
console.log("-".repeat(50))
missingFrom2.forEach((package) => console.log(package));