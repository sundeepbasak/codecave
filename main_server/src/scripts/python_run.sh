#!/bin/bash
file_id=$(uuidgen)

body=$1

#save the code, run the code and return the output
echo $body > "$file_id"_input.py
python3 "$file_id"_input.py > "$file_id"_output.txt 
cat "$file_id"_output.txt 

#delete the input and output files
rm "$file_id"_input.py 
rm "$file_id"_output.txt