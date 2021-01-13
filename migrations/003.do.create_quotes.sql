CREATE TABLE "quotes" (
    "id" SERIAL PRIMARY KEY,
    "year" INT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "submodel" TEXT,
    "color" TEXT NOT NULL,
    "paintCondition" INT NOT NULL,
    "coverage" TEXT NOT NULL,
    "userId" INT REFERENCES "users"(id)
    ON DELETE CASCADE NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_num" TEXT NOT NULL
)