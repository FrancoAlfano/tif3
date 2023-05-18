from flask_restx import Namespace, Resource, fields
from models import User
from flask_jwt_extended import jwt_required
from flask import request


user_ns=Namespace("user", description="A namespace for users")

user_model=user_ns.model(
    "User",
    {
        "id":fields.Integer(),
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
        "full_name":fields.String()
    }
)


@user_ns.route('/users')
class UsersResource(Resource):

    @user_ns.marshal_list_with(user_model)
    @user_ns.expect(user_model)
    def get(self):
        """Get all users"""

        #this returns an sqlalchemy object
        users=User.query.all()
        
        #we turn the object from sqlachemy into a json using the serializer
        return users

    @user_ns.marshal_with(user_model)
    @user_ns.expect(user_model)
    @jwt_required()
    def post(self):
        """Create user"""
        data=request.get_json()
        new_user=User(
            username=data.get('username'),
            email=data.get('email'),
            full_name=data.get('full_name'),
            password=data.get('password')
        )

        new_user.save()
        return new_user, 201


@user_ns.route('/user/<int:id>')
class UserResource(Resource):

    @user_ns.marshal_with(user_model)
    def get(self, id):
        """Get a user by id"""
        #if the id doesnt exist, return 404 not found
        user=User.query.get_or_404(id)
        return user

    @user_ns.marshal_with(user_model)
    @jwt_required()
    def put(self, id):
        """Update user"""
        user_to_update=User.query.get_or_404(id)
        data=request.get_json()
        user_to_update.update(
            data.get('username'),
            data.get('email'),
            data.get('password'),
            data.get('full_name')
        )
        return user_to_update

    @user_ns.marshal_with(user_model)
    @jwt_required()
    def delete(self, id):
        """Delete user"""
        user_to_delete=User.query.get_or_404(id)
        user_to_delete.delete()
        return user_to_delete

