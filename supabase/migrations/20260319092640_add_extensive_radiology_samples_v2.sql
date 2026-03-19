/*
  # Add Extensive Radiology Sample Data

  1. New Sample Data
    - Additional CT scans (brain, abdomen, chest)
    - More X-rays (chest, ankle, spine, hand)
    - MRI studies (knee, shoulder)
    - Ultrasound studies
    - Mix of normal and abnormal findings
    
  2. Features
    - Comprehensive clinical scenarios
    - Different urgency levels (Routine, Urgent, Stat)
    - Various status types (Scheduled, In Progress, Completed, Reviewed)
    - Realistic medical terminology
    - Mix of recent and older studies
*/

-- Get necessary IDs
DO $$
DECLARE
  v_mri_id uuid;
  v_ct_id uuid;
  v_xray_id uuid;
  v_ultrasound_id uuid;
  v_doctor_id uuid;
BEGIN
  SELECT id INTO v_mri_id FROM radiology_categories WHERE name = 'MRI' LIMIT 1;
  SELECT id INTO v_ct_id FROM radiology_categories WHERE name = 'CT Scan' LIMIT 1;
  SELECT id INTO v_xray_id FROM radiology_categories WHERE name = 'X-Ray' LIMIT 1;
  SELECT id INTO v_ultrasound_id FROM radiology_categories WHERE name = 'Ultrasound' LIMIT 1;
  SELECT id INTO v_doctor_id FROM doctors LIMIT 1;

  -- CT Brain - Completed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_ct_id,
    'CT Brain without contrast',
    'Brain',
    'Bilateral',
    'Sudden onset severe headache, rule out hemorrhage',
    'Non-contrast CT brain performed with 5mm slice thickness.',
    E'BRAIN:\n• No acute intracranial hemorrhage\n• No mass effect or midline shift\n• Ventricles and sulci are normal in size\n• Gray-white differentiation is preserved\n\nEXTRA-AXIAL:\n• No extra-axial collections\n• No skull fracture\n\nSINUSES:\n• Paranasal sinuses and mastoid air cells are clear',
    E'Normal non-contrast CT brain.\n\nNo acute intracranial abnormality.\n\nNo hemorrhage identified.',
    E'• Clinical correlation advised\n• Consider MRI for further evaluation if symptoms persist\n• Neurology follow-up recommended',
    'Stat',
    'Completed',
    '2026-03-17 16:20:00+00',
    '2026-03-17 17:00:00+00',
    'Dr. Sarah Mitchell, MD',
    'ACC-2026-007891',
    'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg'
  );

  -- X-Ray Chest - Reviewed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'Chest X-Ray (PA and Lateral)',
    'Chest',
    'Bilateral',
    'Cough and fever for 5 days, rule out pneumonia',
    'PA and lateral chest radiographs.',
    E'LUNGS:\n• Lungs are clear without focal consolidation\n• No pleural effusion or pneumothorax\n• Lung volumes are normal\n\nHEART:\n• Cardiac silhouette is normal in size\n• No cardiomegaly\n\nMEDIASTINUM:\n• Mediastinal contours are normal\n• No hilar adenopathy\n\nBONES:\n• Visualized bones are intact\n• No acute fractures',
    E'Normal chest X-ray.\n\nNo evidence of pneumonia or acute cardiopulmonary abnormality.',
    E'• No imaging follow-up needed\n• Continue clinical management\n• Chest X-ray only if symptoms worsen',
    'Routine',
    'Reviewed',
    '2026-03-14 11:30:00+00',
    '2026-03-14 13:15:00+00',
    'Dr. James Chen, MD',
    'ACC-2026-008234',
    'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg'
  );

  -- MRI Knee - In Progress
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_mri_id,
    'MRI Right Knee without contrast',
    'Knee',
    'Right',
    'Knee pain and swelling after sports injury',
    'Multiplanar T1, T2, and PD sequences of the right knee.',
    E'MENISCI:\n• Medial meniscus shows linear increased signal in posterior horn on T2, concerning for tear\n• Lateral meniscus appears intact\n\nCRUCIATE LIGAMENTS:\n• ACL and PCL are intact\n• No ligament tear\n\nCOLLATERAL LIGAMENTS:\n• MCL and LCL are intact\n\nCARTILAGE:\n• Articular cartilage is preserved\n• No chondral defects\n\nBONE:\n• Bone marrow signal is normal\n• No fracture or bone contusion\n\nJOINT:\n• Moderate joint effusion present\n• No loose bodies',
    E'Likely medial meniscus posterior horn tear.\n\nModerate knee joint effusion.\n\nCruciate and collateral ligaments intact.',
    E'• Orthopedic consultation recommended\n• Consider arthroscopy for definitive diagnosis\n• Conservative management with physical therapy\n• Follow-up MRI in 6 months if symptoms persist',
    'Routine',
    'In Progress',
    '2026-03-19 08:00:00+00',
    '2026-03-19 09:30:00+00',
    'Dr. Sarah Mitchell, MD',
    'ACC-2026-009876',
    '/mri-brain-sagittal.jpg'
  );

  -- CT Abdomen - Reviewed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_ct_id,
    'CT Abdomen and Pelvis with IV contrast',
    'Abdomen and Pelvis',
    'Bilateral',
    'Abdominal pain, rule out appendicitis',
    'CT abdomen and pelvis performed with IV contrast.',
    E'LIVER:\n• Normal size and attenuation\n• No focal lesions\n\nGALLBLADDER:\n• No gallstones or wall thickening\n\nPANCREAS:\n• Pancreas is unremarkable\n\nSPLEEN:\n• Normal size and appearance\n\nKIDNEYS:\n• Both kidneys enhance symmetrically\n• No hydronephrosis or stones\n\nAPPENDIX:\n• Appendix is normal in caliber\n• No periappendiceal inflammation\n\nBOWEL:\n• No bowel obstruction\n• No free air\n\nPELVIS:\n• Bladder is unremarkable\n• No pelvic mass',
    E'Normal CT abdomen and pelvis.\n\nNo acute abdominal pathology.\n\nAppendix appears normal.',
    E'• No surgical intervention required\n• Clinical correlation advised\n• Consider alternative diagnosis\n• Follow-up as needed clinically',
    'Urgent',
    'Reviewed',
    '2026-03-13 14:45:00+00',
    '2026-03-13 16:30:00+00',
    'Dr. Ahmed Al-Mansoori, MD',
    'ACC-2026-010234',
    'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg'
  );

  -- X-Ray Ankle - Reviewed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'X-Ray Ankle (AP, Lateral, Mortise)',
    'Ankle',
    'Left',
    'Ankle injury after fall, unable to bear weight',
    'Three views of the left ankle.',
    E'BONES:\n• No acute fracture of the distal tibia or fibula\n• No fracture of the talus or calcaneus\n• Bone mineralization is normal\n\nJOINTS:\n• Ankle mortise is intact\n• Joint spaces are preserved\n• No subluxation or dislocation\n\nSOFT TISSUES:\n• Mild soft tissue swelling laterally\n• No foreign body',
    E'No acute fracture or dislocation.\n\nMild soft tissue swelling consistent with ankle sprain.',
    E'• Rest, ice, compression, elevation (RICE protocol)\n• Weight bearing as tolerated\n• Follow-up if symptoms worsen\n• Consider MRI if persistent pain after 6 weeks',
    'Urgent',
    'Reviewed',
    '2026-03-11 19:30:00+00',
    '2026-03-11 20:15:00+00',
    'Dr. James Chen, MD',
    'ACC-2026-011567',
    '/xray-wrist.jpg'
  );

  -- MRI Shoulder - Scheduled
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_mri_id,
    'MRI Right Shoulder without contrast',
    'Shoulder',
    'Right',
    'Chronic shoulder pain, limited range of motion',
    'Study scheduled for future date.',
    'Study not yet performed. Report pending.',
    'Report will be available after study completion.',
    'Please return after study is performed.',
    'Routine',
    'Scheduled',
    '2026-03-22 10:00:00+00',
    NULL,
    'Pending',
    'ACC-2026-012890',
    '/mri-brain-axial-slices.jpg'
  );

  -- X-Ray Spine Cervical - Reviewed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'X-Ray Cervical Spine (Lateral)',
    'Cervical Spine',
    'Midline',
    'Neck pain after motor vehicle accident',
    'Lateral cervical spine radiograph.',
    E'ALIGNMENT:\n• Normal cervical lordosis\n• No subluxation or malalignment\n• Atlantoaxial relationship is normal\n\nVERTEBRAL BODIES:\n• Vertebral body heights are maintained\n• No compression fracture\n• No lytic or sclerotic lesions\n\nDISC SPACES:\n• Disc spaces are preserved\n• Mild disc space narrowing at C5-C6\n\nSOFT TISSUES:\n• Prevertebral soft tissues are normal\n• No abnormal soft tissue swelling',
    E'No acute fracture or malalignment.\n\nMild degenerative changes at C5-C6.\n\nNo evidence of acute traumatic injury.',
    E'• Cervical collar can be removed\n• Pain management as needed\n• Physical therapy for neck strengthening\n• Follow-up X-ray only if symptoms worsen',
    'Stat',
    'Reviewed',
    '2026-03-09 22:00:00+00',
    '2026-03-09 22:45:00+00',
    'Dr. Sarah Mitchell, MD',
    'ACC-2026-013456',
    'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg'
  );

  -- Ultrasound Abdomen - Completed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_ultrasound_id,
    'Abdominal Ultrasound',
    'Abdomen',
    'Bilateral',
    'Right upper quadrant pain, evaluate for gallstones',
    'Grayscale ultrasound of the abdomen.',
    E'LIVER:\n• Normal size and echotexture\n• No focal lesions\n• Portal vein is patent\n\nGALLBLADDER:\n• Gallbladder wall is normal thickness\n• No gallstones identified\n• No pericholecystic fluid\n• Negative sonographic Murphy sign\n\nBILE DUCTS:\n• Common bile duct measures 4mm (normal)\n• No biliary dilatation\n\nPANCREAS:\n• Partially visualized, appears normal\n\nKIDNEYS:\n• Both kidneys are normal in size and echogenicity\n• No hydronephrosis or stones\n\nSPLEEN:\n• Normal size and appearance',
    E'Normal abdominal ultrasound.\n\nNo gallstones or biliary pathology.\n\nNo acute findings.',
    E'• No further imaging needed\n• Clinical correlation advised\n• Consider other causes of abdominal pain\n• Gastroenterology referral if symptoms persist',
    'Routine',
    'Completed',
    '2026-03-07 13:00:00+00',
    '2026-03-07 14:30:00+00',
    'Dr. Ahmed Al-Mansoori, MD',
    'ACC-2026-014789',
    'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg'
  );

  -- X-Ray Hand - Reviewed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'X-Ray Hand (PA, Lateral, Oblique)',
    'Hand',
    'Right',
    'Hand pain and swelling after punching wall',
    'Three views of the right hand.',
    E'BONES:\n• Transverse fracture through 5th metacarpal neck (Boxer''s fracture)\n• Mild volar angulation present\n• No other fractures identified\n• All other bones intact\n\nJOINTS:\n• Metacarpophalangeal and interphalangeal joints are normal\n• No dislocation\n\nSOFT TISSUES:\n• Soft tissue swelling over 5th metacarpal region\n• No foreign body',
    E'Boxer''s fracture (5th metacarpal neck fracture) with mild angulation.\n\nNo other acute osseous abnormality.',
    E'• Orthopedic or hand surgery consultation\n• Ulnar gutter splint immobilization\n• Follow-up X-ray in 1-2 weeks\n• Possible closed reduction if angulation worsens\n• Hand therapy after healing',
    'Urgent',
    'Reviewed',
    '2026-03-06 17:20:00+00',
    '2026-03-06 18:00:00+00',
    'Dr. James Chen, MD',
    'ACC-2026-015123',
    '/xray-forearm-fracture.jpg'
  );

  -- CT Chest with Contrast - Reviewed
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_ct_id,
    'CT Chest with IV contrast',
    'Chest',
    'Bilateral',
    'Sudden onset chest pain and shortness of breath, rule out PE',
    'CT angiography of the chest with IV contrast.',
    E'PULMONARY ARTERIES:\n• Pulmonary arteries are patent bilaterally\n• No filling defects to suggest pulmonary embolism\n• Main pulmonary artery is normal in caliber\n\nLUNGS:\n• Lungs are clear without consolidation\n• No nodules or masses\n• No pleural effusion or pneumothorax\n\nHEART:\n• Heart size is normal\n• No pericardial effusion\n\nMEDIASTINUM:\n• No mediastinal or hilar lymphadenopathy\n• Aorta is normal in caliber\n\nCHEST WALL:\n• No chest wall abnormality',
    E'Negative CT angiography for pulmonary embolism.\n\nNo acute cardiopulmonary abnormality.',
    E'• No anticoagulation needed\n• Consider alternative diagnosis (musculoskeletal, cardiac)\n• Cardiology evaluation recommended\n• Clinical correlation essential',
    'Stat',
    'Reviewed',
    '2026-03-05 21:15:00+00',
    '2026-03-05 22:00:00+00',
    'Dr. Sarah Mitchell, MD',
    'ACC-2026-016456',
    'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg'
  );

END $$;
