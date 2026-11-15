# Final Year Project Proposal

Date: 15 November 2026

| Item | Detail |
| --- | --- |
| Name | Khalil Lawan Ahmed |
| Matric number | MIU/23/CMP/SEN/378 |
| Level | Final year |
| Department | Software Engineering |
| Faculty | Faculty of Computing |
| Institution | Mewar International University, Nigeria |

## 1. Title of the Project

**Design and Implementation of an AI-Assisted All-in-One Campus Communication and Student Services Platform (A Case Study of the Faculty of Computing, Mewar International University, Nigeria)**

Proposed system name: **MIU Connect**. It is one web application that replaces WhatsApp groups, Instagram pages, phone calls and office visits for everyday campus communication. Students, lecturers and office staff each have their own login, and parents and visitors get answers from an AI receptionist at any hour.

## 2. Background of the Study

Regular contact between students and lecturers is central to learning. Chickering and Gamson (1987) list student and faculty contact as the first of their seven principles of good practice in undergraduate education. Moore (1989) names learner and instructor interaction as one of the three types of interaction that support learning.

In many Nigerian universities this contact happens informally. Students walk from office to office looking for lecturers, rely on class representatives to pass messages, and follow announcements in WhatsApp groups. WhatsApp is easy, cheap and immediate (Bouhnik & Deshen, 2014), but academic notices get mixed with social chat and buried under new messages. Students who are not in the right group miss them, and lecturers' personal phone numbers end up shared widely.

Other parts of student life are just as scattered. Assignments are given in class or in chat groups with no central record, so deadlines are missed. Students find out their fee balance by visiting the bursary. Lecturers keep their own lists of courses, classes and schedule changes, and must repeat every change to each class.

The same gaps reach beyond the classroom. Attendance is taken on paper, past questions and past projects pass from hand to hand, and student complaints made by word of mouth are easily lost. Parents and prospective students who call or message the University often get no answer, especially after office hours.

Two developments now make one integrated platform practical. Workplace messaging tools such as Slack show how channels and direct messages can organise group communication. In a university case study, Slack made it easier for students to ask questions, but the authors recommended a platform designed specifically for education (Tuhkala & Kärkkäinen, 2018). At the same time, large language models can explain concepts and guide students through problems at any hour (Kasneci et al., 2023), provided they are designed to support learning rather than do the work for students (Cotton et al., 2024). This project combines these ideas into MIU Connect, an all-in-one platform built around the courses, lecturers, students, offices and fees of the Faculty of Computing at Mewar International University.

## 3. Statement of the Problem

Students, lecturers, offices, parents and prospective students in the Faculty of Computing have no single place to communicate, so messages are missed, deadlines slip, complaints are lost and simple questions take days to answer. This study will first confirm and measure each problem with evidence, then solve each one with a specific part of the system.

### 3.1 Problems Identified

| No. | Problem | How it shows up today | Effect |
| --- | --- | --- | --- |
| P1 | Students cannot reach lecturers easily | Students search offices, wait for class representatives, or call lecturers' personal phones; meetings are arranged on WhatsApp | Questions go unanswered, time is wasted, and lecturers lose their privacy |
| P2 | Announcements and class changes are missed | Notices go out in WhatsApp groups and on notice boards; changes to time, venue or online and physical mode travel by word of mouth | Students miss classes or turn up for cancelled ones |
| P3 | Assignments, deadlines and scores are not tracked | Assignments are given verbally or in chat, with no reminders and no record of submissions; CA scores are seen only when results come out | Late or missed submissions, lost marks and surprises at examination time |
| P4 | Fee status is unclear | Students must visit the bursary to find out what they have paid and what they still owe | Wasted trips and surprises at registration or examination time |
| P5 | Students lack help outside class hours | Lecturers are not available at night or at weekends | Students get stuck, fall behind, or copy answers |
| P6 | Lecturers lack one view of their teaching | Course allocations, class lists and timetables are kept in separate documents | Time lost on administration and errors in schedules |
| P7 | Attendance is taken on paper and is easy to fake | Sign-in sheets are passed round, and friends sign for absent students | Wasted class time and unreliable records for the 75% attendance rule |
| P8 | Struggling students are noticed too late | Low attendance, missed work and low scores are recorded in separate places | Students fail or drop out before anyone steps in |
| P9 | Past questions and past projects are hard to find | They pass from hand to hand as photocopies and phone photos | Unequal access to study material, and repeated project topics |
| P10 | Student complaints get lost | Complaints are made by word of mouth or on paper, with no record or deadline | Problems stay unsolved and students lose trust |
| P11 | Parents and visitors get no answer | Calls and messages to offices and social media pages go unanswered, especially after office hours | Frustrated parents and a poor image of the University |
| P12 | Prospective students lack course guidance | Applicants unsure which course to choose must call or visit, and interested enquirers are rarely followed up | Poor course choices, and applicants lost to other universities |

### 3.2 Root Cause

All twelve problems share one root cause: there is no single platform that connects students, lecturers, offices, parents, prospective students, courses and records. Information is spread across WhatsApp groups, Instagram pages, phone calls, notice boards, paper lists and separate offices, so nobody has one reliable source of truth.

