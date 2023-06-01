#!/bin/bash

#Get absolute path to seeding dir
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cat $SCRIPT_DIR/seed.sql | docker exec -i SHOW-database /bin/bash -c 'psql -U postgres -d show_db'

echo "Database seeding complete"