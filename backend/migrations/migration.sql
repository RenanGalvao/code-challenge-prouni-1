-- Create Tasks Table
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" INTEGER PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT
);

-- Auto update updatedAt
CREATE TRIGGER IF NOT EXISTS "tasks_updated_at" BEFORE
UPDATE
    ON "tasks" FOR EACH ROW BEGIN
UPDATE
    "tasks"
SET
    "updatedAt" = datetime("now");
END;