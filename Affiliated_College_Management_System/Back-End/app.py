from flask import *
from flask import g
from flask_session import Session
from werkzeug.wrappers import response
from Model import model
from datetime import datetime
from datetime import timedelta
# pip install flask_cors
from flask_cors import CORS
from fileinput import filename
import os
from pathlib import Path
import smtplib
import ssl
import random
import string
import time
# pip install flask_mail
from flask_mail import Mail, Message
from BusinessObjects import *
from werkzeug.security import generate_password_hash, check_password_hash
# pip install flask_jwt_extended
from flask_jwt_extended import *


app = Flask(__name__)
app.config['SECRET_KEY'] = "MYSECRETKEY"
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_object("config")

app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'elite.express243@gmail.com'
app.config['MAIL_PASSWORD'] = 'njsopxyyzkkssixt'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

app.config['MAIL_DEFAULT_SENDER'] = "elite.express243@gmail.com"
mail = Mail(app)
verification_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))


def my_decorator(func):
    @jwt_required()
    def inner1(*args, **kwargs):

        try:
            # initializing model
            m = model()

            # Storing data in g
            g.model = m

            if get_jwt_identity() != None:
                user_id = get_jwt_identity()
                g.user_id = user_id
                examiner_id = m.getExaminerID(user_id)
                g.examiner_id = examiner_id

            id = func(*args, **kwargs)

            # calling Destructor of model
            m.__del__()

        except Exception as e:
            print("Exception in decorator: ", str(e))
        return id
    
    inner1.__name__ = func.__name__
    return inner1

