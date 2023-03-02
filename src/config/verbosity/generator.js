const fs = require('fs');

function getFileStructure(path) {
    const verbose = false;

    verbose ? console.log(`Calling ${getFileStructure.name} on ${path.match(/[^/]*$/)}.`) : null;

    const files = fs.readdirSync(path);
    verbose ? console.log(`Directory contents: ${files}`) : null;

    let fileStructure = {};

    for (const file of files) {
        verbose ? console.log() : null;
        
        if (file.startsWith('.')) {
            verbose ? console.log(`${file} is hidden. Ignore.`) : null;    
            continue;
        }

        const filePath = `${path}/${file}`;
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            verbose ? console.log(`${file} is a directory.`) : null;
            fileStructure[file] = getFileStructure(filePath);
        } else {
            verbose ? console.log(`${file} is a file.`) : null;
            fileStructure[file] = getComponentStructure(filePath);
        }
    }

    return fileStructure;
}

function getComponentStructure(path) {
    const verbose = false;
    
    let componentStructure = {};

    const fileContents = fs.readFileSync(path, 'utf8');
    const getClassesOutput = getClasses(fileContents);
    
    const classDefinitions = getClassesOutput.classDefinitions;
    if (classDefinitions != null) {
        for (const classDefinition of classDefinitions) {
            const className = classDefinition.match(/(?<=\bclass\s+)\w+/);
            let classFunctions = {}

            const classFunctionsArray = getFunctions(classDefinition);
            if (classFunctionsArray.length > 0) {
                for (const classFunction of classFunctionsArray) {
                    classFunctions[classFunction] = false;
                }
            }
            
            componentStructure[className] = classFunctions;
        }
    }

    const remainingFileContents = getClassesOutput.remainingFileContents;
    const remainingFunctions = getFunctions(remainingFileContents);
    if (remainingFunctions != null) {
        for (const remainingFunction of remainingFunctions) {
            componentStructure[remainingFunction] = false;
        }
    }

    return componentStructure;
}

function getClasses(fileContents) {
    const verbose = false;
    verbose ? console.log(`Calling ${getClasses.name}.`) : null;

    const classIndices = getClassIndices(fileContents);
    let classDefinitions = [];
    let remainingFileContents = fileContents.trim();
    verbose ? console.log(`remainingFileContents.length: ${remainingFileContents.length}`) : null;

    for (const classIndex of classIndices) {
        const classClosingBraceIndex = getClosingBraceIndex(fileContents, classIndex);
        const classDefinition = fileContents.substring(classIndex, classClosingBraceIndex).trim();

        verbose ? console.log(`classDefinition: ${classDefinition}`) : null;
        verbose ? console.log(`remainingFileContents: ${remainingFileContents}`) : null;

        remainingFileContents = remainingFileContents.replace(classDefinition, '');
        verbose ? console.log(`remainingFileContents.length: ${remainingFileContents.length}`) : null;

        // verbose ? console.log(classDefinition) : null;

        classDefinitions.push(classDefinition);
    }

    let classesFound = 0;

    if (classDefinitions.length > 0) {
        classesFound = classDefinitions.length;
    }

    verbose ? console.log(`Classes found: ${classesFound}`) : null;

    return {classDefinitions: classDefinitions, remainingFileContents: remainingFileContents};
}

function getClassIndices(fileContents) {
    const verbose = false;
    verbose ? console.log(`Calling ${getClassIndices.name}.`) : null;

    const regex = /\bclass\s+\w+\s*{/gm;
    const indices = [];
    
    let match;
    while ((match = regex.exec(fileContents)) !== null) {
      indices.push(match.index);
    }
  
    return indices;
}

function getClosingBraceIndex(str, startIndex) {
    const verbose = false;
    verbose ? console.log(`\nCalling ${getClosingBraceIndex.name}.`) : null;

    let i = startIndex;

    let foundOpeningBrace = false;
    let openingBraceIndex;

    let bracesToMatch = 0;

    while (i < str.length && !foundOpeningBrace) {
        if (str[i] === '{') {
            foundOpeningBrace = true;
            openingBraceIndex = i;
            bracesToMatch++;
        }
        i++;
    }

    while (i < str.length && bracesToMatch > 0) {
        if (str[i] === '{') {
            const lineStartIndex = str.lastIndexOf('\n', i) + 1;
            const lineEndIndex = str.indexOf('\n', i);

            const line = str.substring(lineStartIndex, lineEndIndex !== -1 ? lineEndIndex : str.length);

            if (!line.includes('regex')) {
                bracesToMatch++;
            }
        } else if (str[i] === '}') {
            const lineStartIndex = str.lastIndexOf('\n', i) + 1;
            const lineEndIndex = str.indexOf('\n', i);

            const line = str.substring(lineStartIndex, lineEndIndex !== -1 ? lineEndIndex : str.length);

            if (!line.includes('regex')) {
                bracesToMatch--;
            }
        }
        i++;
    }
    
    if (bracesToMatch !== 0) {
        throw new Error('Unmatched braces.');
    }
    
    return i;
}

function getFunctions(fileContents) {
    const verbose = false;
    verbose ? console.log(`Calling ${getFunctions.name}.`) : null;

    const regex = /\b(\w+)\([^()]*\)\s*{/gm;
    
    let functions = [];
    
    let match;
    while ((match = regex.exec(fileContents)) !== null) {
      functions.push(match[1]);
    }
  
    return functions;
}

const readPath = '/Users/ericbarch/Documents/Development/AutomaticSportsBetting/iteration-6/src';
const writePath = '/Users/ericbarch/Documents/Development/AutomaticSportsBetting/iteration-6/src/config/verbosity/verbosity.ts';

const json = getFileStructure(readPath);
const jsonString = JSON.stringify(json, null, 2);
const writeData = `export const verbosity = ${jsonString};`;

fs.writeFile(writePath, writeData, function (err) {
    if (err) throw err;
    console.log('Verbosity file written successfully');
});