### 3.3 From Problem to Solution

| Problem | Solution in MIU Connect | Objective |
| --- | --- | --- |
| P1 Hard to reach lecturers | Direct messages, course channels, and meeting booking with video calls inside the app; no personal phone numbers shared | 4 |
| P2 Missed announcements | Announcements and a class schedule marked physical (with venue) or online (with link), with phone push notifications | 3 |
| P3 Untracked assignments and scores | Assignment tracker with submission, pending and overdue lists and reminders; CA scores visible to each student | 5 |
| P4 Unclear fee status | Fee page with fees, payments and balance, kept up to date by bursary staff | 9 |
| P5 No help after hours | AI study assistant that guides students from the lecturer's notes, plus AI practice quizzes | 6 |
| P6 No teaching overview | Lecturer dashboard of courses, levels, class lists and timetable; students see their own courses and lecturers | 2 |
| P7 Paper attendance | QR code attendance with codes that change every few seconds, and each student's progress against the 75% rule | 7 |
| P8 Students noticed too late | Early warning dashboard that flags students with low attendance, missed work or low CA scores | 7 |
| P9 Hard-to-find past materials | Digital library of past questions and past final year projects, searchable by course and keyword | 8 |
| P10 Lost complaints | Complaint tickets sent to a lecturer or office, with tracking, response deadlines and escalation | 10 |
| P11 Unanswered parents and visitors | AI receptionist on the public page that answers common questions at any hour and passes anything else to staff through the CRM inbox | 10 |
| P12 No course guidance for applicants | AI admissions advisor that asks about interests, strengths, subjects and goals, recommends suitable courses with reasons and entry requirements, and helps the applicant book a campus visit or counselling session, with every lead tracked in the CRM | 10 |

## 4. Research Questions

The study will answer the following questions:

1. What are the main communication and service problems faced by students, lecturers, offices, parents and prospective students of the Faculty of Computing, and how large are they?
2. How can students, lecturers and offices communicate and meet through one platform instead of WhatsApp, Instagram and personal phone numbers?
3. How can announcements and class changes reach every affected student in time?
4. How can assignments, CA scores and attendance be tracked so that struggling students are identified early?
5. How can an AI study assistant help students learn, through explanations and practice quizzes, while protecting academic integrity?
6. How can fee status, complaints, enquiries from parents and visitors, and course guidance for prospective students be handled reliably, including after office hours?
7. To what extent does the developed system solve the identified problems when compared with the current situation, and how well do its users accept it?

## 5. Aim and Objectives of the Study

**Aim:** To solve the communication and student service problems of the Faculty of Computing, Mewar International University, by designing and implementing an AI-assisted all-in-one platform that connects students, lecturers, offices, parents and prospective students in one place.

**Objectives:** The specific objectives are to:

1. Identify and measure the communication and service problems of students, lecturers, offices, parents and prospective students, find their root cause, and gather requirements.
2. Develop role-based portals for students, lecturers, office staff and administrators, including a lecturer dashboard of assigned courses, levels, class lists and timetable, and a student view of their courses and lecturers.
3. Develop an announcements and class schedule module that marks each class as physical or online and notifies students of any change, including by phone push notification.
4. Develop messaging and meetings, with course channels, direct messages and meeting booking with video calls inside the app.
5. Develop an assignment module for posting, submission, tracking, deadline reminders, grading and feedback, with CA scores visible to each student.
6. Develop an AI study assistant that answers from the lecturer's course materials, guides students without completing their assignments, and generates practice quizzes.
7. Develop QR code attendance and an early warning dashboard that flags students at risk.
8. Develop a digital library of past questions and past final year projects.
9. Develop a fee status module that shows each student's fees, payments and outstanding balance, maintained by bursary staff.
10. Develop a CRM for complaints and enquiries, an AI receptionist for parents and visitors, and an AI admissions advisor that recommends courses to prospective students and helps them book a visit.
11. Evaluate the system against the baseline measured in objective 1, and test its usability, user acceptance and the accuracy, privacy and integrity of its AI features.

## 6. Significance of the Study

The system will save time, reduce missed information and support learning for everyone in the Faculty:

| Beneficiary | How the study helps |
| --- | --- |
| Students | Reach lecturers and offices without searching for them, never miss an announcement or class change, track every assignment, score and attendance record, find past questions and projects, get study help at any hour, and know their fee balance without visiting the bursary. |
| Lecturers | One dashboard of courses, classes and timetable; announce to a whole class in one step; take attendance in seconds; collect and grade work online; see which students need help early; hold meetings without sharing personal phone numbers. |
| Offices (bursary, registry, student affairs) | One CRM inbox for complaints and enquiries, with deadlines and history, and fewer repeated questions because the AI receptionist answers common ones. |
| Parents and visitors | Answers at any hour, and a guaranteed call back from the right office when the AI cannot help. |
| Prospective students | Honest course recommendations with entry requirements, and an easy way to book a visit or counselling session. |
| University management | Better student engagement, fewer lost applicants, and a digital platform that can be extended to other faculties. |
| Researchers | A documented design for an education-specific all-in-one platform with guided AI features, useful for further studies in Nigerian universities. |

