-- Add status_tags column to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status_tags JSONB DEFAULT '[]';

-- Update existing clients with relevant status tags
UPDATE clients SET status_tags = '["Tax Planning", "Real Estate"]' WHERE name = 'Rahul Sharma';
UPDATE clients SET status_tags = '["SIP Active"]' WHERE name = 'Priya Mehta';
UPDATE clients SET status_tags = '["Needs Attention", "Retirement"]' WHERE name = 'Arjun Nair';
UPDATE clients SET status_tags = '["SIP Active", "Tax Planning"]' WHERE name = 'Sneha Iyer';
UPDATE clients SET status_tags = '["Tax Planning"]' WHERE name = 'Vikram Patel';

-- Verify the update
SELECT name, status_tags FROM clients;
