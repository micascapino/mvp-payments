ALTER TABLE accounts ADD COLUMN client_id VARCHAR(255) NULL;

CREATE INDEX idx_accounts_client_id ON accounts(client_id);

ALTER TABLE accounts ADD CONSTRAINT fk_accounts_client_id FOREIGN KEY (client_id) 
  REFERENCES clients(client_id) ON DELETE SET NULL ON UPDATE CASCADE; 