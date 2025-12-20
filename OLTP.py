import time
import random
import statistics
import mysql.connector

DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "tradaotranchauden",
    "database": "VinUniCircularMarket",
    "port": 3306,
}

# --- Representative OLTP queries / procedures ---
Q_BROWSE = """
SELECT l.listing_id, l.title, l.list_price, l.created_at
FROM `Listing` l
WHERE l.status = 'available' AND l.category_id = %s
ORDER BY l.created_at DESC
LIMIT 20;
"""

Q_SELLER_LISTINGS = """
SELECT l.listing_id, l.title, l.status, l.created_at
FROM `Listing` l
WHERE l.seller_id = %s
ORDER BY l.created_at DESC
LIMIT 20;
"""

Q_COMMENTS = """
SELECT c.comment_id, c.user_id, c.created_at, c.parent_id, c.content
FROM `Comment` c
WHERE c.listing_id = %s
ORDER BY c.created_at DESC
LIMIT 30;
"""

# stored procedures (you already have these)
SP_CONFIRM = "CALL sp_confirm_order(%s);"
SP_CANCEL  = "CALL sp_cancel_order(%s);"
SP_REJECT  = "CALL sp_reject_order(%s);"
SP_COMPLETE = "CALL sp_complete_order(%s);"

def time_one(cursor, sql, params=None, fetch=False):
    t0 = time.perf_counter()
    cursor.execute(sql, params or ())
    if fetch:
        cursor.fetchall()
    t1 = time.perf_counter()
    return (t1 - t0) * 1000.0  # ms

def percentile(xs, p):
    xs = sorted(xs)
    k = int(round((p/100.0) * (len(xs)-1)))
    return xs[k]

def main(iters=500):
    conn = mysql.connector.connect(**DB_CONFIG)
    conn.autocommit = True
    cur = conn.cursor()

    # pick some existing ids (adjust table/column names if needed)
    cur.execute("SELECT category_id FROM `Category` ORDER BY category_id;")
    categories = [r[0] for r in cur.fetchall()] or [1]

    cur.execute("SELECT user_id FROM `User` ORDER BY user_id;")
    users = [r[0] for r in cur.fetchall()] or [1]

    cur.execute("SELECT listing_id FROM `Listing` ORDER BY listing_id;")
    listings = [r[0] for r in cur.fetchall()] or [1]

    # orders that can be used in procedures (best effort)
    cur.execute("SELECT order_id, status FROM `Order` ORDER BY order_id;")
    orders = cur.fetchall()

    lat = {"browse": [], "seller": [], "comments": [], "sp": []}
    errors = 0

    success_ops = 0
    t_start = time.perf_counter()

    for _ in range(iters):
        r = random.random()

        try:
            if r < 0.70:
                cat = random.choice(categories)
                ms = time_one(cur, Q_BROWSE, (cat,), fetch=True)
                lat["browse"].append(ms)
                success_ops += 1

            elif r < 0.80:
                uid = random.choice(users)
                ms = time_one(cur, Q_SELLER_LISTINGS, (uid,), fetch=True)
                lat["seller"].append(ms)
                success_ops += 1

            elif r < 0.90:
                lid = random.choice(listings)
                ms = time_one(cur, Q_COMMENTS, (lid,), fetch=True)
                lat["comments"].append(ms)
                success_ops += 1

            else:
                if not orders:
                    continue
                oid, st = random.choice(orders)

                if st == "requested":
                    sp = random.choice([SP_CONFIRM, SP_CANCEL, SP_REJECT])
                elif st == "confirmed":
                    sp = SP_COMPLETE
                else:
                    sp = random.choice([SP_CANCEL, SP_REJECT])

                ms = time_one(cur, sp, (oid,), fetch=False)
                lat["sp"].append(ms)
                success_ops += 1


        except Exception:
            errors += 1
            # continue workload even if a procedure signals conflict

    t_end = time.perf_counter()
    total_runtime_s = t_end - t_start
    throughput_ops = success_ops / total_runtime_s if total_runtime_s > 0 else 0.0

    def summarize(name, xs):
        if not xs:
            return None
        return {
            "n": len(xs),
            "avg_ms": statistics.mean(xs),
            "p95_ms": percentile(xs, 95),
            "max_ms": max(xs)
        }

    print("=== OLTP Workload Summary ===")
    for k in ["browse", "seller", "comments", "sp"]:
        s = summarize(k, lat[k])
        if s:
            print(f"{k:8s}  n={s['n']:4d}  avg={s['avg_ms']:.2f}ms  p95={s['p95_ms']:.2f}ms  max={s['max_ms']:.2f}ms")
    print(f"errors: {errors} / {iters}")
    print(f"total_runtime: {total_runtime_s:.3f} s")
    print(f"successful_ops: {success_ops}")
    print(f"throughput: {throughput_ops:.2f} ops/s")


    cur.close()
    conn.close()

if __name__ == "__main__":
    main(iters=500)
