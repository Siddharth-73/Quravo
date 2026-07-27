CREATE TABLE IF NOT EXISTS "analytics_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"branch_id" uuid,
	"summary_date" date NOT NULL,
	"total_revenue" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"total_appointments" integer DEFAULT 0 NOT NULL,
	"total_walk_ins" integer DEFAULT 0 NOT NULL,
	"new_patients" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics_summaries" ADD CONSTRAINT "analytics_summaries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics_summaries" ADD CONSTRAINT "analytics_summaries_branch_id_clinic_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."clinic_branches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_date_idx" ON "analytics_summaries" USING btree ("tenant_id","branch_id","summary_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_date_query_idx" ON "analytics_summaries" USING btree ("tenant_id","summary_date");