## 7. Scope and Limitations of the Study

### 7.1 Scope

The study covers undergraduate students, lecturers and offices of the Faculty of Computing, Mewar International University, together with parents, visitors and prospective students who contact the Faculty. The system will have four login roles (student, lecturer, office staff and administrator) and a public page that needs no login. It will include the following parts:

- **Student portal:** dashboard of courses and lecturers, timetable, announcements, assignments and CA scores, attendance record, library, AI study assistant with practice quizzes, fee status and complaints.
- **Lecturer portal:** dashboard of courses, levels, class lists and timetable; announcements and class schedule (physical or online); QR attendance; assignments, grading and CA scores; course materials; and the early warning dashboard.
- **Office portal (CRM):** one inbox for complaints and enquiries from students, parents, visitors and prospective students, with assignment to staff, status, response deadlines and full history; fee records for bursary staff; and an admissions pipeline from enquiry to booked visit to application.
- **Public page:** information about the Faculty, an AI receptionist for parents and visitors, and an AI admissions advisor for prospective students.
- **Shared by all portals:** course channels and direct messages, meetings with video calls inside the app, and notifications in the app, by phone push and by e-mail.

The system will be a responsive web application that can be installed on a phone like an app. It will first be built as a working demo with sample accounts for students, lecturers and office staff, then piloted in selected courses.

### 7.2 Limitations

- The fee module shows payment records but does not process payments. Students will continue to pay through the University's existing channels, and bursary staff will update records manually or by CSV import.
- MIU Connect is built as a standalone system. Connecting it to the University's existing student portal is outside the scope, but the system is designed for it: student, lecturer and course data enter through one import step (CSV files for now), which could later read directly from the portal through a data export or API.
- The AI features depend on an external language model service, so they need internet access, have a usage cost and can make mistakes. Their answers are based on approved materials and clearly labelled as AI help; they do not replace lecturers or staff.
- The AI receptionist and admissions advisor give general information only, such as fee schedules, entry requirements and dates. They never reveal a particular student's records; such requests become tickets for staff to verify and answer.
- The admissions advisor recommends; it does not decide. Final course choice and admission remain with the applicant and the University's admission process.
- The public AI agents work by web chat, with an optional voice mode in the browser. A real telephone line is outside the scope.
- The study assistant is designed to guide rather than write assignments, but the system cannot stop students from using other AI tools.
- Rotating QR codes and a location check reduce proxy attendance but cannot stop it completely.
- Video meetings run on Jitsi Meet, and call quality depends on the internet connection.
- There will be no native Android or iOS app; the web app can be installed on phones instead.
- Power and network outages may limit access at times.
- The demo and pilot will use a limited sample of users in one faculty, within one academic session.

## 8. Literature Review

The literature supports each part of the proposed platform, but existing tools solve these problems separately. This review covers student and lecturer interaction, messaging tools in education, deadlines and early warning, AI study assistants, student services and existing systems.

### 8.1 Student and Lecturer Interaction

Chickering and Gamson (1987) place frequent student and faculty contact first among their seven principles of good practice, alongside prompt feedback and clear time on task. Moore (1989) describes three types of interaction in education: learner and content, learner and instructor, and learner and learner. A platform that supports learning should make all three easy. In MIU Connect, course materials and the AI assistant support learner and content interaction, direct messages support learner and instructor interaction, and course channels support learner and learner interaction.

### 8.2 Messaging Tools in Education

Teachers already use general messaging apps with their students. Bouhnik and Deshen (2014) studied teachers who used WhatsApp with their classes and found that they valued its ease of use, low cost, availability and immediacy. Tuhkala and Kärkkäinen (2018) replaced e-mail and the learning management system with Slack in a university thesis seminar. Students found it easy to use and felt it lowered the barrier to asking questions. However, they worried about information overload and about using a tool the university did not officially support, and the teacher faced problems with file management and user accounts. The authors suggested that an education-specific alternative to Slack could be more useful. MIU Connect follows this advice: it keeps the channel and direct message model, but ties every channel to a real course, its lecturer and its enrolled students.

### 8.3 Deadlines, Attendance and Early Warning

Steel (2007) reviewed research on procrastination and found it to be common, with people less motivated by tasks whose rewards or deadlines feel far away. This supports a single list of every pending assignment, and reminders that arrive as each deadline approaches.

Early warning systems apply the same idea to whole courses. Purdue University's Course Signals combined grades, past academic history and use of the learning management system to warn students at risk, and its developers reported better course grades in courses that used it (Arnold & Pistilli, 2012). Later reviewers questioned some of its retention claims, so MIU Connect will use simple, explainable signals (attendance, missed work and CA scores) and leave every decision to the lecturer.

### 8.4 AI Study Assistants

Computer tutors that respond to each learner have a long record of success. Kulik and Fletcher (2016) reviewed controlled evaluations of intelligent tutoring systems and found that students who used them outperformed students in conventional classes in most studies. Large language models make this kind of help far easier to build. Kasneci et al. (2023) describe their potential for explanations and personalised learning, but warn that they can be wrong or biased and need human oversight. Cotton et al. (2024) add that they create new risks for academic integrity, and recommend clear policies and careful assessment design.

