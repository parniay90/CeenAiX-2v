/*
  # Add Sample Messages Data (Updated)

  1. Sample Data
    - Add sample messages between patient and doctors (using real user IDs)
    - Add sample call history
    - Add various message types (appointments, prescriptions, test results)
*/

-- Insert sample messages (using actual user IDs)
INSERT INTO messages (sender_id, recipient_id, subject, body, is_read, is_starred, created_at, read_at) VALUES
-- From Dr. Sara to Patient
('86f9af12-bde5-4fa3-84fe-6539828dd433', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 
 'MRI Brain Results - Follow-up Required', 
 'Dear Patient,

I hope this message finds you well. I have reviewed your recent MRI Brain scan dated March 18, 2026, and I am pleased to inform you that the results show no acute abnormalities.

Key Findings:
• No evidence of hemorrhage, mass effect, or midline shift
• Normal gray-white matter differentiation
• Age-appropriate ventricle size
• Clear paranasal sinuses

Based on these results, no immediate intervention is required. However, I would like to schedule a follow-up appointment in 6 months to monitor your condition and address any concerns you may have.

Please feel free to reach out if you have any questions about these results or if you experience any new symptoms.

Best regards,
Dr. Sara Mitchell, MD
Neurologist
Dubai Medical Center',
 true, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

-- From Dr. Mohammed to Patient
('5ff7b982-0e9c-4710-9606-4b52f1a8e42a', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Lab Results Available - Cholesterol Panel',
 'Hello,

Your recent cholesterol panel results are now available. Overall, your lipid profile is within acceptable ranges, though there are some areas we should discuss.

Results Summary:
• Total Cholesterol: 195 mg/dL (Borderline high)
• LDL Cholesterol: 125 mg/dL (Near optimal)
• HDL Cholesterol: 52 mg/dL (Good)
• Triglycerides: 145 mg/dL (Normal)

Recommendations:
1. Continue current diet and exercise regimen
2. Increase omega-3 fatty acid intake
3. Recheck levels in 3 months

Please schedule an appointment if you would like to discuss these results in detail or have any concerns.

Take care,
Dr. Mohammed Chen, MD
Internal Medicine',
 true, false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),

-- From Patient to Dr. Ahmed
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0b5cb22-0adb-46b9-9ad2-784c399a5506',
 'Question about Knee Pain Management',
 'Dear Dr. Ahmed,

Thank you for reviewing my knee X-ray. I have been following your recommendations for the past week, and I have a few questions:

1. The pain seems to be worse in the morning. Is this normal?
2. Can I continue my regular walking routine, or should I limit it?
3. How long should I wait before starting physical therapy?

I have been taking the NSAIDs as prescribed and using ice packs regularly. The swelling has reduced slightly, but I want to make sure I am doing everything correctly.

I would appreciate your guidance on these matters.

Thank you,
Patient',
 false, false, NOW() - INTERVAL '1 day', NULL),

-- From Dr. Ahmed reply
('c0b5cb22-0adb-46b9-9ad2-784c399a5506', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'RE: Question about Knee Pain Management',
 'Hello,

Thank you for your message. I am glad to hear that the swelling is improving. Let me address your questions:

1. Morning stiffness is common with osteoarthritis. This should improve as you move throughout the day. Consider doing gentle stretches before getting out of bed.

2. Walking is actually beneficial! Continue your routine, but listen to your body. If you experience sharp pain, rest for a day or two.

3. You can start physical therapy now. I will send you a referral. Early intervention often leads to better outcomes.

Additional Tips:
• Apply heat in the morning to reduce stiffness
• Continue ice after activities
• Consider using a knee brace for support during exercise

Please let me know if you have any other concerns. I am here to help!

Best regards,
Dr. Ahmed Al-Mansoori, MD
Orthopedic Surgery',
 true, false, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '3 hours'),

-- Appointment Confirmation
('86f9af12-bde5-4fa3-84fe-6539828dd433', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Appointment Confirmed - March 25, 2026',
 'Dear Patient,

This is to confirm your upcoming appointment:

Date: March 25, 2026
Time: 2:30 PM
Provider: Dr. Sara Mitchell, MD
Department: Neurology
Location: Dubai Medical Center, Building A, 3rd Floor

Appointment Type: Follow-up Consultation
Duration: 30 minutes

Please arrive 15 minutes early to complete any necessary paperwork. If you need to reschedule, please contact our office at least 24 hours in advance.

What to Bring:
• Insurance card
• Photo ID
• List of current medications
• Any relevant medical records

Looking forward to seeing you!

Dubai Medical Center
Patient Services',
 false, false, NOW() + INTERVAL '4 days', NULL),

