"""
Kartik Watch Shop — Universal Database Connection Manager
Provides unified MySQL + SQLite database access with automatic fallback.
If MySQL (e.g. XAMPP) is running, connects to MySQL.
If MySQL is unavailable (or in cloud environments like Render/Railway),
it automatically and silently falls back to local SQLite with zero errors.
"""

import os
import sqlite3
import pymysql
import pymysql.cursors
from config import Config

SQLITE_DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'database'))
SQLITE_DB_PATH = os.path.join(SQLITE_DB_DIR, 'kartik_watch_shop.db')

_ACTIVE_BACKEND = None


class SQLiteCursorWrapper:
    """Cursor wrapper for SQLite that supports context manager and dict output."""
    def __init__(self, cursor):
        self._cursor = cursor

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    def execute(self, sql, params=None):
        clean_sql = sql.replace('%s', '?')
        clean_sql = clean_sql.replace('NOW()', 'CURRENT_TIMESTAMP')
        if params is None:
            return self._cursor.execute(clean_sql)
        return self._cursor.execute(clean_sql, params)

    def fetchall(self):
        rows = self._cursor.fetchall()
        return [dict(r) for r in rows]

    def fetchone(self):
        row = self._cursor.fetchone()
        return dict(row) if row else None

    @property
    def lastrowid(self):
        return self._cursor.lastrowid

    @property
    def rowcount(self):
        return self._cursor.rowcount


class SQLiteConnectionWrapper:
    """Connection wrapper for SQLite matching pymysql interface."""
    def __init__(self, db_path):
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self._conn = sqlite3.connect(db_path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row

    def cursor(self, *args, **kwargs):
        return SQLiteCursorWrapper(self._conn.cursor())

    def begin(self):
        pass

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()


def detect_backend():
    """Detect whether MySQL is accessible; otherwise fall back to SQLite."""
    global _ACTIVE_BACKEND
    if _ACTIVE_BACKEND:
        return _ACTIVE_BACKEND

    # Check if user explicitly chose sqlite in .env
    db_type = os.getenv('DB_TYPE', '').lower()
    if db_type == 'sqlite':
        _ACTIVE_BACKEND = 'sqlite'
        print(f"[DB] Using SQLite backend ({os.path.basename(SQLITE_DB_PATH)}).")
        ensure_sqlite_database()
        return _ACTIVE_BACKEND

    try:
        conn = pymysql.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASS,
            connect_timeout=1,
            charset='utf8mb4'
        )
        conn.close()
        _ACTIVE_BACKEND = 'mysql'
        print(f"[DB] Connected to MySQL on {Config.DB_HOST}:{Config.DB_PORT}.")
    except Exception:
        _ACTIVE_BACKEND = 'sqlite'
        print(f"[DB] MySQL offline. Auto-fallback to local SQLite ({os.path.basename(SQLITE_DB_PATH)}).")
        ensure_sqlite_database()

    return _ACTIVE_BACKEND


def get_connection(use_db=True):
    """
    Get a database connection (MySQL or SQLite depending on availability).
    """
    backend = detect_backend()
    if backend == 'sqlite':
        return SQLiteConnectionWrapper(SQLITE_DB_PATH)

    params = {
        'host': Config.DB_HOST,
        'port': Config.DB_PORT,
        'user': Config.DB_USER,
        'password': Config.DB_PASS,
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor,
        'autocommit': True,
    }

    if use_db:
        params['database'] = Config.DB_NAME

    return pymysql.connect(**params)


