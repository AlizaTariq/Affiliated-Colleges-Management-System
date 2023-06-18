import random
from flask import Flask, redirect,render_template,jsonify,request,session
import psycopg2
import psycopg2.extras
from Database import DatabaseModel
import json
from Classes import UserAdmin,DisplayDuty
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import os


import smtplib, ssl
from email.mime.text import MIMEText
from smtplib import SMTP_SSL as SMTP
from email.mime.multipart import MIMEMultipart
from asyncio.windows_events import NULL
from xml.etree.ElementTree import tostring

# Initializing flask app
app = Flask(__name__)

app.config.from_object("config")
app.secret_key=app.config["SECRET_KEY"]
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)


conn=psycopg2.connect(dbname=app.config["DATABASE"],user=app.config["DB_USER"],
password=app.config["DB_PASSWORD"],host=app.config["DB_HOST"])

dbModel= DatabaseModel(app.config["DATABASE"],app.config["DB_USER"],
    app.config["DB_PASSWORD"],app.config["DB_HOST"])

#dbModel.getExaminerName(4)
#dbModel.getCollegeReviewList()
#dbModel.getTeacherFeedbackList()

#dbModel.SendReqforDuty(1);

#Login Admin Function
@app.route('/loginData', methods=['POST','GET'])
def loginData():
    print("hey")
    data = request.get_json()
    email = data['username']
    password = data['password']
    adminObj=UserAdmin(email,password)
    print("admin obj is : ",adminObj)
    userStatus=False;
    userStatus=dbModel.checkAdminExist(adminObj)

    # Creating Access Token For authorization
    if(userStatus==True):
        session["uemail"]=adminObj.email
        session["upwd"]=adminObj.password
        access_token = create_access_token(identity=email)
        print("Admin Exist")
        
    else:
        print("Admin Not Exist")
        return jsonify(success=False)

    print("email--- : ",email,"  password = " ,password)
    return jsonify({'success':True,'access_token':access_token})


#Generate Practical Duties Function
@app.route('/generatePracDuties', methods=['GET'])
def generatePracDuties():
     try:
        status1=dbModel.checkDutyGenerateStatus()
        if(status1==True):
            dbModel.generateDuties();
            return jsonify({'success':True})

        return jsonify({'success':False})
     except Exception as e:
         print("Exception in genrate duties : ",e) 


#
def makePracDutyObj(list1):
    print("In make prac")
    listShowDuty=[]
    for duty in list1:
      list2=[]
      clgInfo=dbModel.getCollegeInfo(duty[0])
 
      semCrsInfo=dbModel.getSemInfo(duty[2],duty[3],duty[1])
     
      list2.append(clgInfo[0])
      list2.append(clgInfo[5])
      list2.append(duty[1])
      list2.append(duty[3])
      list2.append(semCrsInfo[1]) 
      list2.append(semCrsInfo[0])
      list2.append(duty[4])

      if(int(duty[5])==0):
        list2.append("Not Assigned")
      if(int(duty[5])==1):
        list2.append("Pending")
      if(int(duty[5])==2):
        list2.append("Accepted")
      if(int(duty[5])==3):
        list2.append("Rejected")
    

      print("\n\nlist in getallprac duties ---- > > > : \n\n",list2)

      listShowDuty.append(list2)
    return listShowDuty 


#Get All Practical Duties
@app.route('/getAllPraticalList')
def getAllPraticalList():
    list2=dbModel.getAllPraticalDuty()
    print("List of pract duty---------------->>>>>",list2)
    list1=makePracDutyObj(list2)
    return json.dumps(list1)


#Get Duty list of different types
@app.route('/getDutiesList',methods=['GET'])
def getDutiesList():
    type=request.args.get("typeduty")
    if int(type)==4:
       list2= dbModel.getAllPraticalDuty()
    else:
       list2=dbModel.getTypeDutiesList(int(type))


    list1=makePracDutyObj(list2)
    print("list1 iii--->> ",list1)
    return json.dumps(list1)


#Get Notifications of Admin
@app.route('/getAdminNtfList')
def getAdminNtfList():
    ntfList=dbModel.getAdminNotificationsPrac()
    notifications=[]
    i=0
    for list2 in ntfList:
        list1=[]
        exm=dbModel.getExaminerName(list2[0])
        profilepic=dbModel.getExmProfilePic(list2[0])
        for l1 in list2:
            list1.append(l1)
        list1.append(exm[0])
        list1.append(profilepic[0])
        
        notifications.append(list1)
        
    return json.dumps(notifications)


