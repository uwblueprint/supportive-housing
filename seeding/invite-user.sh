#!/bin/bash

# If you're on Windows, run bash create-user.sh -w
# Otherwise, run bash create-user.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Run SQL script in docker container
run_sql_script "
INSERT INTO users (
  first_name,
  last_name,
  role,
  user_status,
  email
)
VALUES (
  '$FIRST_NAME',
  '$LAST_NAME',
  '$ROLE',
  'Invited',
  '$EMAIL'
);
"

echo "User seeding complete"