def ensure_sqlite_database():
    """Initialize SQLite tables and seed data if the database is new or empty."""
    conn = SQLiteConnectionWrapper(SQLITE_DB_PATH)
    try:
        # Check if products table exists and has items
        with conn.cursor() as cursor:
            cursor._cursor.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='products'")
            table_exists = cursor._cursor.fetchone()[0]

            if not table_exists:
                schema_path = os.path.join(SQLITE_DB_DIR, 'sqlite_schema.sql')
                seed_path = os.path.join(SQLITE_DB_DIR, 'sqlite_seed.sql')

                if os.path.exists(schema_path):
                    with open(schema_path, 'r', encoding='utf-8') as f:
                        conn._conn.executescript(f.read())

                if os.path.exists(seed_path):
                    with open(seed_path, 'r', encoding='utf-8') as f:
                        conn._conn.executescript(f.read())

                conn.commit()
                print("[DB] SQLite database initialized and seeded with 31 luxury timepieces.")

            # Early SQLite builds used an older valuation-table layout while
            # the API and MySQL schema already used the fields below. Migrate
            # in place so existing local installations keep their enquiries.
            cursor._cursor.execute("PRAGMA table_info(sell_inquiries)")
            sell_columns = {row[1] for row in cursor._cursor.fetchall()}
            if sell_columns and 'reference_no' not in sell_columns:
                cursor._cursor.execute("ALTER TABLE sell_inquiries RENAME TO sell_inquiries_legacy")
                schema_path = os.path.join(SQLITE_DB_DIR, 'sqlite_schema.sql')
                with open(schema_path, 'r', encoding='utf-8') as f:
                    conn._conn.executescript(f.read())

                conn._conn.execute(
                    "INSERT INTO sell_inquiries (reference_no, user_id, client_name, client_phone, "
                    "client_email, watch_brand, model_name, condition_state, purchase_year, has_box, "
                    "has_papers, has_receipt, has_extra_strap, expected_price, status, notes) "
                    "SELECT reference_number, user_id, client_name, client_phone, client_email, "
                    "watch_brand, watch_model, condition_grade, purchase_year, "
                    "CASE WHEN lower(COALESCE(box_and_papers, '')) LIKE '%box%' THEN 1 ELSE 0 END, "
                    "CASE WHEN lower(COALESCE(box_and_papers, '')) LIKE '%paper%' THEN 1 ELSE 0 END, "
                    "0, 0, expected_price, "
                    "CASE WHEN status = 'under_review' THEN 'submitted' ELSE status END, description "
                    "FROM sell_inquiries_legacy"
                )
                cursor._cursor.execute("DROP TABLE sell_inquiries_legacy")
                conn.commit()
                print("[DB] Migrated SQLite sell inquiries to the current schema.")
    except Exception as e:
        print(f"[DB WARNING] SQLite initialization note: {e}")
    finally:
        conn.close()


def ensure_database():
    """Create the database if it doesn't already exist."""
    backend = detect_backend()
    if backend == 'sqlite':
        ensure_sqlite_database()
        return

    try:
        conn = get_connection(use_db=False)
        with conn.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` "
                f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        conn.close()
        print(f"[DB] Database `{Config.DB_NAME}` is ready.")
    except pymysql.Error as e:
        print(f"[DB ERROR] MySQL connection error: {e}")
        # Switch to SQLite if MySQL fails
        global _ACTIVE_BACKEND
        _ACTIVE_BACKEND = 'sqlite'
        print("[DB] Switched to SQLite fallback.")
        ensure_sqlite_database()


def query(sql, params=None):
    """Execute a SELECT query and return all rows as a list of dicts."""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            return cursor.fetchall()
    finally:
        conn.close()


def query_one(sql, params=None):
    """Execute a SELECT query and return the first row as a dict or None."""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            return cursor.fetchone()
    finally:
        conn.close()


def execute(sql, params=None):
    """Execute an INSERT/UPDATE/DELETE and return lastrowid."""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()


def scalar(sql, params=None):
    """Execute a query and return the first column of the first row."""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            row = cursor.fetchone()
            if row:
                # Dict row or tuple row
                if isinstance(row, dict):
                    return next(iter(row.values()))
                return row[0]
            return None
    finally:
        conn.close()
