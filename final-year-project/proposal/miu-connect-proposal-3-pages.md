# Final Year Project Proposal

**Khalil Lawan Ahmed** (MIU/23/CMP/SEN/378) · Department of Software Engineering, Faculty of Computing, Mewar International University, Nigeria · 26 November 2026

## 1. Title

**Design and Implementation of an AI-Assisted All-in-One Campus Communication and Student Services Platform (A Case Study of the Faculty of Computing, Mewar International University, Nigeria).** Proposed system name: **MIU Connect**.

## 2. Background of the Study

Regular contact between students and lecturers is central to learning (Chickering & Gamson, 1987). In many Nigerian universities this contact is informal: students search offices for lecturers, rely on class representatives, and follow announcements in WhatsApp groups, where notices are buried under social chat (Bouhnik & Deshen, 2014). Assignments, attendance, past questions, complaints and fee enquiries are just as scattered, and parents and prospective students who call after office hours often get no answer. The University's portal handles official records such as course registration, but not this daily communication. Messaging platforms and large language models now make one education-specific platform practical (Tuhkala & Kärkkäinen, 2018; Kasneci et al., 2023).

## 3. Statement of the Problem

Students, lecturers, offices, parents and applicants have no single place to communicate. The root cause is the absence of one platform that links people, courses and records. The study will confirm and measure each problem, then solve it:

| No. | Problem | Solution in MIU Connect |
| --- | --- | --- |
| P1 | Students cannot reach lecturers easily | Direct messages, course channels and video meetings inside the app |
| P2 | Announcements and class changes are missed | Announcements, a physical or online class schedule, and phone push alerts |
| P3 | Assignments, tests and scores are not tracked | Upcoming page with countdown reminders, and CA scores |
| P4 | Fee status is unclear | Fee page showing payments and balance |
| P5 | No help outside class hours | AI study assistant grounded in course notes, with practice quizzes |
| P6 | Lecturers lack one view of their teaching | Lecturer dashboard of courses, classes and timetable |
| P7 | Paper attendance is easy to fake | QR attendance with rotating codes, tracked against the 75% rule |
| P8 | Struggling students are noticed too late | Early warning dashboard |
| P9 | Past questions and projects are hard to find | Digital library |
| P10 | Student complaints get lost | Complaint tickets with deadlines and escalation |
| P11 | Parents and visitors get no answer | AI receptionist that creates call-back tickets in a CRM inbox |
| P12 | Applicants lack course guidance | AI admissions advisor that recommends courses and books visits |

## 4. Research Questions

1. What communication and service problems do students, lecturers, offices, parents and applicants face, and how large are they?
2. How can one platform replace scattered channels for messaging, meetings, announcements and tracking of work and attendance?
3. How can AI assistants support learning, enquiries and admissions while protecting integrity and privacy?
4. To what extent does the system solve the measured problems, and how well do users accept it?

## 5. Aim and Objectives

**Aim:** To solve the communication and student service problems of the Faculty of Computing by designing and implementing MIU Connect, an AI-assisted all-in-one platform for students, lecturers, offices, parents and prospective students. **Objectives:**

1. Identify and measure the problems and their root cause.
2. Build role-based portals with messaging, meetings and announcements.
3. Build the assignment, countdown, attendance and early warning modules.
4. Build the AI study assistant, practice quizzes and digital library.
5. Build fee status, the CRM, the AI receptionist and the AI admissions advisor.
6. Evaluate the system against the baseline measured in objective 1.

## 6. Significance of the Study

Students reach lecturers, track all work and fees, and get help at any hour. Lecturers save administrative time and spot struggling students early. Offices handle complaints and enquiries in one tracked inbox, and parents and applicants get answers after hours. The University gains a tested prototype it can extend to other faculties or connect to its portal.

## 7. Scope and Limitations

**Scope:** undergraduate students, lecturers and offices of the Faculty of Computing, plus parents and applicants on a public page; four login roles; a responsive web app built first as a demo with sample accounts, then piloted. **Limitations:** fees are shown, not paid; the system is standalone, with portal integration left as future work; the AI features need internet and a paid service, give general information only and never reveal a student's records; the public agents use web chat and browser voice, not a phone line; the pilot covers one faculty in one session.

## 8. Literature Review

Chickering and Gamson (1987) rank student and faculty contact first among good practices, and teachers already value WhatsApp for its ease and immediacy (Bouhnik & Deshen, 2014). A Slack pilot made it easier for students to ask questions, but its authors recommended an education-specific platform (Tuhkala & Kärkkäinen, 2018). Early warning systems such as Purdue's Course Signals flag at-risk students from grades and engagement (Arnold & Pistilli, 2012), and practice tests improve long-term retention more than re-reading (Roediger & Karpicke, 2006). Large language models can explain concepts and personalise help (Kasneci et al., 2023) but raise integrity risks (Cotton et al., 2024); retrieval-augmented generation grounds answers in approved documents (Lewis et al., 2020). CRM can improve how universities serve students (Seeman & O'Hara, 2006), and an AI assistant raised on-time enrolment by 3.3 percentage points at Georgia State University (Page & Gehlbach, 2017). **Gap:** WhatsApp, Slack, learning management systems, portals and general chatbots each solve part of the problem; no low-cost platform built around a Nigerian faculty's own courses, offices and records combines them.

