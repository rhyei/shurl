CREATE SEQUENCE "public"."guest_urls_id_seq" INCREMENT BY 100000 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "guest_urls" (
	"id" varchar(6) PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL
);
