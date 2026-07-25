-- Migration: Convert legacy 24-character ObjectIDs to proper 36-character UUIDs and enforce the UUID type.
-- This script safely pads 24-char hex strings into valid UUIDs so you don't lose any data!
-- (e.g. "123456789012345678901234" becomes "00000000-1234-5678-9012-345678901234")

-- 1. Alter societies table
ALTER TABLE societies ALTER COLUMN id TYPE UUID USING (
  CASE 
    WHEN length(id) = 24 THEN 
      ('00000000-' || substr(id, 1, 4) || '-' || substr(id, 5, 4) || '-' || substr(id, 9, 4) || '-' || substr(id, 13, 12))::uuid
    ELSE 
      id::uuid 
  END
);
ALTER TABLE societies ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Alter users table
ALTER TABLE users ALTER COLUMN id TYPE UUID USING (
  CASE 
    WHEN length(id) = 24 THEN 
      ('00000000-' || substr(id, 1, 4) || '-' || substr(id, 5, 4) || '-' || substr(id, 9, 4) || '-' || substr(id, 13, 12))::uuid
    ELSE 
      id::uuid 
  END
);
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Alter cart_items table
ALTER TABLE cart_items ALTER COLUMN user_id TYPE UUID USING (
  CASE 
    WHEN length(user_id) = 24 THEN 
      ('00000000-' || substr(user_id, 1, 4) || '-' || substr(user_id, 5, 4) || '-' || substr(user_id, 9, 4) || '-' || substr(user_id, 13, 12))::uuid
    ELSE 
      user_id::uuid 
  END
);

ALTER TABLE cart_items ALTER COLUMN soc_id TYPE UUID USING (
  CASE 
    WHEN length(soc_id) = 24 THEN 
      ('00000000-' || substr(soc_id, 1, 4) || '-' || substr(soc_id, 5, 4) || '-' || substr(soc_id, 9, 4) || '-' || substr(soc_id, 13, 12))::uuid
    ELSE 
      soc_id::uuid 
  END
);

-- 4. Alter orientations table
ALTER TABLE orientations ALTER COLUMN id TYPE UUID USING (
  CASE 
    WHEN length(id) = 24 THEN 
      ('00000000-' || substr(id, 1, 4) || '-' || substr(id, 5, 4) || '-' || substr(id, 9, 4) || '-' || substr(id, 13, 12))::uuid
    ELSE 
      id::uuid 
  END
);
ALTER TABLE orientations ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE orientations ALTER COLUMN soc_id TYPE UUID USING (
  CASE 
    WHEN length(soc_id) = 24 THEN 
      ('00000000-' || substr(soc_id, 1, 4) || '-' || substr(soc_id, 5, 4) || '-' || substr(soc_id, 9, 4) || '-' || substr(soc_id, 13, 12))::uuid
    ELSE 
      soc_id::uuid 
  END
);
