BEGIN;

TRUNCATE
  "quotes",
  "vehicles",
  "users";

INSERT INTO "users" ("id", "email", "phone_num", "first_name", "last_name", "password")
VALUES
  (1,
    'admin@admin.com',
    '(513)-833-4196',
    'John',
    'The Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "vehicles" ("id", "year", "make", "model", "submodel", "color", "paintCondition", "coverage", "userId")
VALUES
  (1, 2010, 'Ford', 'Focus', 'SE', 'Blue', '3', 'Partial Front', 1),
  (2, 2019, 'Honda', 'CRV', null, 'Silver', '7', 'Danger Zone. No Coverage.', 1),
  (3, 2021, 'Porsche', '911', 'Turbo S Touring', 'Slate Grey', '10', 'Full Body', 1);

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('vehicles_id_seq', (SELECT MAX(id) from "vehicles"));
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));

COMMIT;