Two design choices respond to these concerns. First, retrieval-augmented generation lets a language model answer from a set of retrieved documents rather than from memory alone, which makes answers more specific and factual (Lewis et al., 2020). MIU Connect will retrieve passages from the lecturer's own course materials and show which material each answer is based on. Second, the assistant will work as a guide: it explains, asks questions and gives hints, but declines to produce complete answers to assignment questions.

Practice testing also supports learning directly. Roediger and Karpicke (2006) found that students who took recall tests on a passage remembered much more of it days later than students who spent the same time re-reading it. MIU Connect's AI practice quizzes apply this by turning the lecturer's notes into short quizzes students can take as often as they like.

### 8.5 Student Services, Enquiries and Admissions

Universities increasingly treat student services like customer service. Seeman and O'Hara (2006) argue that customer relationship management (CRM), the practice and software of keeping every contact with a person in one record, can improve how colleges attract, serve and keep students. AI assistants can extend this service beyond office hours. Georgia State University used an AI text assistant to answer admitted students' questions over the summer; students who had it completed more enrolment tasks and were 3.3 percentage points more likely to enrol on time (Page & Gehlbach, 2017).

MIU Connect combines these ideas. Complaints and enquiries become tracked tickets in one CRM inbox. An AI receptionist answers parents and visitors at any hour and passes anything it cannot answer to staff. An AI admissions advisor helps prospective students compare courses against their interests and entry requirements, then book a visit, with each lead followed in the CRM.

### 8.6 Technology Acceptance

The Technology Acceptance Model holds that perceived usefulness and perceived ease of use drive whether people adopt a system (Davis, 1989). The System Usability Scale gives a quick, reliable measure of usability (Brooke, 1996). Both will be used to evaluate MIU Connect.

### 8.7 Review of Existing Approaches

| Approach | What it does | Gap for this study |
| --- | --- | --- |
| WhatsApp class groups | Fast, free group messaging run by class representatives | Academic notices are mixed with social chat and get buried; no assignment tracking; lecturers' numbers are exposed; not tied to official course lists |
| Phone calls and social media pages (for example, Instagram) | Parents, visitors and applicants call offices or message the University's pages | No answer after hours; no record of who asked what; no follow-up |
| Workplace messaging (Slack, Microsoft Teams) | Channels, direct messages and meetings for organisations | Not linked to courses, timetables, assignments or fees; extra setup and accounts (Tuhkala & Kärkkäinen, 2018) |
| Learning management systems (for example, Moodle or Google Classroom) | Course pages, materials and assignments (Dougiamas & Taylor, 2003) | Separate from fee records, complaints and enquiries; usually no AI assistant grounded in course materials |
| Help desk and CRM software (for example, Zendesk or Salesforce) | Tickets and contact records for organisations | Costly licences; not linked to students, courses, attendance or fees |
| University student portals | Registration, results and fee payment | Usually no messaging, announcements, attendance or assignment tracking |
| General AI chatbots (for example, ChatGPT) | Answer questions on any topic | Not based on the lecturer's materials or the University's own information; will often write full assignments (Cotton et al., 2024) |
| **Proposed MIU Connect** | Joins communication, meetings, scheduling, assignments, attendance, early warning, a guided AI assistant, fee status, a CRM and public AI agents in one platform | Addresses the gaps above for the Faculty of Computing |

### 8.8 Research Gap

Each existing tool solves part of the problem. Students, lecturers, offices, parents and applicants therefore move between WhatsApp, Instagram, phone calls, notice boards, a portal and office visits, and the information never comes together. There is no low-cost, all-in-one platform, built around a Nigerian faculty's own courses, lecturers, offices and fee records, that combines communication and meetings, class scheduling, assignment and attendance tracking, early warning, a course-grounded AI study assistant, fee status, complaint handling, an AI receptionist and an AI admissions advisor. This study fills that gap.

## 9. Research Methodology

The study will follow the Design Science Research Methodology, which is built around identifying a real problem and solving it with a working system (Hevner et al., 2004; Peffers et al., 2007). Its six activities map to this project as follows:

1. **Identify and measure the problem:** confirm the problems in Section 3 with questionnaires, interviews and records, find the root cause, and record baseline figures.
2. **Define the objectives of a solution:** turn each confirmed problem into system requirements (Section 5).
3. **Design and develop:** build MIU Connect in short Agile sprints.
4. **Demonstrate:** run a pilot with real lecturers and students in selected courses.
5. **Evaluate:** measure the same figures again and compare them with the baseline.
6. **Communicate:** report the findings in the final project report and defence.

### 9.1 Problem Identification and Data Collection

Before any code is written, each problem will be confirmed with evidence and measured.

- **Questionnaire** for about 50 to 100 students across all levels of the Faculty.
- **Interviews** with at least five lecturers, a faculty administrator, and staff of the bursary, registry, student affairs and admissions offices.
- **Document review** of course allocation lists, timetables, samples of class announcements, and a two-week log of calls and messages received by offices.
- **Root cause analysis** with a cause and effect (fishbone) diagram built from the findings (Ishikawa, 1986).

