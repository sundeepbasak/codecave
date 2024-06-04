#!/bin/bash

# Check if correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <python_file_path> <code>"
    exit 1
fi

# Assigning arguments to variables
python_file_path="$1"
code="$2"

# Check if the Python file exists
if [ ! -f "$python_file_path" ]; then
    echo "Error: Python file '$python_file_path' not found"
    exit 1
fi

# Execute the Python script with the provided code
output=$(python3 "$python_file_path" "$code")

# Return the output
echo -n "$output"