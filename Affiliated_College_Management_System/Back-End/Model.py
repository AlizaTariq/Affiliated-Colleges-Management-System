from BusinessObjects import *
import psycopg2  # pip install psycopg2


class model:
    # Constructor
    def __init__(self):
        try:
            self.connection = psycopg2.connect(
                database="ACMS",  # write your Dbname
                host="localhost",
                user="postgres",
                password="Ayesha@1306",  # write your dbPassword
                # password="aiman12345",  # write your dbPassword
                port="5432")
        except Exception as e:
            self.connection = None
            print(str(e))

    # Destructor
    def __del__(self):
        if self.connection != None:
            self.connection.close()

    # insert into user table and returning user id of that row
    def InsertUser(self, user):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''insert into users(usr_name,usr_password,usr_phoneno,usr_profile_pic,usr_cnic,usr_address,usr_email,usr_active_status,usr_bio,usr_gender) 
	                        values (%s,%s,%s,%s ,%s,%s,%s,%s,%s,%s) returning usr_id;'''
                cursor.execute(query,(user.usr_name, user.usr_password,user.usr_phoneno,user.usr_profile_pic, user.usr_cnic,user.usr_address,user.usr_email,user.usr_active_status,user.usr_bio,user.usr_gender))
                id = cursor.fetchone()
                self.connection.commit()
                self.ur_id = id
                return id
            else:
                return 0
        except Exception as e:
            print("Exception in insertExaminer", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

    # Returns userID accross UK email
    def getUserID(self, email):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''select usr_id from users where usr_email = %s;'''
                cursor.execute(query,(email,))
                id = cursor.fetchone()
                return id[0]
            else:
                return 0
        except Exception as e:
            print("Exception in getUserID", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

    def getUserEmail(self, id):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''select usr_email from users where usr_id = %s;'''
                cursor.execute(query, (id,))
                email = cursor.fetchone()
                return email[0]
            else:
                return 0
        except Exception as e:
            print("Exception in getUserEmail", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

    # def Returns hashed Password 
    def getUserPassword(self, email):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''select usr_password from users where usr_email = %s;'''
                cursor.execute(query , (email,))
                password = cursor.fetchone()
                return password[0]
            else:
                return 0
        except Exception as e:
            print("Exception in getUserPassword", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

    # Returns Examiner ID of a user if he is examiner not admin
    def getExaminerID(self, userid):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''select examiner_id from public.examiner where user_id = %s;'''
                cursor.execute(query,(userid,))
                id = cursor.fetchall()
                return id[0][0]
            else:
                return 0
        except Exception as e:
            print("Exception in getExaminerID", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

    # Insert examiner and returns it's id
    def InsertExaminer(self, examiner):
        cursor = None
        try:
            if self.connection != None:  # there should be a email check weather the user exists or not
                cursor = self.connection.cursor()
                query = '''insert into public.examiner(user_id,institution,"availability","ranking","resume","acceptance_count","rejection_count","verified") 
                            values(%s, %s, %s,%s,%s,%s,%s,%s) returning examiner_id;'''
                cursor.execute(query,(examiner.user_id,examiner.institution,examiner.availability,examiner.ranking,examiner.resume,examiner.acceptance_count,examiner.rejection_count,examiner.verified))
                id = cursor.fetchone()
                self.connection.commit()
                self.exmnr_id = id
                return id
            else:
                return 0
        except Exception as e:
            print("Exception in insertExaminer", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

    # Check is email exists in user table or not
    def checkEmailExist(self, usr_email):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = "select usr_email from users;"
                cursor.execute(query)
                emailList = cursor.fetchall()
                for e in emailList:
                    if usr_email == e[0]:
                        return True
                return False
            else:
                return False
        except Exception as e:
            print("Exception in checkEmailExist", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # Check is CNIC exists in user table or not
    def checkCnicExist(self, usr_CNIC):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = "select usr_cnic from users;"
                cursor.execute(query)
                cnicList = cursor.fetchall()
                for e in cnicList:
                    if usr_CNIC == e[0]:
                        return True
                return False
            else:
                return False
        except Exception as e:
            print("Exception in checkCnicExist", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # Validate password 
    def ValidatePassword(self, email, password):  # return examiner id
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''select usr_password from users where "usr_email" = %s;'''
                cursor.execute(query , (email,))
                pwd = cursor.fetchone()
                if (pwd[0].strip() == password.strip()):
                    uID = model.getUserID(self, email)
                    eID = model.getExaminerID(self, uID)
                    return eID
                return 0
            else:
                return 0
        except Exception as e:
            print("Exception in ValidatePassword", str(e))
            return 0
        finally:
            if cursor != None:
                cursor.close()

        return True

    # Insert Qualification of user
    def InsertExaminerQualification(self, qualification):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''insert into public.qualification("examiner_id", "degree_title", "institution", "starting_date", "ending_date","transcript") 
                values(%s,%s,%s,%s,%s,%s);'''
                cursor.execute(query,(qualification.examiner_id,qualification.degree_title,qualification.institution,qualification.starting_date,qualification.ending_date,qualification.transcript))
                self.connection.commit()
                return True
        except Exception as e:
            print("Exception in insertExaminerQualification", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # Insert Experiance of user
    def InsertExaminerExperience(self, experience):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = '''insert into public.experience("examiner_id", "job_title", "organization", "reference_email", "starting_date", "ending_date","experiance_letter") 
                        values(%s,%s, %s,%s ,%s,%s,%s);'''
                cursor.execute(query,(experience.examiner_id,experience.job_title,experience.organization,experience.reference_email,experience.starting_date,experience.ending_date,experience.ExperianceLetter))
                self.connection.commit()
                return True
        except Exception as e:
            print("Exception in insertExaminerExperience", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # get data of any table
    def getData(self, tableName): 
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = f'''select * from public.{tableName};'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getData", str(e))
            return []
        finally:
            if cursor != None:
                cursor.close()

    # Delete data of Experiance and qualification of a user
    def deleteAllQuaAndExp(self, tableName, exainerID):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = f'''delete from {tableName} where examiner_id = %s;'''
                cursor.execute(query,(exainerID,))
                self.connection.commit()
                return True
            else:
                return False
        except Exception as e:
            print("Exception in deleteUser", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # Delete Examiner
    def deleteExaminer(self, email):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                userID = model.getUserID(email)
                ExmnrID = model.getExaminerID(userID)

                # all qualification and experience are deleted before deleting the examiner...
                model.deleteAllQuaAndExp("public.qualification", ExmnrID)
                model.deleteAllQuaAndExp("public.experience", ExmnrID)

                query = '''delete from examiner where user_id = %s;'''
                # on  which basis examiner is deleted...  userid????
                # should we delete user as well... if examiner is deleted...???
                cursor.execute(query,(userID,))
                self.connection.commit()
                return True
            else:
                return False
        except Exception as e:
            print("Exception in deleteExaminer", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # delete user
    def deleteUser(self, email):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                # problem:  examiner not automatically deleted if user deleted...
                # So deleting examiner first...
                model.deleteExaminer(email)
                query = '''delete from users where usr_email = %s;'''
                cursor.execute(query,(email,))
                self.connection.commit()
                return True
            else:
                return False
        except Exception as e:
            print("Exception in deleteUser", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()
 
    # Get data of specific examiner
    def getDataofExaminerForProfile(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select institution, ranking, acceptance_count, rejection_count, resume from public."examiner" where examiner_id = %s;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data[0]
        except Exception as e:
            print("Exception in getDataofExaminerForProfile", str(e))
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data of specific examiner from any table
    def getDataofExaminer(self, tableName, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = f"select * from public.{tableName} where examiner_id = %s;"
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getDataofExaminer", str(e))
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data of specific user
    def getDataofUser(self, usr_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''SELECT usr_name, usr_cnic, usr_phoneno, usr_address, usr_email, usr_gender,usr_bio, usr_profile_pic,usr_active_status FROM public.users where usr_id = %s;'''
                cursor.execute(query,(usr_id,))
                data = cursor.fetchall()
                return data[0]
        except Exception as e:
            print("Exception in getDataofUser", str(e))
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Notifications page
    def getRecievedPracRequests(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and prac_duty_status = 1;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getRecievedPracRequests")
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Notifications page
    def getRecievedTheoryRequests(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and status_req = 1;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getRecievedTheoryRequests")
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Home page
    def getAcceptedPracDuties(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and prac_duty_status = 2 and paper_upload_deadline > CURRENT_DATE;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getHomePracRequests: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Home page
    def getAcceptedTheoryDuties(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and status_req = 2 and paper_upload_deadline > CURRENT_DATE;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getAcceptedTheoryDuties: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Paper pending page
    def getPracPaper_Pending(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and prac_duty_status = 2 and paper_upload_deadline < CURRENT_DATE and prac_date > CURRENT_DATE;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getPracPaper_Pending: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Paper pending page
    def getTheoryPaper_Pending(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and status_req = 2 and paper_upload_deadline < CURRENT_DATE and paper_date > CURRENT_DATE;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getTheoryPaper_Pending: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Result upload page
    def getPracResult_Pending(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and prac_duty_status = 2 and result_upload_deadline > CURRENT_DATE and prac_date <= CURRENT_DATE;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getPracResult_Pending: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Get data for Result upload page
    def getTheoryResult_Pending(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = %s and status_req = 2 and result_upload_deadline > CURRENT_DATE and paper_date <= CURRENT_DATE;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getTheoryResult_Pending: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Get details of a specific duty
    def getDutyDetails(self, dtId, dtType):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                if (dtType == "Practical_Exam"):
                    query = '''select prac_date, paper_upload_deadline, prac_ass_date, prac_time, ac_id, rd_id from practical_duty where prac_duty_id = %s;'''
                elif (dtType == "Theory_Paper"):
                    query = '''select paper_date, paper_upload_deadline, request_date, rd_id from exam_duty where exam_duty_id = %s;'''
                cursor.execute(query,(dtId,))
                data = cursor.fetchall()
                # get roadmap id
                rdId = data[len(data) - 1][5]
                query = '''select rd_crs_code, rd_crs_name, rd_crs_book, rd_crs_outlline from roadmap where rd_id = %s;'''
                cursor.execute(query,(rdId,))
                rdData = cursor.fetchall()
                acData = []
                if dtType == "Practical_Exam":
                    acID = data[data.__len__() - 1][4]
                    query = '''select ac_name, ac_address from affiliated_colleges where ac_id = %s;'''
                    cursor.execute(query,(acID,))
                    acData = cursor.fetchall()
                    # if len(acData) > 0:
                    l = []
                    for i in range(4):
                        l.append(str(data[0][i]))

                    l = tuple(l)
                    combinedList = l + rdData[0] + acData[0]
                else:
                    l = []
                    for i in range(3):
                        l.append(str(data[0][i]))
                    l.append("")
                    l = tuple(l)
                    combinedList = l + rdData[0]
                return combinedList
        except Exception as e:
            print("Exception in getDutyDetails: ", e)
            return []
        finally:
            if cursor:
                cursor.close()

    # Set user verified
    def setUserVerified(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''update examiner SET verified = True where examiner_id = %s;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in setUserVerified", str(e))
            return []
        finally:
            if cursor:
                cursor.close()

    # Check wheather examiner is verified or not
    def checkExaminerVerified(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select verified from examiner where examiner_id = %s;'''
                cursor.execute(query,(examiner_id,))
                data = cursor.fetchall()
                if data.__len__() == 1:
                    return True
                else:
                    return False

        except Exception as e:
            print("Exception in checkExaminerVerifiedr", str(e))
            return False
        finally:
            if cursor:
                cursor.close()

    # Insert uploaded paper
    def InsertUploadedPaper(self, d_id, papers, duty_type):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                if duty_type == "Practical_Exam":
                    query = '''UPDATE practical_duty SET prac_paper = %s WHERE prac_duty_id = %s;'''
                    cursor.execute(query,(papers,d_id))
                elif duty_type == "Theory_Paper":
                    query = '''UPDATE exam_duty SET paper = %s WHERE exam_duty_id = %s;'''      
                    cursor.execute(query,(papers,d_id))
                return True
            else:
                return False
        except Exception as e:
            print("Exception in InsertUploadedPaper", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # Insert uploaded result
    def InsertUploadedResult(self, d_id, results, duty_type):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                if duty_type == "Practical_Exam":
                    query = '''UPDATE practical_duty SET prac_result = %s WHERE prac_duty_id = %s;'''
                    cursor.execute(query,(results,d_id))
                elif duty_type == "Theory_Paper":
                    query = '''UPDATE exam_duty SET result = %s WHERE exam_duty_id = %s;'''
                    cursor.execute(query,(results,d_id))
                return True
            else:
                return False
        except Exception as e:
            print("Exception in InsertUploadedResult", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    # Update status of a duty
    def UpdateStatus(self, d_id, status, table_name, examiner_id):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                if table_name == "Practical_Exam":
                    query = '''UPDATE practical_duty SET prac_duty_status = %s WHERE prac_duty_id = %s;'''
                    cursor.execute(query , (status,d_id))
                elif table_name == "Theory_Paper":
                    query = '''UPDATE exam_duty SET status_req = %s WHERE exam_duty_id = %s;'''
                    cursor.execute(query , (status,d_id))
                self.connection.commit()
                if status == 2 :
                    query = '''UPDATE examiner SET acceptance_count = acceptance_count + 1 WHERE examiner_id = %s;'''
                    cursor.execute(query , (examiner_id))
                elif status == 3:
                    query = '''UPDATE examiner SET rejection_count = rejection_count + 1 WHERE examiner_id = %s;'''
                    cursor.execute(query, examiner_id)
                self.connection.commit()                
                return True
            else:
                return False
        except Exception as e:
            print("Exception in UpdateStatus", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    def insertExaminerCourses(self, examiner_id, examiner_crs_name):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''insert into examiner_courses (examiner_id, examiner_crs_name) values(%s,%s);'''
                cursor.execute(query,(examiner_id,examiner_crs_name))
                self.connection.commit()
                return True
        except Exception as e:
            print("Exception in insertExaminerCourses", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    def  insertCollegeReview(self, ExamnrID, complain, AcId):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor
                query = '''insert into college_review("examiner_id","cr_complain","ac_id") values (%s,%s,%s);'''
                cursor.execute(query, (ExamnrID,complain,AcId))
                self.connection.commit()
                return True
        except Exception as e:
            print("Exception in insertCollegeReview", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()

    def getAllCoursesNames(self):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select rd_crs_name from roadmap;'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getAllCoursesNames", str(e))
            return []
        finally:
            if cursor:
                cursor.close()

    def getExaminerCourses(self, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = '''select examiner_crs_name from examiner_courses where examiner_id = %s;'''
                cursor.execute(query, (examiner_id,))
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getExaminerCourses", str(e))
            return []
        finally:
            if cursor:
                cursor.close()

    def updateUser(self, user_id, usr_name, usr_cnic, usr_email, usr_address, usr_bio, usr_gender, usr_phone, usr_active_status, profile):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = f'''update public.users set usr_name = '{usr_name}', usr_cnic = '{usr_cnic}', usr_email = '{usr_email}',
                            usr_address = '{usr_address}', usr_bio = '{usr_bio}', usr_gender = '{usr_gender}', usr_phoneno = '{usr_phone}', 
                            usr_active_status = {usr_active_status}, usr_profile_pic = '{profile}' 
                            where usr_id = {user_id};
                '''
                cursor.execute(query)
                self.connection.commit()                
                return True
            else:
                return False
        except Exception as e:
            print("Exception in UpdateStatus", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()