The following baseline figures will be recorded from the current situation:

| Problem | Baseline measure | Source |
| --- | --- | --- |
| P1 Hard to reach lecturers | Average time for a student to get an answer from a lecturer | Student questionnaire |
| P2 Missed announcements | Share of students who missed at least one announcement or class change in the last month | Student questionnaire |
| P3 Untracked work and scores | Share of assignments submitted late or not at all in sampled courses; share of students caught out by a test date | Lecturer records and student questionnaire |
| P4 Unclear fee status | Number of bursary visits per student per semester just to check fees | Student questionnaire and bursary interview |
| P5 No help after hours | Share of students who often get stuck on coursework with no one to ask | Student questionnaire |
| P6 No teaching overview | Hours per week lecturers spend on class administration and repeating announcements | Lecturer interviews |
| P7 Paper attendance | Minutes per class spent on attendance, and lecturers' estimate of proxy signing | Lecturer interviews and class observation |
| P8 Students noticed too late | Share of students who failed a course without any earlier contact from the lecturer | Lecturer records and interviews |
| P9 Hard-to-find past materials | Share of students with access to past questions, and time spent finding them | Student questionnaire |
| P10 Lost complaints | Share of complaints with no response within one week | Student questionnaire and office interviews |
| P11 Unanswered parents and visitors | Share of calls and messages to offices left unanswered, and average reply time | Two-week office log and office interviews |
| P12 No course guidance | Share of prospective student enquiries followed up, and share that became applications | Admissions office records |

### 9.2 Development Model

The system will be built with the Agile Scrum model in eight one-week sprints, so a working demo with sample accounts exists from the first week and grows each week (Schwaber & Sutherland, 2020; Sommerville, 2016):

| Sprint | Delivers | Problems addressed |
| --- | --- | --- |
| 1 | Logins, roles, demo accounts, data import, lecturer and student dashboards | P6 |
| 2 | Announcements, class schedule with physical or online mode, phone push notifications | P2 |
| 3 | Course channels, direct messages, and meetings with video calls | P1 |
| 4 | Assignments, CA scores, the Upcoming page with countdown reminders, QR attendance | P3, P7 |
| 5 | Course materials, library, AI study assistant and practice quizzes | P5, P9 |
| 6 | CRM inbox, complaints, AI receptionist and AI admissions advisor | P10, P11, P12 |
| 7 | Fee status and the early warning dashboard | P4, P8 |
| 8 | Final testing, deployment and pilot preparation | All |

### 9.3 System Analysis and Design

Requirements will be modelled with UML use case, activity, sequence and class diagrams. The database will be designed with an entity relationship diagram and normalised to third normal form (Elmasri & Navathe, 2016). Screens will be prototyped in Figma and reviewed with lecturers and students before coding (Pressman & Maxim, 2020).

### 9.4 Messaging, Meetings, Announcements and Reminders

Every course gets a channel automatically, with its lecturer and enrolled students as members. Messages are delivered in real time over WebSockets and stored, so nothing is lost when a student is offline. Announcements and class changes create a notification for every enrolled student, in the app, by phone push notification and by e-mail.

Lecturers, students and staff can book meetings from the app. Each meeting opens a video room inside MIU Connect using Jitsi Meet, an open-source video meeting system, so nobody needs WhatsApp, Zoom or a phone number.

Every student has an Upcoming page that lists all assignments, CA tests and examinations across their courses, sorted by date, each with a countdown such as "4 days left". A scheduled background job checks every hour and sends reminders 4 days before, 1 day before and on the due day, and again when work becomes overdue. Students can change these reminder times, and the AI study assistant can turn the list into a revision plan before tests.

### 9.5 AI Study Assistant Method

The assistant uses retrieval-augmented generation (Lewis et al., 2020):

1. Lecturers upload notes and slides. The text is extracted and split into short passages.
2. Each passage is turned into a vector with a sentence embedding model (Reimers & Gurevych, 2019) and stored in the database.
3. When a student asks a question in a course, the question is embedded and the most similar passages from that course are retrieved, using cosine similarity:

$$
\text{sim}(q,p) = \frac{q \cdot p}{\lVert q \rVert \, \lVert p \rVert}
$$

4. The question and the retrieved passages are sent to a large language model (Claude, through the Anthropic API) with fixed instructions: explain, ask guiding questions and give hints; name the course material used; and do not produce complete answers to assignment questions.
5. The answer is shown with links to the source materials.

The assistant also knows the assignments posted in the student's courses. If a student pastes an assignment question, it switches to step-by-step guidance. It can also read the student's pending deadlines and suggest a study plan. Only the question, course passages and assignment titles are sent to the AI service; fee records and personal details are not.

The same pipeline powers practice quizzes. A student picks a course and topic, or an upcoming CA test, and the assistant writes short questions from the retrieved passages, marks the student's answers and points to the notes that explain any mistake (Roediger & Karpicke, 2006).

### 9.6 Fee Status Method

