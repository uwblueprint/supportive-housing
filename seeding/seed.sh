#!/bin/bash

#If you're on Windows, run bash seed.sh -w
#Otherwise, run bash seed.sh

#Import root env file variables
source ./.env

#Get flag if exists
bin_bash="/bin/bash"

while getopts ":w" option; do
  case $option in
    w)
      bin_bash="//bin//bash"
      ;;
    *)
      echo "Invalid flag provided"
      exit 1
      ;;
  esac
done

#Run SQL script in docker container
cat << EOF | docker exec -i SHOW-database $bin_bash -c 'psql -U postgres -d show_db'

INSERT INTO log_records (
  employee_id, 
  resident_first_name, 
  resident_last_name, 
  datetime, 
  flagged, 
  attn_to, 
  note, 
  tags, 
  building ) 

SELECT
  $EMPLOYEE_ID,
  (ARRAY['John','Jerry','James','Jack'])[floor(random() * 4 + 1)], 
  (ARRAY['Doe','Show','Flow','Mow'])[floor(random() * 4 + 1)], 
  NOW() + (random() * (NOW()+'90 days' - NOW())) + '30 days', 
  (ARRAY[true,false])[floor(random() * 2 + 1)], 
  $ATTN_TO_ID, 
  (ARRAY['Amazing note','This is a note','Bad note','Decent Note','Cool note'])[floor(random() * 5 + 1)], 
  ARRAY['tag1', 'tag2'], 
  (ARRAY['144', '362', '402'])[floor(random() * 3 + 1)]

FROM generate_series(1, $LOG_RECORD_ROWS);

EOF

echo "Database seeding complete"