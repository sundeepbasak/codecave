import { Hono } from "hono";
import { executeScript, sanitizeScript } from "../utils/lang.utils";
import { sanitizeJSCode } from "../utils/sanitize.utils";

const lang = new Hono();

//js routes
lang.get('/javascript', (c) => c.text('JS running'))
lang.post('/javascript', async (c) => {
    try {
        const body = await c.req.json();
        const sanitizedCode = sanitizeJSCode(body.code);
        const { stderr, stdout } = await executeScript(sanitizedCode, "javascript");
        if (stderr) {
            return c.json({ stdout: null, stderr, message: 'This is the javascript output for the following code:' })
        }
        return c.json({ stdout, stderr: null, message: 'This is the javascript output for the following code:' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' })
    }
})

//python routes
lang.get('/python', (c) => c.text('Python GET'))
lang.post('/python', async (c) => {
    try {
        const body = await c.req.json();
        // const sanitizedCode = sanitizeCode('python', body.code); //!change this part
        const { stdout: sanitizedCode, stderr: sanitizedCodeError } = await sanitizeScript(body.code, 'python')
        if (sanitizedCodeError) {
            return c.json({ stdout: null, stderr: sanitizedCodeError, message: 'This is the python output for the following code:' })
        }
        const { stderr, stdout } = await executeScript(JSON.stringify(sanitizedCode), 'python');
        if (stderr) {
            return c.json({ stdout: null, stderr, message: 'This is the python output for the following code:' })
        }
        return c.json({ stdout, stderr: null, message: 'This is the python output for the following code:' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' })
    }
})

lang.get('/cpp', (c) => c.text('CPP running'))
lang.post('/cpp', async (c) => {
    try {
        const body = await c.req.json();
        // const sanitizedCode = sanitizeCode('python', body.code);
        const { stderr, stdout } = await executeScript(body.code, 'cpp');
        if (stderr) {
            return c.json({ stdout: null, stderr, message: 'This is the cpp output for the following code:' })
        }
        return c.json({ stdout, stderr: null, message: 'This is the cpp output for the following code:' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' })
    }
})

export default lang;


/**
 * !for js POST: CURL Request
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "const a = 10; const b = 20; console.log(a + b);"}' http://192.168.29.50:8080/lang/javascript
 * 
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "import fs from \"node:fs\"; console.log(fs);"}' http://192.168.29.50:8080/lang/javascript
 * 
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "while(true); console.log(\\"hello\\")"}' http://192.168.29.50:8080/lang/javascript
 * 
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "console.log(process.env)"}' http://192.168.29.50:8080/lang/javascript
 * 
 * !for python POST: CURL Request
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "print(\"HELLO PYTHON\")"}' http://192.168.29.50:8080/lang/python
 * 
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "import os; print(os.listdir())"}' http://192.168.29.50:8080/lang/python
 * 
 * !for cpp POST: CURL Request
 * curl -X POST -H "Content-Type: application/json" -d '{"code": "#include <iostream>\nusing namespace std;\n\nint main() \n{\n    cout << \"Hello, World!\";\n    return 0;\n}"}' http://192.168.29.50:8080/lang/cpp
 */