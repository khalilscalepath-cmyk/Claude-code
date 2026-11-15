# Final Year Project: MIU Connect

Khalil Lawan Ahmed · MIU/23/CMP/SEN/378 · Department of Software Engineering, Faculty of Computing, Mewar International University, Nigeria

**Topic:** Design and Implementation of an AI-Assisted All-in-One Campus Communication and Student Services Platform (A Case Study of the Faculty of Computing, Mewar International University, Nigeria)

**Status:** Proposal written. Waiting for topic approval from the supervisor. Building starts after approval.

**The idea in one line:** one app instead of WhatsApp, Instagram, phone calls and office visits, for students, lecturers, office staff, parents and prospective students.

This folder is the single home for the project: the proposal, the code, the data collection forms and the final report all live here, so nothing gets lost.

## What is in this folder

| Path | What it is |
| --- | --- |
| `proposal/miu-connect-proposal.docx` | The project proposal as a Word file (Times New Roman 12, 1.5 spacing), ready to print or submit |
| `proposal/miu-connect-proposal.md` | The same proposal as text, for editing and tracking changes |
| `proposal/images/` | Figure 1, the system architecture diagram |
| `coordinator-exercise/` | The separate class exercise: a proposal for the Project Coordinator Unit's project coordination system (MIU ProjectHub) |

Folders still to come:

| Path | What it will hold |
| --- | --- |
| `data-collection/` | Student questionnaire, interview questions for lecturers and offices, and the baseline results |
| `app/` | The MIU Connect source code (Django), with demo accounts |
| `report/` | The final project report, chapter by chapter |

## Live editable copies

- MIU Connect proposal: https://claude.ai/artifact/RFiEbVhxyB8v4cvy6oJ5bK
- Project coordination proposal (exercise): https://claude.ai/artifact/LikE2nagnBVqSL4Cf1Hapo

When a live copy changes, export it again and replace the file here, so this folder always holds the latest version.

## Who uses it

| User | Logs in? | What they get |
| --- | --- | --- |
| Student | Yes | Courses and lecturers, timetable, announcements, Upcoming page with countdowns, assignments and CA scores, attendance record, library, AI study assistant and quizzes, fee status, complaints, messages and meetings |
| Lecturer | Yes | Courses, classes and timetable, announcements and class schedule, QR attendance, assignments and grading, course materials, early warning dashboard, messages and meetings |
| Office staff (bursary, registry, student affairs, admissions) | Yes | CRM inbox for complaints and enquiries, fee records, admissions leads |
| Parents, visitors and prospective students | No | AI receptionist and AI admissions advisor on the public page, with call backs and visit booking |

## The problems and how MIU Connect solves them

| No. | Problem | Solution |
| --- | --- | --- |
| P1 | Students cannot reach lecturers easily | Direct messages, course channels, meetings with video calls inside the app |
| P2 | Announcements and class changes are missed | Announcements and class schedule (physical or online), with phone push notifications |
| P3 | Assignments, tests and scores are not tracked | Upcoming page with countdowns, reminders at 4 days, 1 day and on the due day, and CA scores |
| P4 | Fee status is unclear | Fee page with fees, payments and balance |
| P5 | No help outside class hours | AI study assistant that guides from course notes, plus practice quizzes |
| P6 | Lecturers lack one view of their teaching | Lecturer dashboard of courses, levels, class lists and timetable |
| P7 | Paper attendance is easy to fake | QR attendance with codes that change every 15 seconds, tracked against the 75% rule |
| P8 | Struggling students are noticed too late | Early warning dashboard (attendance, missed work, CA scores) |
| P9 | Past questions and past projects are hard to find | Digital library |
| P10 | Student complaints get lost | Complaint tickets to a lecturer or office, with deadlines and escalation |
| P11 | Parents and visitors get no answer, especially after hours | AI receptionist that answers at any hour and creates call-back tickets |
| P12 | Prospective students lack course guidance | AI admissions advisor that recommends courses with reasons and books visits, with leads tracked in the CRM |

## Plan

| Step | Work | Done |
| --- | --- | --- |
| 0 | Proposal | Yes |
| 1 | Topic approval from the supervisor | |
| 2 | Questionnaire and interviews; record baseline figures | |
| 3 | Sprint 1: logins, roles, demo accounts, data import, dashboards (P6) | |
| 4 | Sprint 2: announcements, class schedule, phone push notifications (P2) | |
| 5 | Sprint 3: course channels, direct messages, meetings with video (P1) | |
| 6 | Sprint 4: assignments, CA scores, Upcoming countdowns, QR attendance (P3, P7) | |
| 7 | Sprint 5: course materials, library, AI study assistant and quizzes (P5, P9) | |
| 8 | Sprint 6: CRM inbox, complaints, AI receptionist, AI admissions advisor (P10, P11, P12) | |
| 9 | Sprint 7: fee status and early warning dashboard (P4, P8) | |
| 10 | Sprint 8: testing, deployment, pilot preparation | |
| 11 | Pilot, evaluation against the baseline, usability survey | |
| 12 | Final report: Chapters 1 to 5, abstract, appendices | |

## Decisions so far

- **Stack:** Python and Django, Django templates with Tailwind CSS and HTMX, installable on phones as a web app with push notifications, PostgreSQL with pgvector, Redis, Celery, Jitsi Meet for video, and Claude through the Anthropic API for the AI features.
- **Demo first:** the system is built as a working demo with sample accounts for students, lecturers and office staff, then piloted in selected courses.
- **Fees:** the system shows fee records only. It does not take payments.
- **Study assistant:** answers from the lecturer's own course materials, shows its sources, and gives guidance instead of complete assignment answers.
- **Public AI agents:** answer only from information approved by office staff, never reveal a student's records, and pass anything else to staff as a CRM ticket. The admissions advisor recommends; it does not decide.
- **Voice:** visitors can speak to the public agents in the browser; a real phone line is outside the scope.
- **Data:** all survey answers, baseline figures and test results must come from real people and records at MIU.
- **Writing style:** no em dashes in any document.
