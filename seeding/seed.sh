#!/bin/bash

#Copy sql file to container
docker cp ./seed.sql SHOW-database:/docker-entrypoint-initdb.d/seed.sql

echo "Seeding database..."

docker exec -it SHOW-database /bin/bash -c 'psql -U postgres -d show_db -f docker-entrypoint-initdb.d/seed.sql'