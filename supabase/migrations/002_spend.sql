-- 002_spend.sql: Spend & Services Dashboard tables

CREATE TABLE spend_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  category TEXT NOT NULL, -- 'ai_llm' | 'infrastructure'
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  charged_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE spend_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON spend_transactions FOR SELECT USING (true);
CREATE POLICY "Service insert" ON spend_transactions FOR INSERT WITH CHECK (true);
CREATE INDEX idx_spend_charged_at ON spend_transactions(charged_at DESC);

CREATE TABLE service_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  monthly_cost NUMERIC(10,2),
  billing_type TEXT NOT NULL, -- 'subscription' | 'usage' | 'credits'
  billing_day INTEGER, -- day of month it bills
  next_billing_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE service_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON service_subscriptions FOR SELECT USING (true);
CREATE POLICY "Service insert" ON service_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update" ON service_subscriptions FOR UPDATE USING (true);

INSERT INTO service_subscriptions (service, category, monthly_cost, billing_type, billing_day, notes) VALUES
('Anthropic Claude API', 'ai_llm', 475.00, 'usage', null, '~$95/charge, ~5x/mo'),
('OpenRouter', 'ai_llm', 158.94, 'usage', null, '$26.49/top-up, ~6x/mo'),
('OpenAI API', 'ai_llm', 120.00, 'usage', null, 'Variable top-ups ~$120/mo'),
('Higgsfield', 'ai_llm', 59.00, 'credits', 8, '$59/mo credit top-up'),
('ElevenLabs', 'ai_llm', 22.00, 'subscription', 23, null),
('Midjourney', 'ai_llm', 10.00, 'subscription', 1, null),
('KIE.ai', 'ai_llm', null, 'credits', null, '$5/top-up, credit-based'),
('AWS', 'infrastructure', 252.67, 'subscription', 1, null),
('Vercel', 'infrastructure', 60.00, 'subscription', 6, null),
('Supabase (Tremendous)', 'infrastructure', 25.00, 'subscription', 13, null),
('Supabase (KINCE)', 'infrastructure', 35.00, 'subscription', 9, null),
('Render.com', 'infrastructure', 7.00, 'subscription', 4, null),
('Notion', 'infrastructure', 24.00, 'subscription', 30, null),
('Twilio', 'infrastructure', 5.00, 'usage', null, 'Pay-as-you-go · 2 phone numbers: (844) 523-2760 & (786) 998-5740');
