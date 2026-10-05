-- CreateEnum
CREATE TYPE "SlotKind" AS ENUM ('MONEY', 'LOVE', 'LUCK', 'SOUL', 'DREAM');

-- CreateEnum
CREATE TYPE "HoldStatus" AS ENUM ('active', 'consumed', 'canceled', 'expired');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "energy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneySlots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userText" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedReason" TEXT,

    CONSTRAINT "MoneySlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoveSlots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userText" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedReason" TEXT,

    CONSTRAINT "LoveSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LuckSlots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userText" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedReason" TEXT,

    CONSTRAINT "LuckSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoulSlots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userText" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedReason" TEXT,

    CONSTRAINT "SoulSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamSlots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userText" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedReason" TEXT,

    CONSTRAINT "DreamSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PasswordResetCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotHold" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "variant" "SlotKind" NOT NULL,
    "num" INTEGER NOT NULL,
    "status" "HoldStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userText" TEXT,
    "days" INTEGER NOT NULL,

    CONSTRAINT "SlotHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoneyLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoveLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoveLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LuckLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LuckLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoulLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoulLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DreamLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextBroadcast" TEXT NOT NULL,
    "prevBroadcast" TEXT NOT NULL,
    "weekTopic" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "MoneySlots_personalNum_idx" ON "MoneySlots"("personalNum");

-- CreateIndex
CREATE INDEX "MoneySlots_expiresAt_idx" ON "MoneySlots"("expiresAt");

-- CreateIndex
CREATE INDEX "MoneySlots_deletedAt_idx" ON "MoneySlots"("deletedAt");

-- CreateIndex
CREATE INDEX "LoveSlots_personalNum_idx" ON "LoveSlots"("personalNum");

-- CreateIndex
CREATE INDEX "LoveSlots_expiresAt_idx" ON "LoveSlots"("expiresAt");

-- CreateIndex
CREATE INDEX "LoveSlots_deletedAt_idx" ON "LoveSlots"("deletedAt");

-- CreateIndex
CREATE INDEX "LuckSlots_personalNum_idx" ON "LuckSlots"("personalNum");

-- CreateIndex
CREATE INDEX "LuckSlots_expiresAt_idx" ON "LuckSlots"("expiresAt");

-- CreateIndex
CREATE INDEX "LuckSlots_deletedAt_idx" ON "LuckSlots"("deletedAt");

-- CreateIndex
CREATE INDEX "SoulSlots_personalNum_idx" ON "SoulSlots"("personalNum");

-- CreateIndex
CREATE INDEX "SoulSlots_expiresAt_idx" ON "SoulSlots"("expiresAt");

-- CreateIndex
CREATE INDEX "SoulSlots_deletedAt_idx" ON "SoulSlots"("deletedAt");

-- CreateIndex
CREATE INDEX "DreamSlots_personalNum_idx" ON "DreamSlots"("personalNum");

-- CreateIndex
CREATE INDEX "DreamSlots_expiresAt_idx" ON "DreamSlots"("expiresAt");

-- CreateIndex
CREATE INDEX "DreamSlots_deletedAt_idx" ON "DreamSlots"("deletedAt");

-- CreateIndex
CREATE INDEX "PasswordResetCode_userId_idx" ON "PasswordResetCode"("userId");

-- CreateIndex
CREATE INDEX "SlotHold_expiresAt_idx" ON "SlotHold"("expiresAt");

-- CreateIndex
CREATE INDEX "SlotHold_userId_variant_status_idx" ON "SlotHold"("userId", "variant", "status");

-- CreateIndex
CREATE INDEX "SlotHold_orderId_idx" ON "SlotHold"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");

-- CreateIndex
CREATE INDEX "MoneyLike_slotId_idx" ON "MoneyLike"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyLike_userId_slotId_key" ON "MoneyLike"("userId", "slotId");

-- CreateIndex
CREATE INDEX "LoveLike_slotId_idx" ON "LoveLike"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "LoveLike_userId_slotId_key" ON "LoveLike"("userId", "slotId");

-- CreateIndex
CREATE INDEX "LuckLike_slotId_idx" ON "LuckLike"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "LuckLike_userId_slotId_key" ON "LuckLike"("userId", "slotId");

-- CreateIndex
CREATE INDEX "SoulLike_slotId_idx" ON "SoulLike"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "SoulLike_userId_slotId_key" ON "SoulLike"("userId", "slotId");

-- CreateIndex
CREATE INDEX "DreamLike_slotId_idx" ON "DreamLike"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "DreamLike_userId_slotId_key" ON "DreamLike"("userId", "slotId");

-- AddForeignKey
ALTER TABLE "MoneySlots" ADD CONSTRAINT "MoneySlots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoveSlots" ADD CONSTRAINT "LoveSlots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LuckSlots" ADD CONSTRAINT "LuckSlots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoulSlots" ADD CONSTRAINT "SoulSlots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamSlots" ADD CONSTRAINT "DreamSlots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetCode" ADD CONSTRAINT "PasswordResetCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotHold" ADD CONSTRAINT "SlotHold_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotHold" ADD CONSTRAINT "SlotHold_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyLike" ADD CONSTRAINT "MoneyLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyLike" ADD CONSTRAINT "MoneyLike_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MoneySlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoveLike" ADD CONSTRAINT "LoveLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoveLike" ADD CONSTRAINT "LoveLike_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "LoveSlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LuckLike" ADD CONSTRAINT "LuckLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LuckLike" ADD CONSTRAINT "LuckLike_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "LuckSlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoulLike" ADD CONSTRAINT "SoulLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoulLike" ADD CONSTRAINT "SoulLike_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "SoulSlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamLike" ADD CONSTRAINT "DreamLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamLike" ADD CONSTRAINT "DreamLike_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "DreamSlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