-- Prescription Refill Notification
('5ff7b982-0e9c-4710-9606-4b52f1a8e42a', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Prescription Refill Approved - Lisinopril',
 'Hello,

Your prescription refill request has been approved and sent to your preferred pharmacy.

Medication Details:
• Medication: Lisinopril 10mg
• Quantity: 90 tablets
• Refills: 3
• Pharmacy: Dubai Pharmacy, Main Branch

Your prescription will be ready for pickup within 24 hours. Please bring your insurance card and a valid ID when picking up your medication.

Important Reminders:
• Take this medication once daily in the morning
• Monitor your blood pressure regularly
• Report any side effects immediately
• Do not stop taking without consulting your doctor

If you have any questions about this medication, please contact our office.

Best regards,
Dr. Mohammed, MD',
 true, false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

-- Urgent Message
('6ee166b3-d75f-49e8-8b6f-01fb4357a032', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'URGENT: Emergency Contact Information Update Required',
 'Dear Patient,

This is an urgent notice regarding your medical records.

We noticed that your emergency contact information on file is incomplete. For your safety and to ensure we can reach your designated contacts in case of an emergency, please update this information as soon as possible.

To update your information:
1. Log into your patient portal
2. Navigate to "Profile Settings"
3. Update "Emergency Contacts" section
4. Save changes

Required Information:
• Primary emergency contact name
• Relationship to patient
• Phone number (mobile preferred)
• Secondary emergency contact (optional but recommended)

This update is crucial for your care and safety. Please complete this within 48 hours.

If you need assistance, please contact our office at (04) 123-4567.

Thank you for your prompt attention to this matter.

Dubai Medical Center
Patient Records Department',
 false, true, NOW() - INTERVAL '12 hours', NULL),

-- Wellness Newsletter
('44f5bfb2-788c-4052-ad6e-31a75fee1a07', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Monthly Wellness Newsletter - March 2026',
 'Welcome to Your Monthly Wellness Newsletter!

This month''s focus: Heart Health Awareness

Article Highlights:
🫀 Understanding Your Cholesterol Numbers
Learn what your lipid panel results mean and how to maintain healthy cholesterol levels through diet and exercise.

🏃‍♂️ 5 Simple Exercises for a Healthy Heart
Discover easy-to-follow cardiovascular exercises you can do at home or at the gym.

🥗 Heart-Healthy Mediterranean Diet Recipes
Try our doctor-approved recipes that are both delicious and good for your heart.

Upcoming Events:
• Free Blood Pressure Screening: March 22-24
• Heart Health Seminar: March 28, 6:00 PM
• Nutrition Workshop: April 5, 10:00 AM

Health Tip of the Month:
Aim for at least 150 minutes of moderate-intensity aerobic activity per week. Even brisk walking counts!

Stay healthy and take care,
Dubai Medical Center Wellness Team',
 false, false, NOW() - INTERVAL '7 days', NULL);

-- Insert sample call history
INSERT INTO call_history (caller_id, recipient_id, call_type, status, duration, started_at, ended_at) VALUES
-- Video call with Dr. Sara
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '86f9af12-bde5-4fa3-84fe-6539828dd433', 
 'video', 'completed', 1245, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '1245 seconds'),

-- Audio call with Dr. Mohammed
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '5ff7b982-0e9c-4710-9606-4b52f1a8e42a',
 'audio', 'completed', 380, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '380 seconds'),

-- Missed call from Dr. Ahmed
('c0b5cb22-0adb-46b9-9ad2-784c399a5506', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'audio', 'missed', 0, NOW() - INTERVAL '1 day', NULL),

-- Video call with Dr. Sara (recent)
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '86f9af12-bde5-4fa3-84fe-6539828dd433',
 'video', 'completed', 892, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours' + INTERVAL '892 seconds'),

-- Audio call with Dr. Fatima (short call)
('6ee166b3-d75f-49e8-8b6f-01fb4357a032', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'audio', 'completed', 125, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '125 seconds');