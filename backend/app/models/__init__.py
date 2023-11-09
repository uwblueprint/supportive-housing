from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


def init_app(app):
    from .entity import Entity
    from .user import User
    from .sign_in_logs import SignInLogs
    from .log_records import LogRecords
    from .tags import Tag
    from .log_record_tags import LogRecordTag
    from .residents import Residents
    from .buildings import Buildings
    from .log_record_residents import LogRecordResidents

    app.app_context().push()
    db.init_app(app)
    migrate.init_app(app, db)

    erase_db_and_sync = app.config["TESTING"]

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()
