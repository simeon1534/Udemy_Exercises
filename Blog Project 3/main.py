from flask import Flask, render_template, redirect, url_for, request
from flask_bootstrap import Bootstrap5
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, URL
from flask_ckeditor import CKEditor, CKEditorField
from datetime import date, datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap5(app)
ckeditor = CKEditor(app)
# CONNECT TO DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///posts.db'
db = SQLAlchemy()
db.init_app(app)


# CONFIGURE TABLE
class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), unique=True, nullable=False)
    subtitle = db.Column(db.String(250), nullable=False)
    date = db.Column(db.String(250), nullable=False, default=datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
    body = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(250), nullable=False)
    img_url = db.Column(db.String(250), nullable=False)


with app.app_context():
    db.create_all()


class BlogPostForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    subtitle = StringField('Subtitle', validators=[DataRequired()])
    author = StringField('Author', validators=[DataRequired()])
    img_url = StringField('Image URL', validators=[DataRequired()])
    body = CKEditorField('Body', validators=[DataRequired()])


@app.route('/')
def get_all_posts():
    # TODO: Query the database for all the posts. Convert the data to a python list.
    results = BlogPost.query.all()
    # for result in results:
    #     print(result.id)
    posts = results
    return render_template("index.html", all_posts=posts)


# TODO: Add a route so that you can click on individual posts.
@app.route('/search', methods=['GET'])
def show_post():
    post_id = int(request.args.get('post_id'))
    print(post_id)
    # TODO: Retrieve a BlogPost from the database based on the post_id
    requested_post = None

    results = BlogPost.query.all()
    for res in results:
        if res.id == post_id:
            requested_post = res
    return render_template("post.html", post=requested_post)


# TODO: add_new_post() to create a new blog post
@app.route('/new-post', methods=['GET', 'POST'])
def new_post():
    form = BlogPostForm()
    h1 = 'New Post'
    if form.validate_on_submit():
        title = form.title.data
        subtitle = form.subtitle.data
        author = form.author.data
        img_url = form.img_url.data
        body = form.body.data

        new_post = BlogPost(
            title=title,
            subtitle=subtitle,
            author=author,
            img_url=img_url,
            body=body
        )
        db.session.add(new_post)
        db.session.commit()

        # Redirect to the home page or show a success message
        return render_template('post.html', post=new_post), 201
    return render_template('make-post.html', h1=h1, form=form), 200


# TODO: edit_post() to change an existing blog post
@app.route('/edit-post/<post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    h1 = 'Edit Post'

    post = db.get_or_404(BlogPost, post_id)

    # autofilled post for editing
    form = BlogPostForm(
        title=post.title,
        subtitle=post.subtitle,
        author=post.author,
        img_url=post.img_url,
        body=post.body
    )

    if form.validate_on_submit():
        post.title = form.title.data
        post.subtitle = form.subtitle.data
        post.author = form.author.data
        post.img_url = form.img_url.data
        post.body = form.body.data
        print(post.title)
        db.session.commit()

        # Redirect to the home page or show a success message
        return render_template('post.html', post=post), 201
    return render_template('make-post.html', form=form, h1=h1)


# TODO: delete_post() to remove a blog post from the database
@app.route("/delete/<post_id>", methods=['GET', 'POST'])
def delete_post(post_id):
    post = db.get_or_404(BlogPost, post_id)
    # Delete the post from the database
    db.session.delete(post)
    db.session.commit()

    return redirect(url_for('get_all_posts'))


# Below is the code from previous lessons. No changes needed.
@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(debug=True, port=5003)
