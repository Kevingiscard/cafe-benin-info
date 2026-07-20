-- ============================================
-- Café Bénin v2.0 — Setup Supabase SQL
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- Table Commentaires
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  section TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  related_id INT,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Encyclopédie
CREATE TABLE IF NOT EXISTS encyclopedia (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Dictionnaire
CREATE TABLE IF NOT EXISTS dictionary (
  id BIGSERIAL PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  origin TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_encyclopedia_category ON encyclopedia(category);
CREATE INDEX IF NOT EXISTS idx_dictionary_term ON dictionary(term);

-- RLS: lecture publique des commentaires approuvés
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Commentaires approuvés lisibles" ON comments
  FOR SELECT USING (approved = true);
CREATE POLICY "Insertion publique" ON comments
  FOR INSERT WITH CHECK (true);

-- RLS: lecture publique encyclopédie et dictionnaire
ALTER TABLE encyclopedia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Encyclopédie publique" ON encyclopedia FOR SELECT USING (true);

ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dictionnaire public" ON dictionary FOR SELECT USING (true);
