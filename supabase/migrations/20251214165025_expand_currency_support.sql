/*
  # Expand Currency Support

  1. Changes
    - Drop existing currency constraint
    - Add new constraint supporting AED and other regional currencies

  2. New Supported Currencies
    - CAD (Canadian Dollar)
    - USD (US Dollar)
    - GBP (British Pound)
    - EUR (Euro)
    - AUD (Australian Dollar)
    - AED (UAE Dirham)
*/

-- Drop existing constraint
ALTER TABLE document_generators 
DROP CONSTRAINT IF EXISTS document_generators_currency_check;

-- Add new constraint with expanded currency list
ALTER TABLE document_generators
ADD CONSTRAINT document_generators_currency_check 
CHECK (currency IN ('CAD', 'USD', 'GBP', 'EUR', 'AUD', 'AED'));