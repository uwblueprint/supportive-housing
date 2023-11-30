#!/bin/bash

# If you're on Windows, run bash create-tags.sh -w
# Otherwise, run bash create-tags.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Run SQL script in docker container
run_sql_script "
DELETE FROM tags;

ALTER SEQUENCE tags_tag_id_seq RESTART WITH 1;

INSERT INTO tags (
    name,
    status
) 
VALUES (
  unnest(ARRAY['Tag1','Tag2','Tag3','Tag4','Tag5']), 
  '$TAG_STATUS'
);
"

echo "Tags seeding complete"
