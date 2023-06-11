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
                password="aat",  # write your dbPassword
                port="5432")
        except Exception as e:
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
                query = f'''insert into public.users(usr_name,usr_password,usr_phoneno,usr_profile_pic,usr_cnic,usr_address,usr_email,usr_active_status,usr_bio,usr_gender) 
	                        values ('{user.usr_name}', '{user.usr_password}','{user.usr_phoneno}', '{user.usr_profile_pic}', '{user.usr_cnic}', '{user.usr_address}', '{user.usr_email}', '{user.usr_active_status}', '{user.usr_bio}', '{user.usr_gender}') returning usr_id;
                            '''
                cursor.execute(query)
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
                cursor.execute(
                    f'''select usr_id from public.users where usr_email = '{email}';''')
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
                cursor.execute(
                    f'''select usr_email from public.users where usr_id = '{id}';''')
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
                cursor.execute(
                    f'''select usr_password from public.users where usr_email = '{email}';''')
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
                query = f'''select examiner_id from public.examiner where "user_id " = {userid};'''
                cursor.execute(query)
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
                query = f'''insert into public.examiner("user_id ","institution ","availability","ranking","resume","acceptance_count","rejection_count","verified") 
                            values({examiner.user_id}, '{examiner.institution}', '{examiner.availability}', {examiner.ranking}, '{examiner.resume}', {examiner.acceptance_count}, {examiner.rejection_count}, {examiner.verified}) returning examiner_id;
                            '''
                cursor.execute(query)
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
                cursor.execute(f"select usr_email from public.users;")
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

    # Validate password 
    def ValidatePassword(self, email, password):  # return examiner id
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                cursor.execute(
                    f'''select usr_password from public.users where "usr_email" = '{email}';''')
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
            return False
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
                query = f'''insert into public.qualification("examiner_id", "degree_title", "institution", "starting_date", "ending_date","transcript") 
                values('{qualification.examiner_id}', '{qualification.degree_title}', '{qualification.institution}', '{qualification.starting_date}', '{qualification.ending_date}','{qualification.transcript}');
                '''
                print(query)
                cursor.execute(query)
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
                query = f'''insert into public.experience("examiner_id", "job_title", "organization", "reference_email", "starting_date", "ending_date","experiance_letter") 
                        values('{experience.examiner_id}', '{experience.job_title}', '{experience.organization}','{experience.reference_email}' ,'{experience.starting_date}', '{experience.ending_date}', '{experience.ExperianceLetter}');
                        '''
                cursor.execute(query)
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
    def deleteAllQuaAndExp(self, tableName, exaimerID):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                query = f'''delete from {tableName} where examiner_id = {exaimerID};'''
                cursor.execute(query)
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

                query = f'''delete from examiner where "user_id " = {userID};'''
                # on  which basis examiner is deleted...  userid????
                # should we delete user as well... if examiner is deleted...???
                cursor.execute(query)
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
                query = f'''delete from public.users where usr_email = {email};'''
                cursor.execute(query)
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
    def getDataofExaminer(self, tableName, examiner_id):
        cursor = None
        try:
            if self.connection:
                cursor = self.connection.cursor()
                query = f'''select * from public.{tableName} where examiner_id = {examiner_id};'''
                cursor.execute(query)
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
                query = f'''select * from public.users where usr_id = {usr_id};'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
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
                query = f'''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and prac_duty_status = 1;'''
                cursor.execute(query)
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
                query = f'''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and status_req = 1;'''
                cursor.execute(query)
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
                query = f'''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and prac_duty_status = 2 and paper_upload_deadline > CURRENT_DATE;'''
                cursor.execute(query)
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
                query = f'''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and status_req = 2 and paper_upload_deadline > CURRENT_DATE;'''
                cursor.execute(query)
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
                query = f'''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and prac_duty_status = 2 and paper_upload_deadline < CURRENT_DATE and prac_date > CURRENT_DATE;'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getduePracRequests: ", e)
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
                query = f'''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and status_req = 2 and paper_upload_deadline < CURRENT_DATE and paper_date > CURRENT_DATE;'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getDueTheoryRequests: ", e)
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
                query = f'''select ed.prac_duty_id, rd.rd_crs_name, ed.prac_ass_date from practical_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and prac_duty_status = 2 and result_upload_deadline > CURRENT_DATE and prac_date <= CURRENT_DATE;'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getduePracRequests: ", e)
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
                query = f'''select ed.exam_duty_id, rd.rd_crs_name, ed.request_date from exam_duty ed, roadmap rd where ed.rd_id = rd.rd_id and ed.examiner_id = {examiner_id} and status_req = 2 and result_upload_deadline > CURRENT_DATE and paper_date <= CURRENT_DATE;'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getDueTheoryRequests: ", e)
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
                if (dtType == "Practical Exam"):
                    query = f'''select prac_date, prac_time, paper_upload_deadline, prac_ass_date, ac_id, rd_id from practical_duty where prac_duty_id = {dtId};'''
                elif (dtType == "Theory Paper"):
                    query = f'''select paper_date, paper_upload_deadline, request_date,rd_id from exam_duty where exam_duty_id = {dtId};'''
                cursor.execute(query)
                data = cursor.fetchall()
                rdId = data[len(data) - 1][5]
                query = f'''select rd_crs_code, rd_crs_name, rd_crs_book, rd_crs_outlline from roadmap where rd_id = {rdId};'''
                cursor.execute(query)
                rdData = cursor.fetchall()
                acData = []
                if dtType == "Practical Exam":
                    acID = data[data.__len__() - 1][4]
                    query = f'''select ac_name, ac_address from affiliated_colleges where ac_id = {acID};'''
                    cursor.execute(query)
                    acData = cursor.fetchall()
                # if len(acData) > 0:
                    combinedList = data[0] + rdData[0] + acData[0]
                else:
                    combinedList = data[0] + rdData[0]
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
                query = f'''update examiner SET verified = True where examiner_id = {examiner_id};'''
                cursor.execute(query)
                data = cursor.fetchall()
                return data
        except Exception as e:
            print("Exception in getDataofUser", str(e))
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
                query = f'''select verified from examiner where examiner_id = {examiner_id};'''
                cursor.execute(query)
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
            if self.connection != None:
                cursor = self.connection.cursor()
                if duty_type == "Practical Exam":
                    cursor.execute(f'''UPDATE practical_duty SET prac_paper = '{papers}' WHERE prac_duty_id = {d_id};''')
                elif duty_type == "Theory Paper":
                    cursor.execute(f'''UPDATE exam_duty SET paper = '{papers}' WHERE exam_duty_id = {d_id};''')
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
            if self.connection != None:
                cursor = self.connection.cursor()
                if duty_type == "Practical Exam":
                    cursor.execute(f'''UPDATE practical_duty SET prac_result = '{results}' WHERE prac_duty_id = {d_id};''')
                elif duty_type == "Theory Paper":
                    cursor.execute(f'''UPDATE exam_duty SET result = '{results}' WHERE exam_duty_id = {d_id};''')
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
    def UpdateStatus(self, d_id, status, table_name):
        cursor = None
        try:
            if self.connection != None:
                cursor = self.connection.cursor()
                if table_name == "Practical Exam":
                    cursor.execute(f'''UPDATE practical_duty SET prac_duty_status = {status} WHERE prac_duty_id = {d_id};''')
                elif table_name == "Theory Paper":
                    cursor.execute(f'''UPDATE exam_duty SET status_req = {status} WHERE exam_duty_id = {d_id};''')
                return True
            else:
                return False
        except Exception as e:
            print("Exception in UpdateStatus", str(e))
            return False
        finally:
            if cursor != None:
                cursor.close()
