#!/bin/bash

# If you're on Windows, run bash create-residents.sh -w
# Otherwise, run bash create-residents.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Generate random initials
generate_initials() {
  letters=({A..Z})
  echo "${letters[RANDOM % 26]}${letters[RANDOM % 26]}"
}

# Generate random room number in the range [000, 999]
generate_room_num() {
  printf "%03d\n" $((RANDOM % 1000))
}

# Generate a random date in the range (prev 30 days, next 30 days)
generate_date() {
  start_date=$(date -v-30d +%s)
    
  # Generate a random number of days between 0 and 90
  random_days=$((RANDOM % 91))
    
  # Calculate the timestamp for the random date
  random_timestamp=$((start_date + (random_days * 86400))) # 86400 secs in day
  date -r $random_timestamp +"%Y-%m-%d"
}

# Select a random building ID
select_building_id() {
  echo $((RANDOM % 3 + 1))
}

# Values to create
values=""

# Generate each row of data
for ((i=0; i<$RESIDENT_ROWS ; i++)); do
    initials=$(generate_initials)
    room_num=$(generate_room_num)
    date_joined=$(generate_date)

    # Randomly set date left to be 15 days after date joined
    date_left=NULL
    if (( RANDOM % 2 == 0 )); then
      date_joined_timestamp=$(date -j -f "%Y-%m-%d" "$date_joined" "+%s")
      date_left_timestamp=$((date_joined_timestamp + 15 * 86400))
      date_left=$(date -r "$date_left_timestamp" +"%Y-%m-%d")
      date_left="'$date_left'" # Surround with single quotes for SQL insertion
    fi

    building_id=$(select_building_id)
    values+="('$initials', '$room_num', '$date_joined', $date_left, $building_id),"
done

# Remove the trailing comma
values=${values%,}

# Run SQL script in docker container
run_sql_script "
INSERT INTO residents (
    initial,
    room_num,
    date_joined,
    date_left,
    building_id
) 
VALUES $values
ON CONFLICT (initial, room_num) DO NOTHING;
"

echo "Resident seeding complete"