@app.route('/SignUpPersonalInfo', methods=["POST"])
def SignUpPersonalInfo():
    try:
        # get data from form
        usr_name = request.json.get("usr_name")
        usr_cnic = request.json.get("usr_cnic")
        usr_email = request.json.get("usr_email")
        usr_address = request.json.get("usr_address")
        usr_bio = request.json.get("usr_bio")
        usr_gender = request.json.get("usr_gender")
        usr_password = request.json.get("usr_password")
        usr_phone = request.json.get("usr_phone")
        usr_profile_pic = "Static\Resumes\ProfilePics\empty.png"
        usr_active_status = True
        _hashed_password = generate_password_hash(usr_password)

        # set data in obj
        data = User()
        data.usr_name = usr_name
        data.usr_password = _hashed_password
        data.usr_cnic = usr_cnic
        data.usr_profile_pic = usr_profile_pic
        data.usr_address = usr_address
        data.usr_email = usr_email
        data.usr_active_status = usr_active_status
        data.usr_bio = usr_bio
        data.usr_gender = usr_gender
        data.usr_phoneno = usr_phone
        
        # Insertion in database
        m = model()
        
        if m.checkEmailExist(usr_email):
            return jsonify({"error": "Email exists"}), 401
        user_id = m.InsertUser(data)  # insertion function return userid
        
        if user_id != 0:
            # sending email
            # verification_code = "".join(random.choices(
            #     string.ascii_letters + string.digits, k=10))
            verification_link = request.url_root + 'verify?code=' + verification_code
            message = Message('Verify your email', recipients=[usr_email])
            message.html = f'<div style="background-color: #221e1e; border-radius: 20px; color: wheat; font-family: Tahoma, Verdana, sans-serif; padding: 10px;"><h1 style="text-align: center;"><strong>ٱلسَّلَامُ عَلَيْكُمْ <br /></strong></h1><h2 style="text-align: center;"><span style="color: brown;"> {session.get("usr_name")} </span></h2><hr/><p>Welcome to Exam Portal, before being able to use your account you need to verify that this is your email address by clicking here: {verification_link}</p><p style="text-align: left;"><span style="color: brown;">If you do not recognize this activity simply ignore this mail.&nbsp;</span></p><p>Kind Regards,<br /><span style="color: brown;"><strong>PUCIT Exam Portal</strong></span></p></div>'

            mail.send(message)
            # sending email
            # verification_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))

            # Creating Access Token
            access_token = create_access_token(identity=user_id[0], expires_delta=timedelta(hours=1))
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"error": "Error in insertion"}), 401
        
    except Exception as e:
        print("Exception in SignUpPersonalInfo", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/SignUpExaminerInfo', methods=["POST", "GET"])
@jwt_required()
@my_decorator
def SignUpExaminerInfo():
    try:
        # get data from form
        institution = request.form.get("institution")
        user_id = g.user_id

        # Get File and Save in a directory
        f = request.files.get("resume")
        resume = f"Static\Resumes\{user_id}.pdf"
        if Path(resume).is_file():
            os.remove(resume)
        f.save(resume)

        # Set by default values
        availability = True
        ranking = 0
        acceptance_count = 0
        rejection_count = 0
        verified = False
        data = examiner(user_id, institution, availability, ranking,
                        resume, acceptance_count, rejection_count, verified)

        # insertion in DataBase
        m = g.model
        examiner_id = m.InsertExaminer(data)[0]
        if examiner_id != 0:
            return jsonify({"message": "okay"}), 200
        return jsonify({"error": "Error in insertion"}), 401
        
    except Exception as e:
        print("Exception in SignUpExaminerInfo", str(e))
        return jsonify({"error": str(e)}), 401
    
@app.route('/ExaminerQualification', methods=["POST", "GET"])
@my_decorator
def ExaminerQualification():
    try:

        m = g.model
        examiner_id = g.examiner_id

        # Fetch data from form
        degree_title = request.form.get("degree_title")
        institution = request.form.get("institution")
        starting_date = request.form.get("starting_date")
        ending_date = request.form.get("ending_date")
        f = request.files.get("transcript")
        
        # Strore file in local directory
        print(datetime.now().strftime("%d-%m-%Y %H:%M:%S"))
        transcript = f'''Static\\transcripts\\{datetime.now().strftime("%d-%m-%Y %H:%M:%S")}_{examiner_id}.pdf'''
        if Path(transcript).is_file():
            os.remove(transcript)
        f.save(transcript)

        data = qualification(examiner_id, degree_title, transcript,
                            institution, starting_date, ending_date)

        # Insertion in DataBase

        if m.InsertExaminerQualification(data) != False:
            return jsonify({"Message": "Okay"}), 200
        return jsonify({"error": "Error in insertion"}), 401
        
    except Exception as e:
        print("Exception in ExaminerQualification", str(e))
        return jsonify({"error": str(e)}), 401
    
@app.route('/ExaminerExperience', methods=["POST", "GET"])
@my_decorator
def ExaminerExperience():
    try:
        m = g.model
        examiner_id = g.examiner_id

        # fetch data from form
        job_title = request.form.get("job_title")
        organization = request.form.get("organization")
        reference_email = request.form.get("reference_email")
        starting_date = request.form.get("starting_date")
        ending_date = request.form.get("ending_date")
        f = request.files.get("ExperianceLetter")
        # Strore file in local directory
        ExperianceLetters = f"Static\\ExperianceLetters\\{datetime.now().strftime('%d/%m/%Y %H:%M:%S')}_{examiner_id}.pdf"
        print(ExperianceLetters)
        if Path(ExperianceLetters).is_file():
            os.remove(ExperianceLetters)
        f.save(ExperianceLetters)

        data = experience(examiner_id, job_title, ExperianceLetters,
                        organization, reference_email, starting_date, ending_date)
        verification_link = request.url_root + 'verify?code=' + verification_code

        # Insertion in dataBase
        email = m.getUserEmail(g.user_id)
        message = Message('Verify your email', recipients=email)
        message.html = f'<div style="background-color: #221e1e; border-radius: 20px; color: wheat; font-family: Tahoma, Verdana, sans-serif; padding: 10px;"><h1 style="text-align: center;"><strong>ٱلسَّلَامُ عَلَيْكُمْ <br /></strong></h1><h2 style="text-align: center;"><span style="color: brown;"> {session.get("usr_name")} </span></h2><hr/><p>Welcome to Exam Portal, before being able to use your account you need to verify that this is your email address by clicking here: {verification_link}</p><p style="text-align: left;"><span style="color: brown;">If you do not recognize this activity simply ignore this mail.&nbsp;</span></p><p>Kind Regards,<br /><span style="color: brown;"><strong>PUCIT Exam Portal</strong></span></p></div>'
        mail.send(message)

        if m.InsertExaminerExperience(data) != False:
            return jsonify({"Message": "Okay"}), 200
        return jsonify({"error": "Error in insertion"}), 401
        
    except Exception as e:
        print("Exception in ExaminerExp", str(e))
        return jsonify({"error": str(e)}), 401
    
@app.route('/verify')
@my_decorator
def verify():
    try :
        m = g.model
        examiner_id = g.examiner_id

        code = request.args.get('code')

        if verification_code == code:
            m.setUserVerified(examiner_id)
            return redirect("http://localhost:3000")
        else:
            return 'Invalid verification code!'
        
    except Exception as e:
        print("Exception in verify", str(e))
        return str(e)

@app.route('/ExaminerLogin', methods=["POST"])
@jwt_required()
@my_decorator
def ExaminerLogin():
    try :
        # Fetch data from form
        email = request.json.get("email")
        password = request.json.get("password")

        # Verification
        m = g.model
        examiner_id = m.getExaminerID(m.getUserID(email))

        if not (m.checkExaminerVerified(examiner_id)):
            return jsonify({"error": "Verify email first"}), 401

        if not (m.checkEmailExist(email)):
            return jsonify({"error": "Email does not exist"}), 401

        usr_pass = m.getUserPassword(email)
        if not (check_password_hash(usr_pass, password)):
            return jsonify({"error": "Invalid Password"}), 401

        examiner_id = m.ValidatePassword(email, usr_pass)
        if (examiner_id > 0):
            session["examiner_id"] = examiner_id
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token, expires_delta=timedelta(hours=1)), 200
        return jsonify({"error": "Invalid Password"}), 401
    except Exception as e:
        print("Exception in Login", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/profile', methods=['GET', 'POST'])
@my_decorator
def profile():
    try:
        m = g.model
        examiner_id = g.examiner_id
        user_ = m.getDataofUser(examiner_id)
        examiner_ = m.getDataofExaminer("examiner", examiner_id)
        data = {
            "usr_name": user_.usr_name,
            "usr_phoneno": user_.usr_phoneno,
            "usr_cnic": user_.usr_cnic,
            "usr_address": user_.usr_address,
            "usr_email": user_.usr_email,
            "usr_profile_pic": user_.usr_profile_pic,
            "usr_bio": user_.usr_bio,
            "usr_gender": user_.usr_gender,
            "usr_active_status": user_.usr_active_status,
            "institution": examiner_.institution,
            "availability": examiner_.availability,
            "ranking": examiner_.ranking,
            "resume": examiner_.resume,
            "acceptance_count": examiner_.acceptance_count,
            "rejection_count": examiner_.rejection_count,
            "qualification": m.getDataofExaminer("qualification", examiner_id),
            "experience": m.getDataofExaminer("experience", examiner_id)
        }
        print(data)
        return jsonify(data)
    except Exception as e:
        print("Exception in profile", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/notifications')
@my_decorator
def notifications():
    try:        
        m = g.model
        examiner_id = g.examiner_id

        data = []

        # Fetch data from database
        pracDuties = m.getRecievedPracRequests(examiner_id)
        examDuties = m.getRecievedTheoryRequests(examiner_id)

        for i in pracDuties:
            i = list(i)
            i.append("Practical Exam")
            data.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory Paper")
            data.append(i)

        data.sort(key=lambda x: x[0], reverse=True)

        return jsonify(data)
    except Exception as e:
        print("Exception in notifications", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/getRequestRecievedId', methods=['POST'])
@jwt_required()
@my_decorator
def getRequestRecievedId():
    try:
        m = model()
        user_id = get_jwt_identity()
        examiner_id = m.getExaminerID(user_id)

        duty = request.form.get('duty_id')
        print("duty: ", duty)
        data = duty.split(",")
        # session["duty_id"] = str(data[0])
        # session["duty_Type"] = str(data[data.__len__() - 1])
        return 200
    except Exception as e:
        print("Exception in getRequestRecievedId", str(e))
        return jsonify({"error": str(e)}), 401

@app.route("/DutyDetails/", methods=['POST', 'GET'])
@my_decorator
def DutyDetails():                  # moving from request page to duty details
    try:
        duty_id = session.get("duty_id")
        dutyType = session.get("duty_Type")
        m = g.model
        # => using course code get crs code, crs title,
        # => request date, paper upload deadline from exam/duty table
        # => using rd_id get crs_book and crs_outline from both tables
        # => get prac_date, time and institute by using ac_id get name and location of
        # institute from affiliated_colleges table
        dutyDetails = m.getDutyDetails(duty_id, dutyType)
        return jsonify(dutyDetails)
    except Exception as e:
        print("Exception in DutyDetails", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/home')
@my_decorator
def home():
    try:
        m = g.model
        examiner_id = g.examiner_id

        # return requested received and status is true and
        # paper upload deadline is after today
        duties = []
        pracDuties = m.getAcceptedPracDuties(examiner_id)  # 2 for accepted status
        examDuties = m.getAcceptedTheoryDuties(examiner_id)

        for i in pracDuties:
            i = list(i)
            i.append("Practical Exam")
            duties.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory Paper")
            duties.append(i)

        duties.sort(key=lambda x: x[1], reverse=True)
        return jsonify(duties)
    except Exception as e:
        print("Exception in home", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/PaperPendingDuty', methods=['GET'])
@my_decorator
def PaperPendingDuty():						# accepted and uploaded paper and paper is not taken yet
    try:
        m = g.model
        examiner_id = g.examiner_id

        # paper table has the entity has the same duty id
        # and paper_date in exam_duty table is after today
        duties = []
        pracDuties = m.getPracPaper_Pending(examiner_id)
        examDuties = m.getTheoryPaper_Pending(examiner_id)

        for i in pracDuties:
            i = list(i)
            i.append("Practical Exam")
            duties.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory Paper")
            duties.append(i)

        duties.sort(key=lambda x: x[1], reverse=True)
        return jsonify(duties)
    except Exception as e:
        print("Exception in PaperPendingDuty", str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/ResultUploadPending', methods=['GET'])
@my_decorator
def ResultUploadPending():					# paper done upload paper now
    try:
        m = g.model
        examiner_id = g.examiner_id
        # paper table has the entity has the same duty id has null result column
        # and result_date in exam_duty table is after today
        duties = []
        pracDuties = m.getPracResult_Pending(examiner_id)
        examDuties = m.getTheoryResult_Pending(examiner_id)

        for i in pracDuties:
            i = list(i)
            i.append("Practical Exam")
            duties.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory Paper")
            duties.append(i)

        duties.sort(key=lambda x: x[1], reverse=True)
        return jsonify(duties)
    except Exception as e:
        print("Exception in ResultUploadPending", str(e))
        return jsonify({"error": str(e)}), 401

@app.route("/GetPaper", methods=['GET'])
@my_decorator
def GetPaper():
    try:
        d_id = session.get('duty_id')
        paper = request.files["Paper"]
        # Store paper in local directory
        papers = f"Static\papers\{d_id}.pdf"
        if Path(papers).is_file():
            os.remove(papers)
        paper.save(papers)
        # store nme of the paper in the DataBase
        m = g.model
        if m.InsertUploadedPaper(d_id, papers, session.get("duty_type")):
            return jsonify({"status": "success", "message": "Paper Uploaded Successfully"})
        return jsonify({"status": "failed", "message": "Failed to Upload Paper"})
    except Exception as e:
        print("Exception in GetPaper", str(e))
        return jsonify({"error": str(e)}), 401

@app.route("/GetResult", methods=['GET'])
@my_decorator
def GetResult():
    try:
        d_id = session.get('duty_id')
        result = request.files["result"]
        # Store file in local directory
        results = f"Static\results\{d_id}.pdf"
        if Path(results).is_file():
            os.remove(results)
        result.save(results)
        # Store file name in DataBase
        m = g.model
        if m.InsertUploadedResult(d_id, results, session.get("duty_type")):
            return jsonify({"status": "success", "message": "Result Uploaded Successfully"})
        return jsonify({"status": "failed", "message": "Failed to Upload Result"})
    except Exception as e:
        print("Exception in GetResult", str(e))
        return jsonify({"error": str(e)}), 401
    
@app.route('/NewQualifications', methods=["GET"])
@jwt_required()
@my_decorator
def NewQualifications():

    print("in new: ", get_jwt_identity())
    m = g.model
    examiner_id = g.examiner_id

    qualifications = m.getDataofExaminer("qualification", examiner_id)
    print(qualifications)
    return jsonify(qualifications)

@app.route('/NewExperience', methods=["GET"])
@my_decorator
def NewExperience():
    m = g.model
    examiner_id = g.examiner_id

    experiences = m.getDataofExaminer("experience", examiner_id)
    return jsonify(experiences)

@app.route('/UpdateStatus')
@jwt_required()
@my_decorator
def UpdateStatus():
    try:
        d_id = session.get('duty_id')
        d_type = session.get("duty_Type")
        d_type = "Practicle Exam"
        # get Status
        data = request.get_json()
        selected_option = data['selection']
        if selected_option == "accept":
            status = 2
        elif selected_option == "reject":
            status = 3
        else:
            return jsonify({"status": "fail", "message": "Status has not Updated Successfully"}), 200
        m = model()
        if m.UpdateStatus(d_id, status, d_type):
            return jsonify({"status": "success", "message": "Status Updated Successfully"})
        return jsonify({"status": "fail", "message": "Status has not Updated Successfully"})
    except Exception as e:
        print("Exception in GetResult", str(e))
        return jsonify({"error": str(e)}), 401
    
# Running app
if __name__ == '__main__':
    app.run(debug=True,port=5001)
