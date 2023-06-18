# ACMS - Affiliated College Management System
**Steps**
1. Download the zip file.
2. Open foler in Visual Studio Code.
3. Open two terminals.

4. **Setup backend.**
    
    Run the following commands :
    1. cd backend (In one terminal open backend folder.)
    2. pip install -r requirements.txt (To install all required packages.)
    3. python server.py (To run.)
  
5. **Setup frontend.**
    
    Run the following commands :
    1. cd frontend (In other terminal open frontend folder.)
    2. npm install  (To install all required packages.)
    3. npm start (To run.)
    
6. **Setup Database**
    
    Follow the following steps :
    1. Go to config.py file provided in backend folder and update your DB_PASSWORD (PostgreSQL - pgAdmin).
    2. Now open pgAdmin and create new database ACMS.
    3. Right click on your ACMS database and click on Query Tool.
    4. Now copy the complete script provided in Databse/DB Script folder (ACMS Script.sql).
    
    5. **To import data in your database follow the following commands:**
    
          1.  Go to pgAdimn -> File -> Preferences -> Path -> Binary paths.
          2.  From PostgreSQL Binary Path select your version (like PostgreSQL 15) and add your path to bin
             of your PostgreSQL (like E:\PostgreSQL\15\bin).
          3. Select Encoding UTF8.
          4.  Click on tables in following sequence :
              
                Tables List
                1. users
                2. examiner
                3. admin
                4. affiliated_colleges
                5. roadmap
                6. practical_duty
                7. exam_duty
                8. batch_enrollment
                9. departments
                10. enrolled_department
                11. examiner_courses
                12. qualification
                13. experience
                14. college_review
                15. teacher_feedback
                
                Click on Import/Export Data and select Import.
                
          5. In Filename select the path of the CSV file of that table provided in Database/CSV Data.
          6. From Options enable header.
          7. Finally click on OK.

*****************************************************************************************************************************
