"""Generate Render environment values locally; never writes a password to disk."""
from getpass import getpass
import secrets
from werkzeug.security import generate_password_hash


def main():
    username = input("Admin username: ").strip()
    if not username:
        raise SystemExit("A username is required.")
    password = getpass("Choose a new admin password (at least 12 characters): ")
    if len(password) < 12:
        raise SystemExit("Use at least 12 characters.")
    if password != getpass("Confirm password: "):
        raise SystemExit("Passwords do not match.")
    print("\nCopy these values into Render's private environment settings:")
    print("ADMIN_USERNAME=" + username)
    print("ADMIN_PASSWORD_HASH=" + generate_password_hash(password))
    print("\nOnly if SECRET_KEY is currently missing (keep an existing value):")
    print("SECRET_KEY=" + secrets.token_hex(32))
    print("\nDo not commit these values or share them in chat.")


if __name__ == "__main__":
    main()
