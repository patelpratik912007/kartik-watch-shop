"""
Kartik Watch Shop — Database Setup Script
Creates tables and seeds the database with 31 watches + demo accounts.
Supports both MySQL (XAMPP) and zero-config local SQLite automatically.

Usage:
    python setup_db.py
"""

import os
import sys
import pymysql

sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from db import ensure_database, get_connection, detect_backend, SQLITE_DB_PATH, scalar


def run_mysql_sql_file(filepath, description):
    """Execute a .sql file against the MySQL database."""
    if not os.path.exists(filepath):
        print(f"  [ERROR] File not found: {filepath}")
        return False

    print(f"  Running {description}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            statements = sql_content.split(';')
            executed = 0
            for stmt in statements:
                stmt = stmt.strip()
                if stmt and not stmt.startswith('--'):
                    try:
                        cursor.execute(stmt)
                        executed += 1
                    except pymysql.Error as e:
                        if e.args[0] not in (1065,):
                            print(f"    [WARN] Statement error: {str(e.args[1])[:80]}")
            conn.commit()
            print(f"  [SUCCESS] {description} — {executed} statements executed.")
            return True
    except Exception as e:
        print(f"  [ERROR] {description} failed: {e}")
        return False
    finally:
        conn.close()


def verify_tables():
    """Print record counts for key tables."""
    tables = ['users', 'products', 'orders', 'service_bookings', 'sell_inquiries']
    print("\n  Step: Verifying table row counts...")
    for table in tables:
        try:
            count = scalar(f"SELECT COUNT(*) FROM `{table}`") or 0
            print(f"    * {table}: {count} records")
        except Exception:
            print(f"    * {table}: [NOT FOUND]")


def main():
    print("=" * 60)
    print("  Kartik Watch Shop — Database Setup")
    print("=" * 60)
    print()

    backend = detect_backend()
    print(f"  Target Database Engine: {backend.upper()}")

    if backend == 'mysql':
        print("  Connecting to MySQL and ensuring database exists...")
        try:
            ensure_database()
        except Exception as e:
            print(f"\n  [WARN] MySQL error: {e}")
            print("  Falling back to SQLite...")
            backend = 'sqlite'

        if backend == 'mysql':
            schema_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'database', 'schema.sql'))
            seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'database', 'seed.sql'))
            print("\n  Creating MySQL tables from schema.sql...")
            run_mysql_sql_file(schema_path, 'schema.sql')
            print("\n  Seeding MySQL database from seed.sql...")
            run_mysql_sql_file(seed_path, 'seed.sql')

    if backend == 'sqlite':
        print(f"  Ensuring SQLite database at: {os.path.basename(SQLITE_DB_PATH)}")
        ensure_database()

    verify_tables()

    print("\n  " + "=" * 56)
    print("  All operations completed! Database is ready.")
    print("  " + "=" * 56)
    print(f"\n  Frontend:  http://localhost:{Config.PORT}/")
    print(f"  API:       http://localhost:{Config.PORT}/api/products\n")


if __name__ == '__main__':
    main()
