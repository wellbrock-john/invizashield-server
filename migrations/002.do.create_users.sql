CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "phone_num" TEXT NOT NULL UNIQUE
);

ALTER TABLE "vehicles"
  ADD COLUMN
    "userId" INT REFERENCES "users"(id)
    ON DELETE CASCADE NOT NULL;