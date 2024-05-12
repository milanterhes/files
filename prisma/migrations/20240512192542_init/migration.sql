-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "listedPrice" INTEGER,
    "discount" INTEGER,
    "nettoPrice" INTEGER,
    "currency" TEXT,
    "packageSize" INTEGER,
    "unit" TEXT,
    "unitPrice" INTEGER,
    "unitName" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
