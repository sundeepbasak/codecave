import * as babelParser from '@babel/parser';
import babelTraverse from '@babel/traverse'
import babelGenerator from '@babel/generator'
import fs from "node:fs"
import { LangTypes } from '../types/index.types';
import { DISALLOWED_JS_MODULES, DISALLOWED_PYTHON_MODULES } from '../constants/index.constants';

export const sanitizeJSCode = (code: string) => {
    const ast = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    })

    //Traverse the AST and remove unwanted malicious code
    babelTraverse(ast, {
        ImportDeclaration(path) {
            const moduleName = path.node.source.value;
            const disallowedModules = ['fs', 'path', 'child_process', 'process', 'fs:promises'];
            if (disallowedModules.includes(moduleName)) {
                throw new Error(`Cannot import module '${moduleName}'`);
            }
        },
        CallExpression(path) {
            if (path.get('callee').isIdentifier({ name: 'require' })) {
                throw new Error('Cannot use require statements')
                // path.remove();   
            }
        },
        MemberExpression(path) {
            const objectName = path.get('object').toString();
            const propertyName = path.get('property').toString();
            if (objectName === 'process') {
                throw new Error(`Cannot use process.${propertyName}`);
            }
        },
        // WhileStatement(path) {
        //     // console.log("WHILE", path);
        //     const val = path.node.test.value as boolean;
        //     if (val) {
        //         throw new Error(`While loop error`);
        //     }
        // }
    });

    // Generate sanitized code from modified AST
    const { code: sanitizedCode } = babelGenerator(ast);
    // console.log(sanitizedCode);
    return sanitizedCode
}

// sanitizeJSCode('while(true){console.log("hello")}')

export const sanitizeCode = (language: LangTypes, code: string) => {
    const disallowedImports: Record<LangTypes, string[]> = {
        javascript: DISALLOWED_JS_MODULES,
        python: DISALLOWED_PYTHON_MODULES,
        cpp: []
    };

    const disallowedFeatures: Record<LangTypes, string[]> = {
        javascript: ['eval', 'process'],
        python: [],
        cpp: []
    }

    const regexPattern = disallowedImports[language].concat(disallowedFeatures[language]).join('|');
    const regex = new RegExp('\\b(?:' + regexPattern + ')\\b', 'g');

    const disallowedMatches = code.match(regex);

    if (disallowedMatches && disallowedMatches.length > 0) {
        // const disallowedImportsList = disallowedMatches.join(', ');
        const firstDisallowedImport = disallowedMatches[0];
        console.log({ firstDisallowedImport })
        const errorMessage = `Cannot import ${firstDisallowedImport} found in code: ${language}`;
        throw new Error(errorMessage);
    }

    return code;
};

