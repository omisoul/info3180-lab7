from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.fields import TextAreaField
from wtforms.validators import InputRequired


class UploadForm(FlaskForm):
    photo = FileField('Image Upload', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'Invalid file type, please try again'])
    ])
    description = TextAreaField('Description', validators=[InputRequired()])
