from flask import Flask
from flask_restx import Api
from models import User, Results
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from users import user_ns
from auth import auth_ns
from excel_results import result_ns
from flask_cors import CORS
from flask import jsonify


def create_app(config):
    app=Flask(__name__)
    app.config.from_object(config)

    CORS(app)

    db.init_app(app)

    migrate=Migrate(app,db)
    JWTManager(app)

    api = Api(app, doc='/docs')

    api.add_namespace(user_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(result_ns)

    @app.errorhandler(401)
    def handle_401(error):
        return jsonify(message="Session expired"), 401

    #export to terminal shell to interact with db
    @app.shell_context_processor
    def make_shell_contect():
        return {
            "db": db,
            "user": User,
            "results": Results
        }


    return app