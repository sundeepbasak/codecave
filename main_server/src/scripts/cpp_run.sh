    #!/bin/bash
    file_id=$(uuidgen)

    body=$1

    #save the code, run the code and return the output
    echo "$body" > "${file_id}"_input.cpp
    g++ "${file_id}"_input.cpp -o "${file_id}"_output
    ./"${file_id}"_output &> "${file_id}"_output.txt
    cat "${file_id}"_output.txt

    # #delete the input and output files and executable files
    rm "$file_id"_input.cpp
    rm "${file_id}"_output
    rm "$file_id"_output.txt