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
from pathlib import Path
# pip install flask_mail
from flask_mail import Mail, Message
from BusinessObjects import *
from werkzeug.security import generate_password_hash, check_password_hash
# pip install flask_jwt_extended
from flask_jwt_extended import *
import requests
import re
# pip install phonenumbers                                      
import phonenumbers
import os
import smtplib
import ssl
import random
import string
import time


app = Flask(__name__)
app.config['SECRET_KEY'] = "MYSECRETKEY"
# cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_object("config")
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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

def is_valid_email(email):
    api_key = 'f7b74b5a429c9a8920c793907a0d0600'
    url = f'http://apilayer.net/api/check?access_key={api_key}&email={email}'

    response = requests.get(url)
    data = response.json()

    if 'smtp_check' in data and data['smtp_check']:
        return True
    else:
        return False

def is_phone_number_present(phone_number):
    try:
        parsed_number = phonenumbers.parse(phone_number, None)
        return phonenumbers.is_valid_number(parsed_number)
    except phonenumbers.phonenumberutil.NumberParseException:
        return False

def is_cnic_number_present(cnic_number):
    pattern = r'^\d{5}-\d{7}-\d$'  # CNIC format: 00000-0000000-0
    return re.match(pattern, cnic_number) is not None

def essentials(func):
    def decorated(*args, **kwargs):
        try:
            g.model = model()
            if request.headers.get('authorization') and get_jwt_identity() != None:
                g.user_id = get_jwt_identity()
                g.examiner_id = g.model.getExaminerID(g.user_id)
                
            api_result = func(*args, **kwargs)
            # close connections
            g.model.__del__()
        except Exception as e:
            print("Exception in @essentials", str(e))
            raise e
        return api_result
    decorated.__name__ = func.__name__
    return decorated

