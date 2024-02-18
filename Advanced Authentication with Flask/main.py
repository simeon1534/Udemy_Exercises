from flask import Flask, render_template, request, url_for, redirect, flash, send_from_directory, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Column
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user

app = Flask(__name__)
app.config['SECRET_KEY'] = '\x18\x05b\x10\xcbN\x1fO\xf44 M\xc5fZD\xd6m\x00\xa1\x90U\x9eg'


# CREATE DATABASE
class Base(DeclarativeBase):
    pass


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['UPLOAD_FOLDER'] = 'static'
db = SQLAlchemy(model_class=Base)
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)


# CREATE TABLE IN DB
class User(UserMixin, db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(1000))


with app.app_context():
    db.create_all()
    db.session.commit()


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        user_by_email = User.query.filter_by(email=email).first()
        if user_by_email:
            flash('Email already exists.')
            return render_template("register.html")

        hashed_salted_pass = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        new_user = User(name=name,
                        email=email,
                        password=hashed_salted_pass
                        )
        print(dir(new_user))
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)

        return render_template("secrets.html", name_title=name)
    return render_template("register.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()
        if user is not None:
            if check_password_hash(user.password, password):
                login_user(user)

                return render_template("secrets.html", name_title=user.name)
            else:
                flash('Wrong password. Try again.')
                return render_template("login.html")

        else:
            flash('No existing email')
            return render_template("login.html")



    return render_template("login.html")


@app.route('/secrets')
@login_required
def secrets():
    return render_template("secrets.html",name_title=current_user.name)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return render_template("index.html")



@app.route('/download')
@login_required
def download():
    return send_from_directory(
        app.config['UPLOAD_FOLDER'], 'files/cheat_sheet.pdf', as_attachment=True)


@login_manager.user_loader
def load_user(user_id):
    # Convert the user ID from a string to an integer (assuming user IDs are integers)
    user_id = int(user_id)

    # Load and return the user object by ID
    return User.query.get(user_id)


if __name__ == "__main__":
    app.run(debug=True)
