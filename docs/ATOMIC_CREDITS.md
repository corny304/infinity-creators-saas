# Atomic Credit Deduction System

## Overview

The credit deduction system in Infinity Creators uses **atomic database operations** to prevent race conditions when multiple concurrent requests attempt to deduct credits from the same user account.

## The Problem: Race Conditions

Without atomic operations, the following race condition can occur:

```
Time  Request A                    Request B
----  -------------------------    -------------------------
T1    Read user credits: 1         
T2                                 Read user credits: 1
T3    Check: 1 >= 1 ✓             
T4                                 Check: 1 >= 1 ✓
T5    Update credits: 1 - 1 = 0   
T6                                 Update credits: 1 - 1 = 0
T7    Final balance: 0             Final balance: 0
```

**Result:** User generated 2 scripts but only paid 1 credit! ❌

## The Solution: Atomic SQL UPDATE

We use a single SQL UPDATE statement that checks AND updates in one atomic operation:

```sql
UPDATE users 
SET credits = credits + (-1) 
WHERE id = ? AND credits >= 1
```

This operation is **atomic** at the database level - either it succeeds completely or fails completely, with no intermediate state visible to other transactions.

### How It Works

1. **Single Operation:** The database locks the row, checks the condition, updates if valid, and releases the lock - all in one atomic operation
2. **Affected Rows Check:** We check `affectedRows` to determine if the update succeeded
   - `affectedRows === 1`: Update succeeded, user had sufficient credits
   - `affectedRows === 0`: Update failed, either user doesn't exist or insufficient credits
3. **Error Handling:** If `affectedRows === 0`, we query the user to determine the specific error

### Code Implementation

```typescript
// For deductions (usage), use atomic UPDATE with credit check
if (amount < 0) {
  const requiredCredits = Math.abs(amount);
  
  // ATOMIC: Single SQL UPDATE that checks AND updates in one operation
  const result = await db.update(users)
    .set({ credits: sql`credits + ${amount}` })
    .where(and(
      eq(users.id, userId),
      gte(users.credits, requiredCredits)
    ));

  // Check if update succeeded
  const affectedRows = Array.isArray(result) 
    ? result[0]?.affectedRows 
    : (result as any).affectedRows;
    
  if (!result || affectedRows === 0) {
    // Get user to determine specific error
    const user = await db.select().from(users)
      .where(eq(users.id, userId)).limit(1);
      
    if (!user || user.length === 0) {
      throw new Error('User not found');
    }
    throw new Error(`OUT_OF_CREDITS: User has ${user[0].credits} credits but needs ${requiredCredits}`);
  }

  // Success - log transaction
  // ...
}
```

## Concurrent Request Handling

With atomic operations, concurrent requests are handled correctly:

```
Time  Request A                    Request B
----  -------------------------    -------------------------
T1    Atomic UPDATE (lock row)     
T2                                 Wait for lock...
T3    Check: 1 >= 1 ✓             
T4    Update: credits = 0          
T5    Release lock                 
T6    affectedRows = 1 ✓          Atomic UPDATE (lock row)
T7                                 Check: 0 >= 1 ✗
T8                                 No update performed
T9                                 Release lock
T10                                affectedRows = 0 ✗
T11                                Throw OUT_OF_CREDITS
```

**Result:** Request A succeeds, Request B fails with OUT_OF_CREDITS error ✅

## Testing

The atomic credit deduction system is tested with concurrent requests to verify:

1. **Single Deduction:** Only one request succeeds when multiple requests compete for the last credit
2. **No Negative Balance:** Credits never go below zero
3. **Correct Error Messages:** OUT_OF_CREDITS error is thrown when insufficient credits
4. **Transaction Logging:** All successful deductions are logged in `credits_transactions` table

See `server/tests/atomic-credits.test.ts` for test implementation.

## Performance Considerations

**Advantages:**
- **No Race Conditions:** Database-level atomicity guarantees correctness
- **Single Query:** Only one UPDATE statement, no SELECT-then-UPDATE pattern
- **Row-Level Locking:** Only locks the specific user row, not the entire table

**Trade-offs:**
- **Lock Contention:** If the same user makes many concurrent requests, they will queue
- **Retry Logic:** Clients should implement retry logic for OUT_OF_CREDITS errors in case of transient failures

## Database Support

This implementation uses standard SQL features supported by:
- ✅ MySQL 5.7+
- ✅ MariaDB 10.2+
- ✅ PostgreSQL 9.5+
- ✅ TiDB (MySQL-compatible)

## Related Files

- `server/db.ts` - `updateUserCredits()` function implementation
- `server/routers/generation.ts` - Credit deduction in script generation
- `server/tests/atomic-credits.test.ts` - Atomic credit tests
- `drizzle/schema.ts` - Database schema definitions

## References

- [MySQL UPDATE Documentation](https://dev.mysql.com/doc/refman/8.0/en/update.html)
- [Database Transactions](https://en.wikipedia.org/wiki/Database_transaction)
- [ACID Properties](https://en.wikipedia.org/wiki/ACID)
