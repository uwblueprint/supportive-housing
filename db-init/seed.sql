-- Seed log records table
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
  1,
  (ARRAY['John','Jerry','James','Jack'])[floor(random() * 4 + 1)], 
  (ARRAY['Doe','Show','Flow','Mow'])[floor(random() * 4 + 1)], 
  NOW() + (random() * (NOW()+'90 days' - NOW())) + '30 days', 
  (ARRAY[true,false])[floor(random() * 2 + 1)], 
  1, 
  (ARRAY['Amazing note','This is a note','Bad note','Decent Note','Cool note'])[floor(random() * 5 + 1)], 
  ARRAY['tag1', 'tag2'], 
  (ARRAY['Building A','Building B','Building C'])[floor(random() * 3 + 1)]

FROM generate_series(1, 50); -- Change this to get a different amount of rows