@app.route('/')
@app.route('/members')
def members():
    return {"members":["Member1","Member2","Member3"]}
    

#Get Course Information
@app.route("/getCrsInfo",methods=['POST','GET'])
def getCrsInfo():
    data = request.get_json()
    print("data is : ",data)

    college = data['ClgDropdownValue']
    dept = data['deptValue']
    course=data['courseValue']
   
    courseName=course.split(' - ')
    examiners=dbModel.getRankedExaminer(courseName[1])
    
    data['examiners']=examiners
    acId=dbModel.getCollegeId(college[0])
    data['practicalDutyId']=dbModel.getPracticalDutyId(acId,dept,course[0])

    print("data after exminer is : ",data)
    userdata = {
        'success':True,
        'data':data,
    }
    return jsonify(userdata)

#Send Mail To the practical duty Examiner
def sendMailPracDuty(mydata,pracId):
    try:
        examinerlist=mydata['examiner']
        college=mydata['college']
        dept=mydata['deptValue']
        courseInfo=mydata['courseValue']
        print(pracId)
        html_content = f"""\
                <html>
                <body>
                <body>
                        <p>Hi <b>{examinerlist[1]}</b>,<br><br>
                        Congratulations you are selected for the Practical Duty. Details are given below
                        <br><b>Course</b> : {courseInfo}
                        <br><b>College</b> : {college}
                        <br><b>Department</b> : {dept}<br>
                    
                        Thanks,<br><br>
                        Show Your willingness by replying.<br><br>
                        <a href="http://localhost:3001/RequestRecieved?id={pracId[0]}&type=Practical_Exam">
                            <button style="background-color: green; color: white; padding: 10px 20px;">View Details</button>
                        </a>                        
                        </p>
                    </body>
                </html>
            """

        # Create the email message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Practical Duty Assignment."
        message["From"] = "acms.duty@gmail.com"  # Replace with your email address
        message["To"] = examinerlist[2]  # Replace with the recipient's email address

        # Attach the HTML content to the message
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        # Send the email using Gmail SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("acms.duty@gmail.com", "lenwtfhxccnpghlt")  # Replace with your Gmail credentials
            server.sendmail(message["From"], message["To"], message.as_string())

        print("Email sent successfully.")
    except Exception as e :
        print("Mail cannot be send ",str(e))


#Send Practical Duty To The Examiner
@app.route("/sendPracticalDuty",methods=['POST'])
def sendPracticalDuty():
    print("\n\n\n\tIn send practical function")
    data = request.get_json()
    print("send Practical----pract data send is data is : ",data)
    examiner=data['examiner']
    college=data['college']

   
    collegeId=dbModel.getCollegeId(college)
    dept=data['deptValue']
    courseInfo=data['courseValue']
    moreInfo=data['moreInfo']

    course=courseInfo.split(" - ");
    print("pract data send is data is : ",data)

    print("CollegeId is : ",collegeId)
    pracId=dbModel.getPracticalDutyId(collegeId,dept,course[0])
    dbModel.savePracticalDuty(pracId,examiner[3],moreInfo)

    
    userdata = {
        'success':True,
        'data':data,
    }
    sendMailPracDuty(data,pracId)
    return jsonify(userdata)


#Prifile data 
@app.route("/getProfileInfoExm",methods=['POST'])
def getProfileInfoExm():
    print("\n\n\n\tIn profile info examiner function")
    data = request.get_json()
    print("In profile info examiner functions data is : ",data)
    email=data['email']
    if email is None:
        return jsonify({'success': False,data : NULL})

    profileData=dbModel.getProfileData(email)
    if profileData is None:
        return jsonify({'success': False,data : NULL})

    print("pract data send is data is : ",email)
    
    userdata = {
        'success':True,
        'data':profileData,
    }
    return jsonify(userdata)





#Update notifications of admin
@app.route('/updateAdminNtf', methods=['POST'])
def updateAdminNtf():
    print("in notfication updating")
    data = request.get_json()
    practId=data['practId']
    dbModel.updateAdminNotifications(int(practId))
    userdata = {
        'success':True,
        'data':data,
    }
    return jsonify(userdata)


