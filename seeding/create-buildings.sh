#!/bin/bash

# If you're on Windows, run bash create-buildings.sh -w
# Otherwise, run bash create-buildings.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Run SQL script in docker container
run_sql_script "
DELETE FROM buildings;
INSERT INTO buildings (
  id,
  address,
  name
)
VALUES (
  1,
  '144 Erb St. W',
  'Building 1'
  );

INSERT INTO buildings (
id,
address,
name
)
VALUES ( 
  2,
  '362 Erb St. W',
  'Building 2'
  );

INSERT INTO buildings (
id,
address,
name
)
VALUES ( 
  3,
  '402 Erb St. W',
  'Building 3'
  );
"

echo "Buildings seeding complete"
