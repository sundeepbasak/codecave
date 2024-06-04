import { exec } from 'child_process';
import path from 'path';
import * as util from 'util'
import * as fs from 'fs'
import { LangTypes } from '../types/index.types';

const execJSAsync = util.promisify(exec);
export const executeScript = async (code: string, lang: LangTypes) => {
    try {
        // Execute the shell script with the provided data as argument
        const scriptPath = path.join(__dirname, `../scripts/${lang}_run.sh`);
        let command;
        if (lang === 'javascript') {
            command = `${scriptPath} '${code}'`;
        } else {
            command = `${scriptPath} ${code}`;
        }

        // console.log({ command })

        // fs.chmod(scriptPath, 0o705, (err) => {
        //     if (err) throw err;
        //     console.log('The permissions for file "my_file.txt" have been changed!');
        // })

        // Execute the command asynchronously
        const { stderr, stdout } = await execJSAsync(command);
        return { stdout, stderr };
    } catch (error) {
        console.error('Execution error:', error);
        throw new Error('Script execution failed');
    }
}

export const sanitizeScript = async (code: string, lang: LangTypes) => {
    try {
        // Execute the shell script with the provided data as argument
        const scriptPath = path.join(__dirname, `../scripts/parser/${lang}_parser_run.sh`);
        const filePath = path.join(__dirname, `../scripts/parser/${lang}_parser.py`) //!make it dynamic

        const command = `${scriptPath} '${filePath}' '${code}'`;

        // Execute the command asynchronously
        const { stderr, stdout } = await execJSAsync(command);
        // console.log("sanitizeScript Func", { stderr }, { stdout })

        return { stdout, stderr };
    } catch (error) {
        console.error('Execution error:', error);
        throw new Error('Script execution failed');
    }
}