#Update Course Imformation
@app.route("/updateCrs",methods=['GET'])
def updateCrs():
    clgName = request.args.get("clgname")
    dept1=request.args.get("dept")
   
    clgId=dbModel.getCollegeId(clgName)

    rdYear=dbModel.getCollegeRoadMapYear(clgId[0],dept1)
    crsList=dbModel.getCollegeCourses(clgId[0],dept1)
    print("Years are : ",rdYear)
    coursesInfo=[]
    for courseCode in crsList:
        print("Course is : ",courseCode)
        course1=dbModel.getCollegeCourseInfo(rdYear,dept1,courseCode)
        if course1!=None and len(course1)!=0:
            coursesInfo.append(course1[1]+" - "+course1[0])

    return jsonify(coursesInfo)

#Get Examiner Detail    
@app.route("/getTeacherDetail",methods=['GET'])
def getTeacherDetail():
    acId=request.args.get("acId")
    dept=request.args.get("dept")
    crsCode=request.args.get("crsCode")
    exmId=dbModel.getTeacherId(acId,dept,crsCode)
    if(exmId[0]==None or len(exmId)==0):
        print("exm id null")
        return ({"success":"false",
                    "examiner":None})

    print("examiner Id is : ",exmId)
    teacher=dbModel.getTeacherDetail(exmId)
    print("teacher detail is : ",teacher)
    return({"success":"true",
            "examiner":teacher
    })

#Get List of all Colleges
@app.route("/getAllCollegeList")
def getAllCollegeList():
    clgList=dbModel.getAllCollege()
    return json.dumps(clgList)



#Get College Review of Affiliated College
@app.route('/getCollegeReview')
def getCollegeReview():
    list2=dbModel.getCollegeReviewList()
    print("List ofgetCollegeReview---------------->>>>>",list2)
    finalList=[]
    for list1 in list2:
        infoList=[]
        clgInfo=dbModel.getCollegeInfo(list1[3]) #index 5 college name
        teacherInfo=dbModel.getTeacherDetail(list1[1])
        infoList.append(list1[0]) #college review id
        infoList.append(teacherInfo[0]) #examiner Id
        infoList.append(teacherInfo[1]) #examiner name
        infoList.append(clgInfo[5]) #college name
        infoList.append(list1[2]) #complain
        finalList.append(infoList)
    
    return json.dumps(finalList)


#Get Feedback of Teacher
@app.route('/getTeacherFeedback')
def getTeacherFeedback():
    teacherFeedBackList=dbModel.getTeacherFeedbackList()
    print("List getTeacherFeedback---------------->>>>>",teacherFeedBackList)
    return json.dumps(teacherFeedBackList)


#Get List of Top 50 Ranked Examiners
@app.route('/getRankedExmList')
def getRankedExmList():
    rankedList=dbModel.getRankedExaminerList()
    print("List rankedList---------------->>>>>",rankedList)
    return json.dumps(rankedList)


#Get List Affiliated Colleges
@app.route('/getAffiliatedColleges')
def getAffiliatedColleges():
    collegeList=dbModel.getCollegesList()
    print("CollegesList---------------->>>>>",collegeList)
    return json.dumps(collegeList)


#Get getCountDetail
@app.route('/getCountDetail')
def getCountDetail():
    list1=[]
    #[48, 27, 14, 6, 1, 3, 5, 6, 2]
    list1.append(dbModel.getPracDutyCount())

    list1.append(dbModel.getPracDutyCountType(0)) #not assigned
    list1.append(dbModel.getPracDutyCountType(1)) #pending
    list1.append(dbModel.getPracDutyCountType(2)) # accepted
    list1.append(dbModel.getPracDutyCountType(3)) #rejected

    list1.append(dbModel.getExamDutyCount())
    list1.append(dbModel.getExaminerCount())

    list1.append(dbModel.getCollegeCount())
    list1.append(dbModel.getDeptCount())

    print("\n\nlist1---------------",list1)
   # collegeList=dbModel.getCollegesList()
    #print("CollegesList---------------->>>>>",collegeList)
    return json.dumps(list1)


###################################################################################

@app.route('/sendDuty',methods = ["GET","POST"])  #Sending the duty to Examiner and change the status = 1 i.e. assigned.
def sendDuty():
    data = request.get_json()
    string = dbModel.SendDuty(data['Id'])
    if string != None:
        return "success"
    return "'key': 'empty'"

