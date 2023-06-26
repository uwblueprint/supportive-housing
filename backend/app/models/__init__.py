from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


def init_app(app):
    from .entity import Entity
    from .user import User
    from .sign_in_logs import SignInLogs
    from .log_records import LogRecords
    from .tag import Tag
    from .residents import Residents
    from .buildings import Buildings

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

        building1 = Buildings(id=1, address="144 Erb St. East", name="Seniors")
        building2 = Buildings(id=2, address="362 Erb St. West", name="Permanent")
        building3 = Buildings(id=3, address="402 Erb St. West", name="Adults")
        db.session.add(building1)
        db.session.add(building2)
        db.session.add(building3)
        db.session.commit()
