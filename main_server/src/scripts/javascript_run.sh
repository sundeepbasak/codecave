#!/bin/bash
file_id=$(uuidgen)

body=$1

#save the code, run the code and return the output
# echo $body > "$file_id"_input.js 
# node "$file_id"_input.js > "$file_id"_output.txt 

node -e $body
# cat "$file_id"_output.txt 

# #delete the input and output files
# rm "$file_id"_input.js 
# rm "$file_id"_output.txt