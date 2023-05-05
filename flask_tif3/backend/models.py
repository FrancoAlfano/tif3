from exts import db

"""
class User:
    id:integer
    username:string
    email:string
    password:string
    full_name:string
"""

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.Text(), nullable=False)
    full_name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        """
        returns string rep of object
        """
        return f"<User {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, username, email, password, full_name):
        self.username = username
        self.email = email
        self.password = password
        self.full_name = full_name
        db.session.commit()



"""
class Results:
    id:integer
    username:string
    tag:string
    positives:integer
    negatives:integer
    neutrals:integer
"""

class Results(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False)
    tag = db.Column(db.String(25), nullable=False)
    positives = db.Column(db.Integer, nullable=False)
    negatives = db.Column(db.Integer, nullable=False)
    neutrals = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        """
        returns string rep of object
        """
        return f"<Results {self.tag}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