@app.route('/SignUpPersonalInfo', methods=["POST"])
@essentials
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
        usr_profile_pic = "..\\front-end\\src\\Static\\ProfilePics\\empty.png"
        usr_active_status = True
        _hashed_password = generate_password_hash(usr_password)

        if not is_valid_email(usr_email) :
            return jsonify({"status": "fail", "message": "Invalid Email"})
        
        if not is_phone_number_present(usr_phone) :
            return jsonify({"status": "fail", "message": "Phone number is not valid"})
        
        if not is_cnic_number_present(usr_cnic) :
            return jsonify({"status": "fail", "message": "CNIC is not valid"})

        # set data in obj
        data = User(usr_name, usr_password, usr_phone, usr_cnic, usr_profile_pic, usr_address,
               usr_email, usr_active_status, usr_bio, usr_gender)
        
        # Insertion in database
        m = g.model
        if m.checkEmailExist(usr_email):
            return jsonify({"status": "fail", "message": "Email already exists"})
    
        if m.checkCnicExist(usr_cnic):
            return jsonify({"status": "fail", "message": "CNIC already exists"})

        user_id = m.InsertUser(data)  # insertion function return userid

        if user_id != 0:
            # sending email
            # verification_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))
            # verification_link = request.url_root + 'verify?code=' + verification_code + '&verify=' + generate_password_hash("SHHH" + verification_code)
            # message = Message('Verify your email', recipients=[usr_email])
            # message.html = f'<div style="background-color: #221e1e; border-radius: 20px; color: wheat; font-family: Tahoma, Verdana, sans-serif; padding: 10px;"><h1 style="text-align: center;"><strong>ٱلسَّلَامُ عَلَيْكُمْ <br /></strong></h1><h2 style="text-align: center;"><span style="color: brown;"> {usr_name} </span></h2><hr/><p>Welcome to Exam Portal, before being able to use your account you need to verify that this is your email address by clicking here: {verification_link}</p><p style="text-align: left;"><span style="color: brown;">If you do not recognize this activity simply ignore this mail.&nbsp;</span></p><p>Kind Regards,<br /><span style="color: brown;"><strong>PUCIT Exam Portal</strong></span></p></div>'
            # mail.send(message)

            # Creating Access Token
            access_token = create_access_token(identity=user_id[0], expires_delta=timedelta(hours=24))
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"status": "fail", "message": "Error in insertion"})

    except Exception as e:
        print("Exception in SignUpPersonalInfo", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/SignUpExaminerInfo', methods=["POST", "GET"])
@jwt_required()
@essentials
def SignUpExaminerInfo():
    try:
        # get data from form
        institution = request.form.get("institution")
        user_id = g.user_id

        # Get File and Save in a directory
        f = request.files.get("resume")
        resume = f"..\\front-end\\src\\Static\\Resumes\\{user_id}.pdf"
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
        return jsonify({"status": "fail", "message": "Error in insertion"})

    except Exception as e:
        print("Exception in SignUpExaminerInfo", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/ExaminerQualification', methods=["POST", "GET"])
@jwt_required()
@essentials
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
        transcript = f'''..\\front-end\\src\\Static\\transcripts\\{datetime.now().strftime("%d%m%Y%H%M%S")},{examiner_id}.pdf'''
        if Path(transcript).is_file():
            os.remove(transcript)
        f.save(transcript)

        data = qualification(examiner_id, degree_title, transcript,
                             institution, starting_date, ending_date)

        # Insertion in DataBase

        if m.InsertExaminerQualification(data) != False:
            return jsonify({"message": "Okay"}), 200
        return jsonify({"status": "fail", "message": "Error in insertion"})

    except Exception as e:
        print("Exception in ExaminerQualification", str(e))
        return jsonify({"status": "fail", "message": str(e)})
   
@app.route('/ExaminerExperience', methods=["POST", "GET"])
@jwt_required()
@essentials
def ExaminerExperience() :
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
        ExperianceLetters = f'..\\front-end\\src\\Static\\ExperianceLetters\\{datetime.now().strftime("%d%m%Y%H%M%S")}_{examiner_id}.pdf'
        if Path(ExperianceLetters).is_file():
            os.remove(ExperianceLetters)
        f.save(ExperianceLetters)

        data = experience(examiner_id, job_title, ExperianceLetters,
                          organization, reference_email, starting_date, ending_date)

        if m.InsertExaminerExperience(data) != False:
            return jsonify({"message": "Okay"}), 200
        return jsonify({"status": "fail", "message": "Error in insertion"})

    except Exception as e:
        print("Exception in ExaminerExp", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/verify')
@jwt_required()
@essentials
def verify():
    print("in verification route: ")
    try:
        m = g.model
        examiner_id = g.examiner_id

        code = request.args.get('code')
        verify =  request.args.get('verify')

        if check_password_hash(verify, "SHHH" + code):
            m.setUserVerified(examiner_id)
            return redirect("http://localhost:3000")
        else:
            return 'Invalid verification code!'

    except Exception as e:
        print("Exception in verify", str(e))
        return str(e)

@app.route('/AddExaminerCourse', methods=["POST","GET"])
@jwt_required()
@essentials
def AddExaminerCourse():
    try :
        data = request.json['data']
        courses = data.split(",")
        examiner_id = g.examiner_id
        m = g.model
        if (courses.__len__() > 1) :
            e_courses = m.getExaminerCourses(examiner_id)
            examiner_courses = [item[0] for item in e_courses]
            for i in range (1, courses.__len__()) :
                if not examiner_courses.__contains__(courses[i]) :
                    if not m.insertExaminerCourses(examiner_id, courses[i]) :
                        return jsonify({"status": "fail", "message": "Insertion issue"})
        
        verification_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))
        verification_link = request.url_root + 'verify?code=' + verification_code + '&verify=' + generate_password_hash("SHHH" + verification_code)

        # Insertion in dataBase
        email = m.getUserEmail(g.user_id)

        message = Message('Verify your email', recipients=[email])
        message.html = f'<div style="background-color: #221e1e; border-radius: 20px; color: wheat; font-family: Tahoma, Verdana, sans-serif; padding: 10px;"><h1 style="text-align: center;"><strong>ٱلسَّلَامُ عَلَيْكُمْ <br /></strong></h1><h2 style="text-align: center;"><span style="color: brown;"> {m.getUserEmail(g.user_id)} </span></h2><hr/><p>Welcome to Exam Portal, before being able to use your account you need to verify that this is your email address by clicking here: {verification_link}</p><p style="text-align: left;"><span style="color: brown;">If you do not recognize this activity simply ignore this mail.&nbsp;</span></p><p>Kind Regards,<br /><span style="color: brown;"><strong>PUCIT Exam Portal</strong></span></p></div>'
        # print(":)")
        mail.send(message)
        # print(":)2")
        return jsonify({"message": "Okay"}), 200
    except Exception as e:
        print("Exception in add course to examiner ",str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/ExaminerLogin', methods=["POST"])
@essentials
def ExaminerLogin():
    try:
        # Fetch data from form
        email = request.json.get("email")
        password = request.json.get("password")
        # Verification
        m = g.model
        examiner_id = m.getExaminerID(m.getUserID(email))
        if not (m.checkExaminerVerified(examiner_id)):
            return jsonify({"status": "fail", "message": "Verify email first"})

        if not (m.checkEmailExist(email)):
            return jsonify({"status": "fail", "message": "Email does not exist"})

        usr_pass = m.getUserPassword(email)
        if not (check_password_hash(usr_pass, password)):
            return jsonify({"status": "fail", "message": "Invalid Password"})

        examiner_id = m.ValidatePassword(email, usr_pass)
        if (examiner_id > 0):
            access_token = create_access_token(identity=m.getUserID(email), expires_delta=timedelta(hours=24))
            return jsonify(access_token=access_token), 200
        return jsonify({"status": "fail", "message": "Invalid Password"})
    except Exception as e:
        print("Exception in Login", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/profile', methods=['GET'])
@jwt_required()
@essentials
def profile():
    try:
        m = g.model
        examiner_id = g.examiner_id
        user_ = m.getDataofUser(g.user_id)
        examiner_ = m.getDataofExaminerForProfile(examiner_id)
        data = {
            "personal_details": {
                "usr_name": user_[0],
                "usr_cnic": user_[1],
                "usr_phoneno": user_[2],
                "usr_address": user_[3],
                "usr_email": user_[4],
                "usr_gender": user_[5],
                "usr_bio": user_[6],
                "usr_active_status": user_[8],
                "usr_profile_pic": user_[7],
                "institution": examiner_[0],
                "ranking": examiner_[1],
                "acceptance_count": examiner_[2],
                "rejection_count": examiner_[3],
                "resume": examiner_[4]
            }
        }
        return jsonify(data), 200
    except Exception as e:
        print("Exception in profile", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/notifications', methods=["POST", "GET"])
@jwt_required()
@essentials
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
            i.append("Practical_Exam")
            data.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory_Paper")
            data.append(i)

        data.sort(key=lambda x: x[0], reverse=True)
        # print(data)
        return jsonify(data), 200
    except Exception as e:
        print("Exception in notifications", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route("/DutyDetails", methods=['POST', 'GET'])
@jwt_required()
@essentials
def DutyDetails():                  # moving from request page to duty details
    try:
        id = request.args.get("Id")
        type_ = request.args.get("type")
        
        m = g.model
        # => using course code get crs code, crs title,
        # => request date, paper upload deadline from exam/duty table
        # => using rd_id get crs_book and crs_outline from both tables
        # => get prac_date, time and institute by using ac_id get name and location of
        # institute from affiliated_colleges table
        dutyDetails = m.getDutyDetails(id, type_)
        return jsonify(dutyDetails), 200
    except Exception as e:
        print("Exception in DutyDetails", str(e))
        raise e
        # return jsonify({"status": "fail", "message": str(e)})

@app.route('/home', methods=["POST", "GET"])
@jwt_required()
@essentials
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
            i.append("Practical_Exam")
            duties.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory_Paper")
            duties.append(i)

        duties.sort(key=lambda x: x[1], reverse=True)
        return jsonify(duties)
    except Exception as e:
        print("Exception in home", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/PaperPendingDuty', methods=['GET'])
@jwt_required()
@essentials
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
            i.append("Practical_Exam")
            duties.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory_Paper")
            duties.append(i)

        duties.sort(key=lambda x: x[1], reverse=True)
        return jsonify(duties)
    except Exception as e:
        print("Exception in PaperPendingDuty", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/ResultUploadPending', methods=['GET'])
@jwt_required()
@essentials
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
            i.append("Practical_Exam")
            duties.append(i)

        for i in examDuties:
            i = list(i)
            i.append("Theory_Paper")
            duties.append(i)

        duties.sort(key=lambda x: x[1], reverse=True)
        return jsonify(duties)
    except Exception as e:
        print("Exception in ResultUploadPending", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route("/GetPaper", methods=['POST'])
@jwt_required()
@essentials
def GetPaper():
    try:
        id = request.form.get("Id")
        type_ = request.form.get("type")
        paper = request.files.get("Paper")
        # Store paper in local directory
        papers = f"..\\front-end\\src\\Static\\papers\\{id}.pdf"
        if Path(papers).is_file():
            os.remove(papers)
        paper.save(papers)
        # store nme of the paper in the DataBase
        m = g.model
        if m.InsertUploadedPaper(id, papers, type_):
            return jsonify({"status": "success", "message": "Paper Uploaded Successfully"})
        return jsonify({"status": "failed", "message": "Failed to Upload Paper"})
    except Exception as e:
        print("Exception in GetPaper", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route("/GetResult", methods=['POST'])
@jwt_required()
@essentials
def GetResult():
    try:
        id = request.form.get("Id")
        type_ = request.form.get("type")
        result = request.files.get("result")
        # Store result in local directory
        results = f"..\\front-end\\src\\Static\\results\\{id}.pdf"
        if Path(results).is_file():
            os.remove(results)
        result.save(results)
        # store nme of the result in the DataBase
        m = g.model
        if m.InsertUploadedResult(id, results, type_):
            return jsonify({"status": "success", "message": "Result Uploaded Successfully"})
        return jsonify({"status": "failed", "message": "Failed to Upload result"})
    except Exception as e:
        print("Exception in Getresults", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/NewQualifications', methods=["GET"])
@jwt_required()
@essentials
def NewQualifications():
    m = g.model
    examiner_id = g.examiner_id

    qualifications = m.getDataofExaminer("qualification", examiner_id)
    return jsonify(qualifications)

@app.route('/NewExperience', methods=["GET"])
@jwt_required()
@essentials
def NewExperience():
    m = g.model
    examiner_id = g.examiner_id

    experiences = m.getDataofExaminer("experience", examiner_id)
    return jsonify(experiences)

@app.route('/AllCourses', methods=["GET"])
@jwt_required()
@essentials
def AllCourses():
    m = g.model
    courses = m.getAllCoursesNames()
    return jsonify(courses)

@app.route('/UpdateStatus', methods=["POST"])
@jwt_required()
@essentials
def UpdateStatus():
    try:
        id = request.json.get("Id")
        type_ = request.json.get("type")
        selected_option = request.json.get('selection')
        
        if selected_option == "accept":
            status = 2
        elif selected_option == "reject":
            status = 3
        else:
            return jsonify({"status": "fail", "message": "Status has not Updated Successfully"}), 200
        
        m = g.model
        if m.UpdateStatus(id, status, type_, g.examiner_id):
            return jsonify({"status": "success", "message": "Status Updated Successfully"})
        return jsonify({"status": "fail", "message": "Status has not Updated Successfully"})
    except Exception as e:
        print("Exception in GetResult", str(e))
        return jsonify({"status": "fail", "message": str(e)})

@app.route('/UpdateExaminerCourse', methods=["POST","GET"])
@jwt_required()
@essentials
def UpdateExaminerCourse():
    try :
        data = request.json['data']
        courses = data.split(",")
        examiner_id = g.examiner_id
        m = g.model
        if (courses.__len__() > 1) :
            e_courses = m.getExaminerCourses(examiner_id)
            examiner_courses = [item[0] for item in e_courses]
            for i in range (1, courses.__len__()) :
                if not examiner_courses.__contains__(courses[i]) :
                    if not m.insertExaminerCourses(examiner_id, courses[i]) :
                        return jsonify({"status": "fail", "message": "Courses have not been updated try later."})
        
        return jsonify({"message": "Data Updated"}), 200
    except Exception as e:
        print("Exception in update course to examiner ",str(e))
        return jsonify({"status": "fail", "message": "Courses have not been updated try later."})

@app.route('/UpdateExaminer', methods=["POST"])
@jwt_required()
@essentials
def UpdateExaminer():
    try:
        user_id = g.user_id
        m = g.model
        examiner_id = g.examiner_id
        # get data from form
        usr_name = request.form.get("usr_name")
        usr_cnic = request.form.get("usr_cnic")
        usr_email = request.form.get("usr_email")
        usr_address = request.form.get("usr_address")
        usr_bio = request.form.get("usr_bio")
        usr_gender = request.form.get("usr_gender")
        usr_phone = request.form.get("usr_phone")
        usr_active_status = request.form.get("usr_active_status")

        p = request.files.get("profile")
        profile = f"..\\front-end\\src\\Static\\ProfilePics\\{user_id}.png"
        if p != None:
            if Path(profile).is_file():
                os.remove(profile)
            p.save(profile) 

        f = request.files.get("resume")
        if f != None:
            resume = f"..\\front-end\\src\\Static\\Resumes\\{user_id}.pdf"
            if Path(resume).is_file():
                os.remove(resume)
            f.save(resume)    
            

        user_ = m.getDataofUser(user_id)
        if usr_email != user_[4] and not is_valid_email(usr_email) :
            return jsonify({"status": "fail", "message": "Invalid Email"})
        
        if usr_phone != user_[2] and not is_phone_number_present(usr_phone) :
            return jsonify({"status": "fail", "message": "Phone number is not valid"})
        
        if usr_cnic != user_[1] and not is_cnic_number_present(usr_cnic):
            return jsonify({"status": "fail", "message": "CNIC is not valid"})

        if not m.updateUser(user_id, usr_name, usr_cnic, usr_email, usr_address, usr_bio, usr_gender, usr_phone, usr_active_status, profile):
                return jsonify({"status": "fail", "message": "Data has not updated try again."})

        return jsonify({"status": "success", "message": "Data Updated"})
        
    except Exception as e:
        print("Exception in Update user", str(e))
        return jsonify({"status": "fail", "message": "Data has not updated try again."})

# Running app
if __name__ == '__main__':
    app.run(debug=True)
