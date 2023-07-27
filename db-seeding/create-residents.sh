#!/bin/bash

# If you're on Windows, run bash create-residents.sh -w
# Otherwise, run bash create-residents.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Run SQL script in docker container
run_sql_script "
DELETE FROM residents;

ALTER SEQUENCE residents_id_seq RESTART WITH 1;

INSERT INTO residents (
    initial,
    room_num,
    date_joined,
    building
) 
SELECT
  chr(65 + floor(random() * 26)::integer) || chr(65 + floor(random() * 26)::integer),
  floor(random() * 900 + 100)::integer,
  NOW() + (random() * (NOW()+'90 days' - NOW())) + '30 days', 
  (ARRAY['144'::buildings, '362'::buildings, '402'::buildings])[floor(random() * 3 + 1)::integer]

FROM generate_series(1, $RESIDENT_ROWS);
"

echo "Resident seeding complete"
