#!/bin/bash

# If you're on Windows, run bash create-log-records.sh -w
# Otherwise, run bash create-log-records.sh

# NOTE: 
# this script will fail if a user with $EMPLOYEE_ID as an id does not exist
# it will also fail if residents don't exist in the db

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Run SQL script in docker container
run_sql_script "
INSERT INTO log_records (
  employee_id, 
  resident_id,
  datetime, 
  flagged, 
  attn_to, 
  note, 
  tags, 
  building 
) 
SELECT
  $EMPLOYEE_ID,
  (ARRAY(SELECT generate_series(1, $RESIDENT_ROWS)))[floor(random() * $RESIDENT_ROWS + 1)], 
  NOW() + (random() * (NOW()+'90 days' - NOW())) + '30 days', 
  (ARRAY[true,false])[floor(random() * 2 + 1)], 
  $ATTN_TO_ID, 
  (ARRAY['Amazing note','This is a note','Bad note','Decent Note','Cool note'])[floor(random() * 5 + 1)], 
  ARRAY['tag1', 'tag2'], 
  (ARRAY['144', '362', '402'])[floor(random() * 3 + 1)]

FROM generate_series(1, $LOG_RECORD_ROWS);
"

echo "Log Record seeding complete"