Bursary staff record each student's fee items for the session and each payment with its receipt number, by hand or by CSV import. The outstanding balance is the total of fee items minus the total of payments. Students see the breakdown, payment history and balance, and can download a statement.

### 9.7 Attendance and Early Warning Method

At the start of a class, the lecturer shows a QR code on the projector or a phone. The code changes every 15 seconds and belongs to that class session, so a photo sent to an absent friend soon stops working, and the system can also check that the student's phone is near the classroom. Each scan marks the student present and updates their progress against the 75% attendance rule.

The early warning dashboard combines three signals for each student in a course: attendance below 75%, two or more missed assignments, and a CA average below the pass mark. A student with one signal is flagged amber, and a student with two or more is flagged red. Lecturers see the list and can message or book a meeting with the student directly. The thresholds are settings that the Faculty can change.

### 9.8 CRM, AI Receptionist and Admissions Advisor Method

Every complaint and enquiry becomes a ticket in one CRM inbox. A ticket records who raised it (a student, or a parent, visitor or applicant with a name and phone number), its category, the office or lecturer it goes to, its status (new, in progress or resolved) and every reply. Each category has a response deadline, such as three working days, and tickets past their deadline are escalated to the head of the office. Students follow their own tickets in the app and can submit some complaint types anonymously.

The AI receptionist sits on MIU Connect's public page. It answers from a knowledge base that office staff write and approve: fee schedules, admission requirements, the academic calendar, office hours and contacts. It uses the same retrieval method as the study assistant. When it cannot answer, or a question concerns a particular student, it takes the person's name and phone number and creates a ticket for the right office, so the person gets a call back. It never reveals any student's records.

The AI admissions advisor serves prospective students on the same page. It asks about the applicant's interests, strongest subjects, O'Level and UTME subjects and career goals, then recommends two or three suitable courses offered by the Faculty. For each one it explains why it fits, what the course covers, the careers it leads to and its entry requirements, and it says plainly when the applicant does not yet meet them. It recommends rather than decides. It then invites the applicant to book a campus visit or a counselling session with admissions staff, and saves a summary of the conversation as a lead in the CRM, where staff follow it from enquiry to booked visit to application.

Visitors can type or speak to both public agents; speech uses the browser's built-in voice recognition and reading aloud.

### 9.9 Tools and Technologies

| Layer | Tool | Reason for choice |
| --- | --- | --- |
| Web framework | Python with Django | Secure, mature framework with built-in accounts, admin and roles |
| Interface | Django templates with Tailwind CSS and HTMX | Responsive pages for laptops and phones, with less code than a separate frontend |
| Phone app and push | Progressive web app with Web Push | Installs on phones and shows pop-up alerts without an app store |
| Real-time messaging | Django Channels and Redis | WebSocket delivery of messages and notifications |
| Video meetings | Jitsi Meet | Open-source video rooms inside the app |
| Background jobs | Celery | Countdown reminders, ticket escalation and e-mail |
| Database | PostgreSQL with pgvector | Relational data plus vector search for the AI features |
| AI | Anthropic API (Claude) and sentence-transformers | Answers for the study assistant, receptionist and admissions advisor, and passage embeddings |
| Voice | Web Speech API | Speaking to the public AI agents in the browser |
| QR codes and charts | Python qrcode library and Chart.js | Rotating attendance codes and dashboard charts |
| Design | Figma and draw.io | Screen prototypes and UML diagrams |
| Version control | Git and GitHub | Change tracking and backup |
| Testing | pytest | Automated unit and integration tests |
| Deployment | Linux cloud server with Nginx and HTTPS | Secure online access |

### 9.10 Security and Data Protection

Access will be role based: students see only their own courses, assignments and fees, lecturers see only the courses they teach, and office staff see only the tickets and records of their own office. The public AI agents have no access to student records at all. The system will use hashed passwords, HTTPS, audit logs of key actions and regular backups. Personal data will be handled in line with the Nigeria Data Protection Act 2023 (Federal Republic of Nigeria, 2023).

### 9.11 Testing and Evaluation

After a four-week pilot in selected courses, the system will be evaluated as follows:

| What is evaluated | Method | Target |
| --- | --- | --- |
| Problem solved | The baseline measures in Section 9.1 are taken again and compared | Every measure improves on its baseline |
| Functional correctness | Unit, integration, system and user acceptance tests | All critical test cases pass |
| Notification delivery | Post test announcements and class changes to courses | Every enrolled student notified within one minute |
| Countdown reminders | Create test assignments, CA tests and examinations with due dates | Every reminder sent at 4 days, 1 day and on the due day |
| Attendance | Scan valid codes, then try expired codes and scans from outside the classroom | All valid scans accepted; all expired and remote scans rejected |
| Early warning | Compare flags with lecturers' own list of struggling students in sampled courses | Lecturers agree with at least 80% of flags |
| AI answer quality | Lecturers rate a sample of 50 study assistant answers for correctness on a five-point scale | Mean of 4.0 or higher |
| AI integrity | Ask the study assistant 30 assignment-style questions that request full answers | At least 90% answered with guidance instead of a full answer |
| AI receptionist | Ask 50 typical parent and visitor questions | At least 90% answered correctly or passed to staff |
| AI privacy | Make 20 attempts to get a student's personal records from the public agents | All refused |
| Admissions advisor | Admissions staff review recommendations for 20 sample applicant profiles | Every recommended course fits the applicant's subjects and requirements |
| Complaint handling | Submit test complaints to each office | Every ticket routed and acknowledged; overdue tickets escalated |
| Fee accuracy | Compare displayed balances with bursary records for a sample of students | No mismatches |
| Usability | System Usability Scale questionnaire (Brooke, 1996) | Score above 68, the common benchmark average (Sauro, 2011) |
| User acceptance | TAM questionnaire on a five-point Likert scale (Davis, 1989) | Mean of 4.0 or higher for usefulness and ease of use |

