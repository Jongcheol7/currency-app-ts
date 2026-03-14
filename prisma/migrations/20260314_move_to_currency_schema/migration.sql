-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "currency";

-- Move all tables from public to currency schema
ALTER TABLE "public"."user" SET SCHEMA "currency";
ALTER TABLE "public"."userSettings" SET SCHEMA "currency";
ALTER TABLE "public"."trip" SET SCHEMA "currency";
ALTER TABLE "public"."expense" SET SCHEMA "currency";
ALTER TABLE "public"."account" SET SCHEMA "currency";
ALTER TABLE "public"."session" SET SCHEMA "currency";
ALTER TABLE "public"."verificationToken" SET SCHEMA "currency";
ALTER TABLE "public"."currentRate" SET SCHEMA "currency";
ALTER TABLE "public"."exchangeRate" SET SCHEMA "currency";
