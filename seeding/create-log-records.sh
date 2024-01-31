#!/bin/bash

# If you're on Windows, run bash create-log-records.sh -w
# Otherwise, run bash create-log-records.sh

# Import common functions
SEEDING_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SEEDING_DIR/seed.sh

# Import the notes into an array
notes=()
IFS=$'\n' read -d '' -r -a notes < $SEEDING_DIR/notes.txt
number_of_notes=${#notes[@]}

# Query for resident IDs
residents_query_output=$(run_sql_script "SELECT id from residents;")
resident_ids=()

# Read each line of the output and extract resident IDs
while IFS= read -r line; do
  # Extract resident ID from the line
  resident_id=$(echo "$line" | awk '{print $1}')
  # Skip if it's not a number
  if [[ $resident_id =~ ^[0-9]+$ ]]; then
    # Append resident ID to the array
    resident_ids+=("$resident_id")
  fi
done <<< "$residents_query_output"

number_of_residents=${#resident_ids[@]}

# Query for tag ids
tags_query_output=$(run_sql_script "SELECT tag_id from tags;")
tag_ids=()

# Read each line of the output and extract tag IDs
while IFS= read -r line; do
  # Extract tag ID from the line
  tag_id=$(echo "$line" | awk '{print $1}')
  # Skip if it's not a number
  if [[ $tag_id =~ ^[0-9]+$ ]]; then
    # Append tag ID to the array
    tag_ids+=("$tag_id")
  fi
done <<< "$tags_query_output"

number_of_tags=${#tag_ids[@]}

# Query for employee ids
employees_query_output=$(run_sql_script "SELECT id from users;")
employee_ids=()

# Read each line of the output and extract employee IDs
while IFS= read -r line; do
  # Extract tag ID from the line
  employee_id=$(echo "$line" | awk '{print $1}')
  # Skip if it's not a number
  if [[ $employee_id =~ ^[0-9]+$ ]]; then
    # Append employee ID to the array
    employee_ids+=("$employee_id")
  fi
done <<< "$employees_query_output"

number_of_employees=${#employee_ids[@]}

# ------------------------------------------------------------------------------------------------------------------------

# Select employee id to be used
select_employee_id() {
  random_index=$((RANDOM % number_of_employees))

  # Select the random ID using the random index
  random_employee_id="${employee_ids[random_index]}"
  echo $random_employee_id
}

# Generate a random date in the range (prev 30 days, next 30 days)
generate_date() {
  start_date=$(date -v-30d +%s)
    
  # Generate a random number of days between 0 and 90
  random_days=$((RANDOM % 91))
    
  # Calculate the timestamp for the random date
  random_timestamp=$((start_date + (random_days * 86400))) # 86400 secs in day
  date -r $random_timestamp +"%Y-%m-%d %H:%M:%S"
}

# Generate a random True or False value
generate_flagged() {
  random_bool=$((RANDOM % 2))
  echo $random_bool
}

# Select attn to to be used
select_attn_to() {
  if (( RANDOM % 2 == 0 )); then
    number_of_employees=${#employee_ids[@]}
    random_index=$((RANDOM % number_of_employees))

    # Select the random ID using the random index
    random_employee_id="${employee_ids[random_index]}"
    echo $random_employee_id
  else
    echo NULL
  fi
}

# Select a random note from the list
generate_note() {
  random_index=$((RANDOM % number_of_notes))
  random_note="${notes[random_index]}"
  echo $random_note
}

# Select a random building ID
select_building_id() {
  echo $((RANDOM % 3 + 1))
}

# Values to create
log_record_values=""

# Generate each row of data
for ((i=0; i<$LOG_RECORD_ROWS ; i++)); do
  employee_id=$(select_employee_id)
  datetime=$(generate_date)
  flagged=$(generate_flagged)
  attn_to=$(select_attn_to)
  note=$(generate_note)
  building_id=$(select_building_id)
  log_record_values+="('$employee_id', '$datetime', '$flagged', $attn_to, '$note', '$building_id'),"
done

# Remove the trailing comma
log_record_values=${log_record_values%,}

# Insert log records and get the ids created back
res=$(run_sql_script "
INSERT INTO log_records (
  employee_id, 
  datetime, 
  flagged, 
  attn_to, 
  note, 
  building_id
) 
VALUES $log_record_values
RETURNING log_id; 
")

log_record_ids=()

# Read each line of the output and extract log record IDs
while IFS= read -r line; do
  # Extract log record ID from the line
  log_record_id=$(echo "$line" | awk '{print $1}')
  # Skip if it's not a number
  if [[ $log_record_id =~ ^[0-9]+$ ]]; then
    # Append log record ID to the array
    log_record_ids+=("$log_record_id")
  fi
done <<< "$res"

# Store tag values needed to insert into junction table
tag_values=""

for log_record_id in "${log_record_ids[@]}"; do

  # Generate a random list of tag IDs (between 0 and 3)
  num_tags=$((RANDOM % 4))
  sub_tag_ids=()
  selected_tags=()

  # Randomly select unique tags from the array (keeping track of selected tags so there's no duplicates)
  while (( ${#sub_tag_ids[@]} < num_tags )); do
    random_index=$((RANDOM % number_of_tags))
    if [[ ! " ${selected_tags[@]} " =~ " $random_index " ]]; then
      sub_tag_ids+=("${tag_ids[random_index]}")
      selected_tags+=("$random_index")
    fi
  done

  # Construct SQL INSERT statements for bulk insert
  for sub_tag_id in "${sub_tag_ids[@]}"; do
    tag_values+="('$log_record_id', '$sub_tag_id'),"
  done
done

# Remove the trailing comma
tag_values=${tag_values%,}

# Insert into junction table if there's any generated tags
if [ -n "$tag_values" ]; then
  run_sql_script "
  INSERT INTO log_record_tag (
    log_record_id, 
    tag_id
  ) 
  VALUES $tag_values;"
fi

# Store resident values needed to insert into junction table
resident_values=""

for log_record_id in "${log_record_ids[@]}"; do

  # Generate a random list of resident IDs (between 1 and 3)
  num_residents=$((RANDOM % 3 + 1))
  sub_resident_ids=()
  selected_residents=()

  # Randomly select unique residents from the array (keeping track of selected residents so there's no duplicates)
  while (( ${#sub_resident_ids[@]} < num_residents )); do
    random_index=$((RANDOM % number_of_residents))
    if [[ ! " ${selected_residents[@]} " =~ " $random_index " ]]; then
      sub_resident_ids+=("${resident_ids[random_index]}")
      selected_residents+=("$random_index")
    fi
  done

  # Construct SQL INSERT statements for bulk insert
  for sub_resident_id in "${sub_resident_ids[@]}"; do
    resident_values+="('$log_record_id', '$sub_resident_id'),"
  done
done

# Remove the trailing comma
resident_values=${resident_values%,}

run_sql_script "
INSERT INTO log_record_residents (
  log_record_id, 
  resident_id
) 
VALUES $resident_values;"

echo "Log Record seeding complete"