## 9. Research Methodology

The study follows the Design Science Research Methodology: identify and measure the problem, define objectives, design and build, demonstrate, evaluate and communicate (Peffers et al., 2007). Problems will be confirmed through a questionnaire for 50 to 100 students, interviews with lecturers and office staff, and document review, and baseline figures will be recorded. The system will be built with Agile Scrum in eight one-week sprints and modelled with UML and an entity relationship diagram, using Python and Django, HTMX and Tailwind CSS, PostgreSQL with pgvector, Redis and Celery, Jitsi Meet, and Claude through the Anthropic API. The AI features retrieve passages from approved materials, cite them, give guidance instead of full assignment answers, and never access student records. After a four-week pilot, the baseline measures will be repeated, and the system will be tested for correct functions, AI accuracy, integrity and privacy, usability with the System Usability Scale (Brooke, 1996) and acceptance with the Technology Acceptance Model (Davis, 1989).

## 10. Resources Required

A laptop (Core i5, 8 GB RAM), an Android phone, internet and power backup; free open-source software plus the paid Anthropic API; a supervisor, about five lecturers, office staff and 50 to 100 students. **Estimated budget: ₦337,700** (AI usage ₦70,000; internet ₦60,000; hosting ₦60,000; power backup ₦40,000; printing and binding ₦35,000; questionnaires ₦15,000; transport ₦15,000; domain ₦12,000; contingency ₦30,700).

## 11. Expected Results

A working MIU Connect demo and pilot in which each of the twelve problems improves on its baseline: every student notified of class changes within one minute, fewer late submissions, attendance taken in under a minute, at-risk students flagged during the semester, complaints tracked to resolution, AI answers rated 4.0 or higher with at least 90% of full-answer requests turned into guidance and no student records disclosed, and a System Usability Scale score above 68.

## References

Arnold, K. E., & Pistilli, M. D. (2012). Course signals at Purdue: Using learning analytics to increase student success. In *Proceedings of the 2nd International Conference on Learning Analytics and Knowledge* (pp. 267-270). ACM. https://doi.org/10.1145/2330601.2330666

Bouhnik, D., & Deshen, M. (2014). WhatsApp goes to school: Mobile instant messaging between teachers and students. *Journal of Information Technology Education: Research, 13*, 217-231.

Brooke, J. (1996). SUS: A "quick and dirty" usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189-194). Taylor & Francis.

Chickering, A. W., & Gamson, Z. F. (1987). Seven principles for good practice in undergraduate education. *AAHE Bulletin, 39*(7), 3-7.

Cotton, D. R. E., Cotton, P. A., & Shipway, J. R. (2024). Chatting and cheating: Ensuring academic integrity in the era of ChatGPT. *Innovations in Education and Teaching International, 61*(2), 228-239. https://doi.org/10.1080/14703297.2023.2190148

Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. *MIS Quarterly, 13*(3), 319-340. https://doi.org/10.2307/249008

Kasneci, E., Sessler, K., Küchemann, S., Bannert, M., Dementieva, D., Fischer, F., Gasser, U., Groh, G., Günnemann, S., Hüllermeier, E., Krusche, S., Kutyniok, G., Michaeli, T., Nerdel, C., Pfeffer, J., Poquet, O., Sailer, M., Schmidt, A., Seidel, T., ... Kasneci, G. (2023). ChatGPT for good? On opportunities and challenges of large language models for education. *Learning and Individual Differences, 103*, Article 102274. https://doi.org/10.1016/j.lindif.2023.102274

Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. In *Advances in Neural Information Processing Systems 33* (pp. 9459-9474). Curran Associates.

Page, L. C., & Gehlbach, H. (2017). How an artificially intelligent virtual assistant helps students navigate the road to college. *AERA Open, 3*(4). https://doi.org/10.1177/2332858417749220

Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems, 24*(3), 45-77. https://doi.org/10.2753/MIS0742-1222240302

Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249-255. https://doi.org/10.1111/j.1467-9280.2006.01693.x

Seeman, E. D., & O'Hara, M. (2006). Customer relationship management in higher education: Using information systems to improve the student-school relationship. *Campus-Wide Information Systems, 23*(1), 24-34. https://doi.org/10.1108/10650740610639714

Tuhkala, A., & Kärkkäinen, T. (2018). Using Slack for computer-mediated communication to support higher education students' peer interactions during Master's thesis seminar. *Education and Information Technologies, 23*(6), 2379-2397. https://doi.org/10.1007/s10639-018-9722-6
