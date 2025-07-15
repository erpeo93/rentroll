-- CreateTable
CREATE TABLE "ImprovementSubmission" (
    "id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImprovementSubmission_pkey" PRIMARY KEY ("id")
);
