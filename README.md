# Atlas: AI Assisted Balance Scorecard Management and Solution

Atlas is a web application designed to simplify the creation, management, and evaluation of balanced scorecards for various departments within an organization. 
With integrated features such as goal setting, SWOT analysis, strategy mapping, and report generation, Atlas enables users to align their departmental strategies 
with organizational goals effective.

# Introduction
Atlas is designed to support departmental heads, managers, and administrators in creating and maintaining balanced scorecards. The platform integrates AI-driven 
insights to assist in strategy mapping and alignment. By focusing on user experience and simplicity, Atlas aims to be a user-friendly tool that allows teams to manage 
goals and strategies with ease.

# Features

#### User Account Management
- Create and manage accounts with personalized access to department-specific goals and reports.
#### Departmental Goal Input
- Set, track, and manage departmental goals aligned with organizational objectives.
#### SWOT Analysis and AI-Strategy Generation
- Add, edit, and manage SWOT entries to analyze departmental strengths, weaknesses, opportunities, and threats. Generate strategies from the inputted swot with the help of AI.
#### AI Strategy Mapping
- Map strategies with AI assistance to key perspectives and track progress.
#### Balanced Scorecard Management
- Manage real time KPI and update balanced scorecards to assess departmental performance across different perspectives (Financial, Stakeholder, Internal Processes, Learning & Growth).
#### Report Generation
- Generate comprehensive reports for strategic analysis and decision-making.
#### User Feedback
- UAT surveys to gather user feedback on system functionality and user experience.

# Technology Used
- Frontend: NextJS, React, Tailwind CSS
- Backend: Spring Boot, Java
- Database: MySQL (via Railway)
- Authentication: NextAuth.js (Custom Credentials Provider with JWT Session Strategy)
- Deployment: Vercel and Railway


# Deployment
You can access the Atlas web application through the following link:  
[https://citu-atlas.vercel.app/](https://citu-atlas.vercel.app/)  
This link will redirect you to the deployed application, where you can log in, test features, and provide feedback.

### Usage
- Upon accessing the application, department heads will be prompted to  sign up and log in with their credentials.
- Once logged in, they can select their department if user has multiple departments and begin inputting departmental goals and other relevant data.
- Use the navigation bar to manage SWOT, strategy mapping, balanced scorecard, and reports.
- Participate in User Acceptance Testing (UAT) surveys to provide feedback on the system’s functionality.

#### Credentials to Admin
- username: admin
- password: A@dmin123
#### Sample Credentials to Login
- Username: Lara
- Password: Lara@123

# Installation Instructions
#### Prerequisites
Ensure the following tools are installed on your system:

- Node.js 
- Java JDK 
- MySQL 
- Maven

### Backend Setup
1. Clone the backend repository:
   ```bash
   git clone https://github.com/larapable/atlas-backend-updated.git
   ```
2. Navigate to the project directory:
   ```bash
   cd atlas-backend-updated
   ```
3. Configure database credentials in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://<your-database-host>:<port>/defaultdb
   spring.datasource.username=<your-username>
   spring.datasource.password=<your-password>
   ```
4. Build and run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/larapable/frontend-updated.git
   ```
2. Navigate to the project directory:
   ```bash
   cd frontend-updated
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## System Setup for First-Time Users
1. Deploy the backend and frontend applications on their respective platforms (Railway for backend, Vercel for frontend).
2. Configure the database schema using the provided SQL migration scripts in the backend repository.
3. Use the admin credentials to log in and create department-specific users.
4. Provide department heads with their unique credentials to access the system.

---

# Contact
For further inquiries or contributions, please reach out to:
- Email: pablelara@gmail.com
- Frontend Link: https://github.com/larapable/frontend-updated.git
- Backend Link: https://github.com/larapable/atlas-backend-updated.git






