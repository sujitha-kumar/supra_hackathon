-- FundsIndia RM Copilot - Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  risk_profile TEXT,
  goals JSONB,
  last_contacted TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  fund_name TEXT NOT NULL,
  category TEXT,
  invested_amount NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  sip_amount NUMERIC DEFAULT 0,
  sip_date INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  question TEXT,
  answer TEXT,
  language TEXT DEFAULT 'english',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Insert sample clients (matching the screenshots)
INSERT INTO clients (name, phone, email, risk_profile, goals, last_contacted) VALUES
('Rahul Sharma', '+91-9876543210', 'rahul.sharma@email.com', 'Aggressive', '["Retirement 2035", "Child Education 2028"]', NOW() - INTERVAL '45 days'),
('Priya Mehta', '+91-9876543211', 'priya.mehta@email.com', 'Moderate', '["Home Purchase", "Wealth Creation"]', NOW() - INTERVAL '10 days'),
('Arjun Nair', '+91-9876543212', 'arjun.nair@email.com', 'Conservative', '["Retirement", "Emergency Fund"]', NOW() - INTERVAL '60 days'),
('Sneha Iyer', '+91-9876543213', 'sneha.iyer@email.com', 'Moderate', '["Child Education", "Vacation Fund"]', NOW() - INTERVAL '5 days'),
('Vikram Patel', '+91-9876543214', 'vikram.patel@email.com', 'Aggressive', '["Wealth Creation", "Early Retirement"]', NOW() - INTERVAL '2 days');

-- 6. Insert sample portfolios for Rahul Sharma
INSERT INTO portfolios (client_id, fund_name, category, invested_amount, current_value, sip_amount, sip_date)
SELECT id, 'HDFC Mid Cap Opportunities', 'Mid Cap', 50000, 48000, 5000, 5 FROM clients WHERE name = 'Rahul Sharma'
UNION ALL
SELECT id, 'SBI Bluechip Fund', 'Large Cap', 38000, 37000, 3000, 10 FROM clients WHERE name = 'Rahul Sharma';

-- 7. Insert sample portfolios for Priya Mehta
INSERT INTO portfolios (client_id, fund_name, category, invested_amount, current_value, sip_amount, sip_date)
SELECT id, 'ICICI Prudential Balanced Advantage', 'Hybrid', 60000, 64800, 0, NULL FROM clients WHERE name = 'Priya Mehta'
UNION ALL
SELECT id, 'Axis Bluechip Fund', 'Large Cap', 40000, 43200, 4000, 15 FROM clients WHERE name = 'Priya Mehta';

-- 8. Insert sample portfolios for Arjun Nair
INSERT INTO portfolios (client_id, fund_name, category, invested_amount, current_value, sip_amount, sip_date)
SELECT id, 'HDFC Liquid Fund', 'Liquid', 50000, 50750, 0, NULL FROM clients WHERE name = 'Arjun Nair'
UNION ALL
SELECT id, 'SBI Magnum Gilt Fund', 'Debt', 25000, 24575, 0, NULL FROM clients WHERE name = 'Arjun Nair';

-- 9. Insert sample portfolios for Sneha Iyer
INSERT INTO portfolios (client_id, fund_name, category, invested_amount, current_value, sip_amount, sip_date)
SELECT id, 'Mirae Asset Large Cap Fund', 'Large Cap', 30000, 31990, 3000, 20 FROM clients WHERE name = 'Sneha Iyer'
UNION ALL
SELECT id, 'Parag Parikh Flexi Cap', 'Flexi Cap', 18000, 19584, 2000, 25 FROM clients WHERE name = 'Sneha Iyer';

-- 10. Insert sample portfolios for Vikram Patel
INSERT INTO portfolios (client_id, fund_name, category, invested_amount, current_value, sip_amount, sip_date)
SELECT id, 'Axis Small Cap Fund', 'Small Cap', 150000, 183750, 10000, 1 FROM clients WHERE name = 'Vikram Patel'
UNION ALL
SELECT id, 'Kotak Emerging Equity', 'Mid Cap', 50000, 61500, 5000, 5 FROM clients WHERE name = 'Vikram Patel';

-- 11. Insert sample activities for Rahul Sharma
INSERT INTO activities (client_id, type, description)
SELECT id, 'call', 'Discussed SIP performance and market volatility' FROM clients WHERE name = 'Rahul Sharma'
UNION ALL
SELECT id, 'email', 'Sent portfolio review report' FROM clients WHERE name = 'Rahul Sharma'
UNION ALL
SELECT id, 'sip_missed', 'SIP payment missed for HDFC Mid Cap' FROM clients WHERE name = 'Rahul Sharma';

-- 12. Insert sample activities for other clients
INSERT INTO activities (client_id, type, description)
SELECT id, 'call', 'Portfolio review completed' FROM clients WHERE name = 'Priya Mehta'
UNION ALL
SELECT id, 'call', 'Discussed goal planning' FROM clients WHERE name = 'Arjun Nair'
UNION ALL
SELECT id, 'email', 'Sent quarterly statement' FROM clients WHERE name = 'Sneha Iyer'
UNION ALL
SELECT id, 'call', 'New SIP setup completed' FROM clients WHERE name = 'Vikram Patel';

-- Done! Your database is now set up with sample data.
-- You can now test the RM Copilot app with these 5 clients.
