Guide on how to run the current code on your local machine for a quick demo

Based on your preference, you may proceed with an IDE of your choice (VSCode || PyCharm)

1. First, open up the IDE & find the option along the lines of "get from Version Control"
   * we are using Git to keep track of versions hence all code changes are reflected on GitHub
2. Then, since this repo is a public one, you may just clone it onto you local machine
   * this is the thing you want to paste into the source input box https://github.com/LesenmiaoYu/MBRL_ResearchDashboard.git 
3. Lastly, open up terminal within the IDE & follow the steps down below
   * if you missed anything, this is when you would find out
   * you should be able to find all the resources online on how to download the missing pieces
4. If you have followed all the right steps, I have configured (by default) that you would be able to visit the page on http://127.0.0.1:5000
5. When you are done, exit running (in terminal) by inputting control+c

Any changes you make will not be updated, so don't be afraid of breaking it

If you are interested in helping me, you can make another dev branch, check that out, and push to that branch.

If you have any questions, please reach out!



# Project Setup NOTES

### Prerequisites
1. Install **Python 3.7+** and **Node.js 16+**.
2. Ensure `pip` and `npm` are installed.

---

### 1. Backend Setup

1. Navigate to the backend directory:

   cd backend
   python -m venv venv
   venv\Scripts\activate (this puts everything into a virtual environment so you won't have to worry about it messing anything up)
   pip install -r requirements.txt
   python build_db.py
   flask run

2. Navigate to the frontend directory:
   cd frontend
   npm install
   npm start

Flask backend: http://127.0.0.1:5000/
React frontend: http://127.0.0.1:3000/