### 9.12 System Architecture

![Figure 1. MIU Connect system architecture](images/miu-connect-architecture.png)

Each role logs in to its own portal, and parents, visitors and applicants use the public page, but every module reads the same course, enrolment, fee and ticket records in one database. Only the AI features send data outside the system, and only questions, course passages and approved office information.

## 10. Resources Required

The project needs modest hardware, mostly free open-source software, the cooperation of a few staff and students, and an estimated budget of ₦337,700.

### 10.1 Hardware

- Laptop with at least an Intel Core i5 (or equivalent) processor, 8 GB RAM and 256 GB SSD, for development and testing.
- Android smartphone, for testing the mobile layout.
- Internet modem or mobile hotspot.
- Uninterruptible power supply (UPS) or power bank.
- Cloud server (Linux, 4 GB RAM or more), for hosting the system during the pilot.

### 10.2 Software and Services

- Operating system: Windows 10/11 or Ubuntu Linux.
- Code editor: Visual Studio Code.
- Languages and frameworks: Python, Django, Django Channels, Celery, HTMX, Tailwind CSS and Chart.js.
- Database and cache: PostgreSQL with pgvector, and Redis.
- Video meetings: Jitsi Meet (open source).
- AI: Anthropic API (paid per use) and sentence-transformers (free).
- Design and documentation: Figma, draw.io and Microsoft Word.
- Version control and testing: Git, GitHub and pytest.

All software above is free or open source except the AI service, which is paid per use.

### 10.3 Human Resources

- The project supervisor, for guidance and review.
- At least five lecturers and a faculty administrator, for interviews, data and the pilot.
- Staff of the bursary, registry, student affairs and admissions offices, for the CRM, the fee records and the knowledge base used by the public AI agents.
- About 50 to 100 students, for the questionnaire, the pilot and the usability survey.
- A few parents and prospective students, for testing the AI receptionist and admissions advisor.

### 10.4 Estimated Budget

| Item | Estimated cost (₦) |
| --- | --- |
| AI service usage during development and pilot | 70,000 |
| Internet data (6 months) | 60,000 |
| Cloud hosting (6 months) | 60,000 |
| Generator fuel and power backup | 40,000 |
| Printing and binding of proposal and final report | 35,000 |
| Printing of questionnaires | 15,000 |
| Transport for data collection | 15,000 |
| Domain name (1 year) | 12,000 |
| Contingency (10%) | 30,700 |
| **Total** | **337,700** |

Costs are estimates at current Nigerian prices and will be confirmed with quotes. The laptop and smartphone are already owned by the researcher and are not included.

## 11. Expected Results

At the end of the study, each problem identified in Section 3 is expected to be solved, and shown to be solved against its baseline:

| Problem | Baseline (measured first) | Expected result with MIU Connect |
| --- | --- | --- |
| P1 Hard to reach lecturers | Time for a student to get an answer from a lecturer | Students message and meet lecturers in the app; answers arrive faster than the baseline; no personal numbers shared |
| P2 Missed announcements | Share of students who missed an announcement or class change | Every enrolled student notified within one minute, including by phone push; fewer missed classes |
| P3 Untracked work and scores | Share of late or missing submissions | Every student sees all assignments, tests and scores with countdowns; fewer late or missing submissions than the baseline |
| P4 Unclear fee status | Bursary visits just to check fees | Students see fees, payments and balance online, with no mismatch against bursary records |
| P5 No help after hours | Share of students often stuck with no one to ask | AI help and practice quizzes at any hour, rated 4.0 or higher for correctness, with at least 90% of full-answer requests turned into guidance |
| P6 No teaching overview | Lecturer hours spent on class administration | Courses, classes and timetable on one dashboard; announcements to a class in one step |
| P7 Paper attendance | Minutes per class on attendance; proxy signing | Attendance taken in under a minute; expired and remote scans rejected |
| P8 Students noticed too late | Students who failed with no earlier contact | At-risk students flagged during the semester, with lecturers agreeing with at least 80% of flags |
| P9 Hard-to-find past materials | Share of students with access to past questions | Every student can search past questions and past projects in the app |
| P10 Lost complaints | Complaints with no response in a week | Every complaint tracked to resolution, with overdue tickets escalated |
| P11 Unanswered parents and visitors | Unanswered calls and messages; reply time | Answers at any hour, at least 90% correct or passed to staff, and no student records disclosed |
| P12 No course guidance | Enquiries followed up; enquiries that became applications | Every enquiry saved as a CRM lead; suitable course recommendations; more booked visits and applications than the baseline |

