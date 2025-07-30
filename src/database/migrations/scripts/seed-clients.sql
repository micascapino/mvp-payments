-- Insert default admin client
INSERT INTO clients (client_id, hashed_secret, role, is_active) VALUES 
  ('admin-client', crypt('admin-secret-key', gen_salt('bf')), 'admin', true)
ON CONFLICT (client_id) DO NOTHING; 