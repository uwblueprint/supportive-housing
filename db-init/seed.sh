#!/bin/bash

#Get absolute path to seeding dir and copy sql file to container

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
docker cp $SCRIPT_DIR/seed.sql SHOW-database:/docker-entrypoint-initdb.d/seed.sql

echo "Seeding database..."

docker exec -it SHOW-database /bin/bash -c 'psql -U postgres -d show_db -f docker-entrypoint-initdb.d/seed.sql'