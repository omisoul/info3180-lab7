"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app
from flask import render_template, request, redirect, url_for, session, abort, jsonify
from werkzeug.utils import secure_filename

from .forms import UploadForm

# Helpers
def get_uploaded_images():
    # image_list = []
    file_list = []
    rootdir = os.getcwd()
    for subdir, dirs, files in os.walk(rootdir + '/uploads'):
        for file in files:
            # image_list.append(os.path.join(subdir,file))
            file_list.append(file)
    return file_list

###
# Routing for your application.
###
@app.route('/api/upload', methods=['POST'])
def upload():

    # Instantiate your form class
    upload_form = UploadForm()

    # Validate file upload on submit
    if upload_form.validate_on_submit():
        # Get file data and save to your uploads folder
        image = upload_form.photo.data
        description = upload_form.description.data

        filename = secure_filename(image.filename)
        image.save(os.path.join(
            app.config['UPLOAD_FOLDER'], filename
        ))

        res = {
            "message": "File Upload Successful",
            "filename": filename,
            "description": description
        }
        return jsonify(res)

    res = {
        "errors": [{"error": x} for x in form_errors(upload_form)]
    }
    return jsonify(res)



# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

###
# The functions below should be applicable to all Flask apps.
###




if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