@app.route('/createDuty',methods = ["GET","POST"]) #Creating Exam_duty with status = 0 i.e. not assigned.
def createDuty():
    print("In Create app.py")
    data = request.get_json()
    List=[]
    print(data)
    List.append(int(data[0].split("_")[0]))
    List.append(data[0].split("_")[1])
    List.append((data[1]).lower())
    List.append(data[2])
    List.append(int(data[3].split("_")[0]))
    List.append(data[3].split("_")[1])
    id = dbModel.CreateDuty(List)
    print(id)
    if id != None:
        return jsonify(id)
    return "'key': 'empty'"

@app.route('/getDutyDetail' ,methods = ["GET","POST"]) #Getting duty detail of specific duty_id.
def getDutyDetail():
    print("In getDutyDetail aap.py")
    data = request.get_json()
    print("DataID: ",data)
    List = dbModel.getDuty(data['Id'])
    print("List: ",List)
    dutyDetail = dbModel.getDutyDetailToBeSend(data['Id'])
    print(dutyDetail)
    if dutyDetail != None:
        return jsonify(dutyDetail)
    return "'key': 'empty'" 

@app.route('/getDutiesStatus', methods = ['GET','POST'])#Getting duty detail of specific status.
def getDutiesStatus():
    type=request.args.get("typeduty")
    if int(type)==4:
       list2= dbModel.getAllDuties()
    else:
       list2=dbModel.getDutiesListType(int(type))
    if list2 != None:
        return jsonify(list2)
    return "'key': 'empty'"

@app.route('/getNotAssignedDuties' ,methods = ["GET"]) #Getting duties with status = 0 i.e. not assigned.
def getNotAssignedDuties():
    print("In getNotAssignedDuties aap.py")
    List = dbModel.getNotAssignedDuties()
    print("List: ",List)
    if List != None:
        return jsonify(List)
    return "'key': 'empty'" 

@app.route('/getAllDuties' ,methods = ["GET"]) #Getting all duties i.e. assigned, accepted, rejected.
def getAllDuties():
    print("In getAllDuties aap.py")
    List = dbModel.getAllDuties()
    print("List: ",List)
    if List != None:
        return jsonify(List)
    return "'key': 'empty'"

@app.route('/getAllExaminerName',methods = ["GET","POST"]) #Getting all Examiner Details with given examiner_course.
def getAllExaminerName():
    courseName = request.get_json()
    if len(courseName)!=0:
         NameList  = dbModel.getExaminerNameAccordingToCourseSelection(courseName['courseName'].split("_")[1])
   
    if NameList != None:
        return jsonify(NameList)
    return "'key': 'empty'"

@app.route('/getAllData', methods =["GET"]) #Getting current followed roadmapYear and current enrolled Departments.
def getAllData():
    List =[] 
    List.append(dbModel.GetCurrentFollowedRoadMapYear())
    List.append(dbModel.GetDepartments())
    if List != None:
        return jsonify(List)
    return "'key': 'empty'" 

@app.route('/getAllCourses',methods = ["GET","POST"]) #Getting all courses from db of specific with duty_status = notAssigned.
def getAllCourses():
    department = request.get_json()
    NameList = []
    NameList  = dbModel.getCoursesName((department['department']).lower(),(department['roadMapYear']))
    if NameList != None:
        return jsonify(NameList)
    return "'key': 'empty'"

@app.route('/getDataFromReact',methods=["POST"]) #Getting roadmap .csv file from react and save it to db.
def getDataFromReact():
    if request.method == 'POST':
        FileName=request.form['fileName']
        dataOfFile=request.form['ArrayList']
        DictionaryOfdata=json.loads(dataOfFile)
        print(FileName)
        # for e in DictionaryOfdata:
            # dbModel.insertRoadmap(e)
        # DictionaryOfdata[0]
        return "Hello"
    print('Wrong')
    return "Hello"

@app.route('/set_data',methods = ["GET"]) #Sending roadmap data/list to frontend.
def set_data():
    List = dbModel.getRoadMapList()
    print("posting......")
    if List != None:
        return jsonify(List)
    return "'key': 'empty'"

@app.route('/send_data', methods=["POST","GET"])  #getting roadmap detail of given course_id.
def send_data():
    course = None
    id = request.get_json()
    course = dbModel.getcourse(id)
    print(course)
    if request.method == "POST":
        return jsonify(course)
    else:
        return jsonify(course)

@app.route('/put_data', methods=["GET"]) #getting roadmap detail of given course_id.
def put_data():
    course = None
    id = request.get_json()
    course = dbModel.getcourse(id)
    return jsonify(course)


# Running app
if __name__ == '__main__':
    app.run(debug=True)