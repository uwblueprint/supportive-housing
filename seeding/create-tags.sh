#!/bin/bash

# If you're on Windows, run bash create-tags.sh -w
# Otherwise, run bash create-tags.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Construct tag name array
data=()
for ((i=1; i <= $TAG_ROWS; i++)); do
  name="tag_$i"
  data+=("('$name')")
done

# Join with commas
values=$(IFS=,; echo "${data[*]}")

# Run SQL script in docker container
run_sql_script "
INSERT INTO tags (
  name
)
VALUES $values 
ON CONFLICT (name) DO NOTHING;
"

echo "Tags seeding complete"