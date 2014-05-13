As an admin, I want to add/edit/delete students to the class, so that I can track their attendance.

As a student, I want to be able to sign-in, so that the time I showed up is recorded.

As an admin, I want students to be marked asbent if they don't sign in.

As an admin, I want to edit a students' attendance record.

As a student, I want to see a auto-fill preview of my full name when I start typing to save me time.

As a student, I want to be notified that I've already signed in if I try to sign in again on the same day.




Models:

-Student
-Admin
-Day
-A


Sudent has_many attendances
Attendance belongs_to date



