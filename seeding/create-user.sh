#!/bin/bash

#If you're on Windows, run bash create-user.sh -w
#Otherwise, run bash create-user.sh

# Import common functions
source ./seed.sh

# Run SQL script in docker container
run_sql_script "
INSERT INTO users (
  first_name,
  last_name,
  auth_id,
  role
)
SELECT 
  '$FIRST_NAME',
  '$LAST_NAME',
  '$AUTH_ID',
  '$ROLE'
WHERE NOT EXISTS (
  SELECT 1
  FROM users
  WHERE first_name = '$FIRST_NAME'
    AND last_name = '$LAST_NAME'
);
"

echo "User seeding complete"
