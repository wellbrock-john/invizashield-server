CREATE TABLE "vehicles" (
    "id" SERIAL PRIMARY KEY,
    "year" INT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "submodel" TEXT,
    "color" TEXT NOT NULL,
    "paintCondition" INT NOT NULL,
    "coverage" TEXT NOT NULL
);