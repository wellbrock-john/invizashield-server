CREATE TABLE "quotes" (
    "id" INT REFERENCES "vehicles"(id)
    ON DELETE CASCADE NOT NULL,
    "year" INT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "submodel" TEXT,
    "color" TEXT NOT NULL,
    "paintCondition" INT NOT NULL,
    "coverage" TEXT NOT NULL,
    "userId" INT REFERENCES "users"(id)
    ON DELETE CASCADE NOT NULL
)