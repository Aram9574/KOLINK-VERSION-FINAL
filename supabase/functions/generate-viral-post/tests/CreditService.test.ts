import { assertEquals, assertRejects } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.168.0/testing/bdd.ts";
import { CreditService } from "../services/CreditService.ts";

// Mock Supabase Client Types
interface MockSupabaseClient {
    from: (table: string) => any;
    rpc: (fn: string, params: any) => Promise<any>;
}

describe("CreditService", () => {
    // Mock Admin Client
    const mockAdminClient = (credits: number | null, error: any = null) => ({
        from: (table: string) => ({
            select: (cols: string) => ({
                eq: (col: string, val: string) => ({
                    single: async () => ({
                        data: credits !== null ? { credits } : null,
                        error
                    })
                })
            })
        }),
        rpc: async () => ({}) // Not used in checkBalance
    }) as unknown as any;

    // Mock User Client
    const mockUserClient = (error: any = null) => ({
        rpc: async (fn: string, params: any) => ({
            data: null,
            error
        })
    }) as unknown as any;

    it("should return true when user has credits", async () => {
        const admin = mockAdminClient(10);
        const user = mockUserClient();
        const service = new CreditService(admin, user);

        const hasBalance = await service.checkBalance("user-123");
        assertEquals(hasBalance, true);
    });

    it("should return false when user has 0 credits", async () => {
        const admin = mockAdminClient(0);
        const user = mockUserClient();
        const service = new CreditService(admin, user);

        const hasBalance = await service.checkBalance("user-123");
        assertEquals(hasBalance, false);
    });

    it("should throw error if profile not found", async () => {
        const admin = mockAdminClient(null, { message: "Not found" });
        const user = mockUserClient();
        const service = new CreditService(admin, user);

        await assertRejects(
            () => service.checkBalance("user-123"),
            Error,
            "Profile not found"
        );
    });

    it("should deduct credit successfully", async () => {
        const admin = mockAdminClient(10);
        const user = mockUserClient(null); // No error
        const service = new CreditService(admin, user);

        await service.deductCredit("user-123");
        // If no error thrown, test passes
    });

    it("should throw error if deduction fails", async () => {
        const admin = mockAdminClient(10);
        const user = mockUserClient({ message: "RPC Error" });
        const service = new CreditService(admin, user);

        await assertRejects(
            () => service.deductCredit("user-123"),
            Error,
            "Failed to deduct credit"
        );
    });
});
