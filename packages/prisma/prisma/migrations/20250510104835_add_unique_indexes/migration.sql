/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `CommunityToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommunityToken_groupId_key" ON "CommunityToken"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_userId_key" ON "UserToken"("userId");