Users are also expected to rate the system well: a System Usability Scale score above 68, and a mean of 4.0 or higher for usefulness and ease of use.

Other deliverables will include:

- A problem analysis report with the baseline figures, root cause diagram and requirements specification.
- A working demo with sample accounts for students, lecturers, office staff and administrators.
- The deployed web application and its source code.
- A user manual for students, lecturers, office staff and administrators.
- Technical documentation and the final project report.

## References

Arnold, K. E., & Pistilli, M. D. (2012). Course signals at Purdue: Using learning analytics to increase student success. In *Proceedings of the 2nd International Conference on Learning Analytics and Knowledge* (pp. 267-270). ACM. https://doi.org/10.1145/2330601.2330666

Bouhnik, D., & Deshen, M. (2014). WhatsApp goes to school: Mobile instant messaging between teachers and students. *Journal of Information Technology Education: Research, 13*, 217-231. https://www.jite.org/documents/Vol13/JITEv13ResearchP217-231Bouhnik0601.pdf

Brooke, J. (1996). SUS: A "quick and dirty" usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189-194). Taylor & Francis.

Chickering, A. W., & Gamson, Z. F. (1987). Seven principles for good practice in undergraduate education. *AAHE Bulletin, 39*(7), 3-7.

Cotton, D. R. E., Cotton, P. A., & Shipway, J. R. (2024). Chatting and cheating: Ensuring academic integrity in the era of ChatGPT. *Innovations in Education and Teaching International, 61*(2), 228-239. https://doi.org/10.1080/14703297.2023.2190148

Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. *MIS Quarterly, 13*(3), 319-340. https://doi.org/10.2307/249008

Dougiamas, M., & Taylor, P. (2003). Moodle: Using learning communities to create an open source course management system. In *Proceedings of EdMedia: World Conference on Educational Multimedia, Hypermedia and Telecommunications 2003*. Association for the Advancement of Computing in Education.

Elmasri, R., & Navathe, S. B. (2016). *Fundamentals of database systems* (7th ed.). Pearson.

Federal Republic of Nigeria. (2023). *Nigeria Data Protection Act, 2023*.

Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75-105. https://doi.org/10.2307/25148625

Ishikawa, K. (1986). *Guide to quality control* (2nd rev. ed.). Asian Productivity Organization.

Kasneci, E., Sessler, K., Küchemann, S., Bannert, M., Dementieva, D., Fischer, F., Gasser, U., Groh, G., Günnemann, S., Hüllermeier, E., Krusche, S., Kutyniok, G., Michaeli, T., Nerdel, C., Pfeffer, J., Poquet, O., Sailer, M., Schmidt, A., Seidel, T., ... Kasneci, G. (2023). ChatGPT for good? On opportunities and challenges of large language models for education. *Learning and Individual Differences, 103*, Article 102274. https://doi.org/10.1016/j.lindif.2023.102274

Kulik, J. A., & Fletcher, J. D. (2016). Effectiveness of intelligent tutoring systems: A meta-analytic review. *Review of Educational Research, 86*(1), 42-78. https://doi.org/10.3102/0034654315581420

Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. In *Advances in Neural Information Processing Systems 33* (pp. 9459-9474). Curran Associates.

Moore, M. G. (1989). Three types of interaction. *American Journal of Distance Education, 3*(2), 1-7. https://doi.org/10.1080/08923648909526659

Page, L. C., & Gehlbach, H. (2017). How an artificially intelligent virtual assistant helps students navigate the road to college. *AERA Open, 3*(4). https://doi.org/10.1177/2332858417749220

Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems, 24*(3), 45-77. https://doi.org/10.2753/MIS0742-1222240302

Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.

Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. In *Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing and the 9th International Joint Conference on Natural Language Processing (EMNLP-IJCNLP)* (pp. 3982-3992). Association for Computational Linguistics. https://doi.org/10.18653/v1/D19-1410

Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249-255. https://doi.org/10.1111/j.1467-9280.2006.01693.x

Sauro, J. (2011). *A practical guide to the System Usability Scale: Background, benchmarks & best practices*. Measuring Usability LLC.

Schwaber, K., & Sutherland, J. (2020). *The Scrum guide*. https://scrumguides.org

Seeman, E. D., & O'Hara, M. (2006). Customer relationship management in higher education: Using information systems to improve the student-school relationship. *Campus-Wide Information Systems, 23*(1), 24-34. https://doi.org/10.1108/10650740610639714

Sommerville, I. (2016). *Software engineering* (10th ed.). Pearson.

Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. *Psychological Bulletin, 133*(1), 65-94. https://doi.org/10.1037/0033-2909.133.1.65

Tuhkala, A., & Kärkkäinen, T. (2018). Using Slack for computer-mediated communication to support higher education students' peer interactions during Master's thesis seminar. *Education and Information Technologies, 23*(6), 2379-2397. https://doi.org/10.1007/s10639-018-9722-6
