# Final Year Project: MIU Connect

Khalil Lawan Ahmed · MIU/23/CMP/SEN/378 · Department of Software Engineering, Faculty of Computing, Mewar International University, Nigeria

**Topic:** Design and Implementation of an AI-Assisted Student and Lecturer Communication Platform with Assignment Tracking and Fee Status Monitoring (A Case Study of the Faculty of Computing, Mewar International University, Nigeria)

**Status:** Proposal written. Waiting for topic approval from the supervisor or Project Coordinator.

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
| `data-collection/` | Student questionnaire, lecturer and bursary interview questions, and the baseline results |
| `app/` | The MIU Connect source code (Django) |
| `report/` | The final project report, chapter by chapter |

## Live editable copies

The proposals also exist as live documents on claude.ai, where they can be edited and commented on:

- MIU Connect proposal: https://claude.ai/artifact/RFiEbVhxyB8v4cvy6oJ5bK
- Project coordination proposal (exercise): https://claude.ai/artifact/LikE2nagnBVqSL4Cf1Hapo

When a live copy changes, export it again and replace the file here, so this folder always holds the latest version.

## The problems and how MIU Connect solves them

| No. | Problem | Solution |
| --- | --- | --- |
| P1 | Students cannot reach lecturers easily | Direct messages and course channels, with lecturer office hours |
| P2 | Announcements and class changes are missed | Announcements and a class schedule marked physical or online, with instant notifications |
| P3 | Assignments and deadlines are not tracked | Assignment tracker with submission, pending and overdue lists, and reminders |
| P4 | Fee status is unclear | Fee page with fees, payments and outstanding balance |
| P5 | No help outside class hours | AI study assistant that guides from course materials without writing assignments |
| P6 | Lecturers lack one view of their teaching | Lecturer dashboard of courses, levels, class lists and timetable |

## Plan

| Step | Work | Done |
| --- | --- | --- |
| 0 | Proposal | Yes |
| 1 | Topic approval from supervisor or coordinator | |
| 2 | Questionnaire and interviews; record baseline figures | |
| 3 | Sprint 1: logins, roles, data import, dashboards (P6) | |
| 4 | Sprint 2: announcements, class schedule, notifications (P2) | |
| 5 | Sprint 3: course channels and direct messages (P1) | |
| 6 | Sprint 4: assignments, submission, tracking, reminders (P3) | |
| 7 | Sprint 5: course materials and AI study assistant (P5) | |
| 8 | Sprint 6: fee status, testing, deployment (P4) | |
| 9 | Pilot, evaluation against the baseline, usability survey | |
| 10 | Final report: Chapters 1 to 5, abstract, appendices | |

## Decisions so far

- **Stack:** Python and Django, Django templates with Tailwind CSS and HTMX, PostgreSQL with pgvector, Redis, Celery, and Claude through the Anthropic API for the AI assistant.
- **Fees:** the system shows fee records only. It does not take payments.
- **AI assistant:** answers from the lecturer's own course materials, shows its sources, and gives guidance instead of complete assignment answers.
- **Data:** all survey answers, baseline figures and test results must come from real people and records at MIU.
- **Writing style:** no em dashes in any document.
