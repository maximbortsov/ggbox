-- CreateTable
CREATE TABLE "Agreement"
(
    "id"         UUID          NOT NULL,
    "email"      VARCHAR(256)  NOT NULL,
    "fullName"   VARCHAR(1000) NOT NULL,
    "twitchLink" VARCHAR(512)  NOT NULL,
    "updatedAt"  TIMESTAMP(3)  NOT NULL,
    "createdAt"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game"
(
    "id"   UUID         NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "logo" VARCHAR(512),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag"
(
    "id"   UUID        NOT NULL,
    "name" VARCHAR(64) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User"
(
    "id"               UUID         NOT NULL,
    "roles"            TEXT[],
    "username"         VARCHAR(128) NOT NULL,
    "email"            VARCHAR(256) NOT NULL,
    "password"         VARCHAR(60)  NOT NULL,
    "isEmailConfirmed" BOOLEAN      NOT NULL DEFAULT false,
    "avatar"           VARCHAR(512),
    "flowWallet"       VARCHAR(64),
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment"
(
    "id"        UUID             NOT NULL,
    "amount"    DOUBLE PRECISION NOT NULL,
    "status"    VARCHAR(128)     NOT NULL,
    "updatedAt" TIMESTAMP(3)     NOT NULL,
    "createdAt" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"    UUID             NOT NULL,
    "boxId"     UUID,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentToken"
(
    "id"        UUID         NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"    UUID         NOT NULL,
    "boxId"     UUID,

    CONSTRAINT "PaymentToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal"
(
    "id"        UUID             NOT NULL,
    "amount"    DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3)     NOT NULL,
    "createdAt" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status"    VARCHAR(128)     NOT NULL,
    "userId"    UUID             NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streamer"
(
    "id"         UUID         NOT NULL,
    "desc"       VARCHAR(256),
    "name"       VARCHAR(256) NOT NULL,
    "twitchLink" VARCHAR(512),
    "userId"     UUID         NOT NULL,

    CONSTRAINT "Streamer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Box"
(
    "id"              UUID             NOT NULL,
    "name"            VARCHAR(256)     NOT NULL,
    "size"            INTEGER          NOT NULL,
    "total"           INTEGER          NOT NULL,
    "inStock"         INTEGER          NOT NULL,
    "price"           DOUBLE PRECISION NOT NULL,
    "desc"            VARCHAR(256)     NOT NULL,
    "thumbnail"       VARCHAR(512)     NOT NULL,
    "openVideo"       VARCHAR(512)     NOT NULL,
    "openMobileVideo" VARCHAR(512)     NOT NULL,
    "startSaleAt"     TIMESTAMP(3)     NOT NULL,
    "endSaleAt"       TIMESTAMP(3)     NOT NULL,
    "createdAt"       TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoxToken"
(
    "id"        UUID         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID"    UUID         NOT NULL,
    "boxID"     UUID         NOT NULL,

    CONSTRAINT "BoxToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Play"
(
    "id"            UUID         NOT NULL,
    "name"          VARCHAR(256) NOT NULL,
    "desc"          VARCHAR(512) NOT NULL,
    "cid"           VARCHAR(512) NOT NULL,
    "metadata"      JSONB        NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL,
    "flowId"        VARCHAR(21)  NOT NULL,
    "transactionId" VARCHAR(64)  NOT NULL,
    "gameId"        UUID         NOT NULL,
    "streamerId"    UUID,

    CONSTRAINT "Play_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set"
(
    "id"                 UUID         NOT NULL,
    "flowId"             VARCHAR(20)  NOT NULL,
    "transactionId"      VARCHAR(64)  NOT NULL,
    "name"               VARCHAR(256) NOT NULL,
    "setPlaysInEditions" JSONB        NOT NULL DEFAULT '{}',
    "createdAt"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edition"
(
    "id"            UUID         NOT NULL,
    "flowId"        VARCHAR(20)  NOT NULL,
    "flowSetId"     VARCHAR(20)  NOT NULL,
    "flowPlayId"    VARCHAR(20)  NOT NULL,
    "transactionId" VARCHAR(64)  NOT NULL,
    "name"          VARCHAR(256) NOT NULL,
    "rarity"        VARCHAR(256) NOT NULL,
    "maxMintSize"   VARCHAR(20),
    "createdAt"     TIMESTAMP(3) NOT NULL,
    "setID"         UUID         NOT NULL,
    "playId"        UUID         NOT NULL,

    CONSTRAINT "Edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nft"
(
    "id"            UUID         NOT NULL,
    "flowID"        VARCHAR(20)  NOT NULL,
    "flowEditionID" VARCHAR(20)  NOT NULL,
    "serialNumber"  VARCHAR(20)  NOT NULL,
    "mintingDate"   TIMESTAMP(3) NOT NULL,
    "metadata"      JSONB        NOT NULL,
    "transactionID" VARCHAR(64)  NOT NULL,
    "ownerID"       UUID,
    "editionID"     UUID         NOT NULL,
    "boxID"         UUID,
    "boxTokenID"    UUID,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot"
(
    "id"                    UUID           NOT NULL,
    "price"                 DECIMAL(20, 8) NOT NULL,
    "soldAt"                TIMESTAMP(3),
    "updatedAt"             TIMESTAMP(3)   NOT NULL,
    "createdAt"             TIMESTAMP(3)   NOT NULL,
    "flowNftId"             DECIMAL(20, 0) NOT NULL,
    "transactionID"         VARCHAR(64)    NOT NULL,
    "purchaseTransactionID" VARCHAR(64),
    "nftId"                 UUID           NOT NULL,
    "buyerId"               UUID,
    "sellerId"              UUID           NOT NULL,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoxToTag"
(
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayToSet"
(
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayToTag"
(
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_flowWallet_key" ON "User" ("flowWallet");

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_name_key" ON "Streamer" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Play_flowId_key" ON "Play" ("flowId");

-- CreateIndex
CREATE UNIQUE INDEX "Set_flowId_key" ON "Set" ("flowId");

-- CreateIndex
CREATE UNIQUE INDEX "Set_name_key" ON "Set" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Edition_flowId_key" ON "Edition" ("flowId");

-- CreateIndex
CREATE UNIQUE INDEX "Nft_flowID_key" ON "Nft" ("flowID");

-- CreateIndex
CREATE UNIQUE INDEX "_BoxToTag_AB_unique" ON "_BoxToTag" ("A", "B");

-- CreateIndex
CREATE INDEX "_BoxToTag_B_index" ON "_BoxToTag" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayToSet_AB_unique" ON "_PlayToSet" ("A", "B");

-- CreateIndex
CREATE INDEX "_PlayToSet_B_index" ON "_PlayToSet" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayToTag_AB_unique" ON "_PlayToTag" ("A", "B");

-- CreateIndex
CREATE INDEX "_PlayToTag_B_index" ON "_PlayToTag" ("B");

-- AddForeignKey
ALTER TABLE "Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD CONSTRAINT "Payment_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentToken"
    ADD CONSTRAINT "PaymentToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentToken"
    ADD CONSTRAINT "PaymentToken_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal"
    ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streamer"
    ADD CONSTRAINT "Streamer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxToken"
    ADD CONSTRAINT "BoxToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxToken"
    ADD CONSTRAINT "BoxToken_boxID_fkey" FOREIGN KEY ("boxID") REFERENCES "Box" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play"
    ADD CONSTRAINT "Play_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play"
    ADD CONSTRAINT "Play_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edition"
    ADD CONSTRAINT "Edition_playId_fkey" FOREIGN KEY ("playId") REFERENCES "Play" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edition"
    ADD CONSTRAINT "Edition_setID_fkey" FOREIGN KEY ("setID") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft"
    ADD CONSTRAINT "Nft_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft"
    ADD CONSTRAINT "Nft_boxID_fkey" FOREIGN KEY ("boxID") REFERENCES "Box" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft"
    ADD CONSTRAINT "Nft_boxTokenID_fkey" FOREIGN KEY ("boxTokenID") REFERENCES "BoxToken" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft"
    ADD CONSTRAINT "Nft_editionID_fkey" FOREIGN KEY ("editionID") REFERENCES "Edition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot"
    ADD CONSTRAINT "Lot_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot"
    ADD CONSTRAINT "Lot_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot"
    ADD CONSTRAINT "Lot_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxToTag"
    ADD FOREIGN KEY ("A") REFERENCES "Box" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxToTag"
    ADD FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayToSet"
    ADD FOREIGN KEY ("A") REFERENCES "Play" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayToSet"
    ADD FOREIGN KEY ("B") REFERENCES "Set" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayToTag"
    ADD FOREIGN KEY ("A") REFERENCES "Play" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayToTag"
    ADD FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
