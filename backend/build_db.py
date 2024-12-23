from app import app, db
from models import MetaInfo, PastProgress


def build_database():
    with app.app_context():
        try:
            db.drop_all()  # Drop all existing tables
            db.create_all()  # Create tables based on models

            # Add default meta information
            default_meta = MetaInfo()
            db.session.add(default_meta)
            db.session.commit()
            print("Database created and seeded successfully!")

        except Exception as e:
            print(f"An error occurred while building the database: {str(e)}")


if __name__ == '__main__':
    build_database()
