import ast
import astunparse
import sys

def sanitize_python_code(code):
    # print("SANITIZE PYTHON CODE START", code)

    try:
        parsed_ast = ast.parse(code)

        disallowed_imports = ['os', 'sys', 'subprocess']

        class ImportVisitor(ast.NodeVisitor):
            def visit_Import(self, node):
                for alias in node.names:
                    if alias.name in disallowed_imports:
                        raise ValueError(f"Cannot import module: {alias.name}")
                    
            def visit_ImportFrom(self, node):
                if node.module in disallowed_imports:
                    raise ValueError(f"Cannot import from module: {node.module}")
                
        visitor = ImportVisitor()
        visitor.visit(parsed_ast)

        # sanitized_code = astunparse.unparse(parsed_ast)
        sanitized_code = astunparse.unparse(parsed_ast).strip()
        print(sanitized_code) 
    
    except Exception as e:
        print(e, file=sys.stderr)  # Print to stderr
   
    # return sanitized_code

sanitize_python_code(sys.argv[1])
