ALTER TABLE "payments" ADD COLUMN "gateway_provider" varchar(50);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "gateway_order_id" varchar(255);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gateway_order_idx" ON "payments" USING btree ("tenant_id","gateway_order_id");