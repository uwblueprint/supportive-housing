#!/bin/bash

# Import seeding directory file variables
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/.env

# Get flag if exists
bin_bash="/bin/bash"

while getopts ":w" option; do
  case $option in
    w)
      bin_bash="//bin//bash"
      ;;
    *)
      echo "Invalid flag provided"
      exit 1
      ;;
  esac
done

# Define a function to run the SQL script in the docker container
run_sql_script() {
  cat << EOF | docker exec -i SHOW-database $bin_bash -c 'psql -U postgres -d show_db'
$1
EOF
}