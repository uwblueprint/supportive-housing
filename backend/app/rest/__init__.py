def init_app(app):
    from . import (
        user_routes,
        auth_routes,
        sign_in_logs_routes,
        log_records_routes,
        residents_routes,
        tags_routes,
        buildings_routes,
    )

    app.register_blueprint(user_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)
    app.register_blueprint(sign_in_logs_routes.blueprint)
    app.register_blueprint(log_records_routes.blueprint)
    app.register_blueprint(residents_routes.blueprint)
    app.register_blueprint(tags_routes.blueprint)
    app.register_blueprint(buildings_routes.blueprint)
