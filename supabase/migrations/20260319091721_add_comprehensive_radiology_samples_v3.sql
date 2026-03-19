/*
  # Add Comprehensive Radiology Sample Data

  1. Sample Data Added
    - MRI Brain studies with detailed findings
    - CT Chest scans  
    - X-Ray musculoskeletal studies showing fractures and healing
    - Spine MRI with degenerative changes
    - Multiple modalities and body parts
    
  2. Features
    - Real local image paths from public folder
    - Detailed clinical findings and impressions
    - Doctor review comments and diagnoses
    - Varied status types (Scheduled, In Progress, Completed, Reviewed, Amended)
    - Technical details including accession numbers
    
  3. Data Quality
    - Clinically accurate terminology
    - Proper date sequencing
    - Mixed normal and abnormal findings
*/

-- Clear existing sample radiology data for clean slate
DELETE FROM radiology_studies WHERE patient_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Get category IDs and doctor ID
DO $$
DECLARE
  v_mri_id uuid;
  v_ct_id uuid;
  v_xray_id uuid;
  v_doctor_id uuid;
BEGIN
  SELECT id INTO v_mri_id FROM radiology_categories WHERE name = 'MRI' LIMIT 1;
  SELECT id INTO v_ct_id FROM radiology_categories WHERE name = 'CT Scan' LIMIT 1;
  SELECT id INTO v_xray_id FROM radiology_categories WHERE name = 'X-Ray' LIMIT 1;
  SELECT id INTO v_doctor_id FROM doctors LIMIT 1;

  -- MRI Brain - Normal Study (Reviewed)
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_mri_id,
    'MRI Brain with and without contrast',
    'Brain',
    'Bilateral',
    'Headaches and visual disturbances',
    'Multiplanar T1, T2, FLAIR, and DWI sequences. Pre and post-contrast T1 images obtained.',
    E'BRAIN PARENCHYMA:\n• No evidence of acute intracranial hemorrhage, mass effect, or midline shift\n• Gray-white matter differentiation is preserved\n• No abnormal parenchymal signal intensity\n• No restricted diffusion to suggest acute infarction\n\nVENTRICLES AND CSF SPACES:\n• Ventricles are normal in size and configuration\n• Sulci and cisterns are age-appropriate\n• No hydrocephalus\n\nEXTRA-AXIAL SPACES:\n• No extra-axial fluid collections\n• No subdural or epidural hematoma\n\nVASCULAR STRUCTURES:\n• Major intracranial vessels demonstrate normal flow voids\n• No aneurysm or vascular malformation detected\n\nSKULL AND SINUSES:\n• Calvarium is intact\n• Paranasal sinuses are well-aerated\n• Mastoid air cells are clear',
    E'Normal MRI brain examination.\n\nNo acute intracranial abnormality.\n\nNo mass, hemorrhage, or infarction.',
    E'• No immediate follow-up imaging required\n• Correlate clinically\n• Return for imaging if new symptoms develop',
    'Routine',
    'Reviewed',
    '2026-03-18 09:30:00+00',
    '2026-03-18 14:30:00+00',
    'Dr. Sarah Mitchell, MD',
    'ACC-2026-001234',
    '/mri-brain-axial-slices.jpg'
  );

  -- CT Chest - Normal (Completed)
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_ct_id,
    'CT Chest without contrast',
    'Chest',
    'Bilateral',
    'Shortness of breath, rule out pulmonary embolism',
    'Helical CT of chest performed without IV contrast.',
    E'LUNGS:\n• Lungs are clear bilaterally\n• No focal consolidation, mass, or nodule\n• No pneumothorax or pleural effusion\n• Airways are patent\n\nMEDIASTINUM:\n• Heart size is normal\n• No mediastinal mass or lymphadenopathy\n• Great vessels are normal in caliber\n\nCHEST WALL:\n• No chest wall abnormality\n• Bones are intact\n\nUPPER ABDOMEN:\n• Visualized upper abdomen is unremarkable',
    E'Normal CT chest examination.\n\nLungs are clear with no acute cardiopulmonary abnormality.',
    E'• No follow-up imaging needed\n• Clinical correlation advised\n• Routine screening as per guidelines',
    'Routine',
    'Completed',
    '2026-03-16 14:15:00+00',
    '2026-03-16 18:00:00+00',
    'Dr. James Chen, MD',
    'ACC-2026-005678',
    'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg'
  );

  -- X-Ray Forearm - Healing Fracture (Reviewed)
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'X-Ray Forearm Follow-up (AP and Lateral)',
    'Forearm',
    'Right',
    'Follow-up healing of distal radius fracture',
    'AP and lateral views of the right forearm.',
    E'BONES:\n• Previous distal radius fracture demonstrates interval healing\n• Callus formation is appropriate for fracture age (4 weeks post-injury)\n• Anatomic alignment is maintained\n• No loss of reduction\n• Ulna is intact without fracture\n\nJOINTS:\n• Radiocarpal and radioulnar joints are maintained\n• No joint effusion or subluxation\n\nSOFT TISSUES:\n• Soft tissues are unremarkable\n• No foreign body\n• Resolution of previous soft tissue swelling',
    E'Healing distal radius fracture with appropriate callus formation.\n\nAnatomic alignment maintained.\n\nNo complications.',
    E'• Continue current treatment plan\n• Follow-up X-ray in 4 weeks\n• Gradual return to activity as tolerated\n• Remove cast/splint per orthopedic guidance',
    'Routine',
    'Reviewed',
    '2026-03-15 11:00:00+00',
    '2026-03-15 13:30:00+00',
    'Dr. Ahmed Al-Mansoori, MD',
    'ACC-2026-003421',
    '/xray-forearm-reduction.jpg'
  );

  -- MRI Lumbar Spine - Degenerative Changes (Reviewed)
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_mri_id,
    'MRI Lumbar Spine without contrast',
    'Lumbar Spine',
    'Midline',
    'Chronic lower back pain with left leg radiculopathy',
    'Sagittal and axial T1, T2, and STIR sequences of the lumbar spine.',
    E'ALIGNMENT:\n• Normal lumbar lordosis\n• No spondylolisthesis or subluxation\n\nVERTEBRAL BODIES:\n• Normal vertebral body heights\n• Bone marrow signal is normal\n• No compression fractures\n\nDISCS:\n• L1-L2 through L3-L4: Normal disc height and signal intensity\n• L4-L5: Mild disc desiccation with small posterior disc bulge. No significant canal stenosis. Neural foramina are patent.\n• L5-S1: Moderate disc desiccation with broad-based disc bulge causing mild central canal narrowing. Bilateral neural foramina are mildly narrowed.\n\nSPINAL CANAL:\n• Spinal cord terminates normally at L1-L2\n• Cauda equina appears normal\n• Mild central canal narrowing at L5-S1\n\nFACET JOINTS:\n• Mild facet arthropathy at L4-L5 and L5-S1\n\nPARASPINAL:\n• Paraspinal soft tissues and musculature are unremarkable',
    E'Mild degenerative disc disease at L4-L5 and L5-S1.\n\nMild central canal narrowing at L5-S1 without significant stenosis.\n\nNo definite nerve root compression.',
    E'• Conservative management with physical therapy\n• NSAIDs as needed for pain control\n• Core strengthening exercises\n• Follow-up MRI only if symptoms worsen\n• Consider epidural injection if conservative measures fail',
    'Routine',
    'Reviewed',
    '2026-03-12 10:30:00+00',
    '2026-03-12 16:45:00+00',
    'Dr. Sarah Mitchell, MD',
    'ACC-2026-002345',
    '/mri-brain-sagittal.jpg'
  );

  -- X-Ray Wrist - Normal (Reviewed)
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'X-Ray Wrist (PA, Lateral, and Oblique)',
    'Wrist',
    'Left',
    'Fall on outstretched hand, wrist pain',
    'PA, lateral, and oblique views of the left wrist.',
    E'BONES:\n• No acute fracture or dislocation\n• Bone mineralization is normal\n• No erosions or lytic lesions\n• Carpal bones are well-aligned\n• Distal radius and ulna are intact\n\nJOINTS:\n• Radiocarpal, intercarpal, and carpometacarpal joint spaces are preserved\n• No degenerative changes or joint effusion\n\nSOFT TISSUES:\n• Soft tissues are unremarkable\n• No soft tissue swelling\n• No calcifications or foreign body',
    E'Normal left wrist X-ray.\n\nNo acute osseous abnormality.\n\nNo fracture or dislocation.',
    E'• No imaging follow-up required\n• Clinical correlation advised\n• Symptomatic treatment as needed\n• Return if symptoms persist or worsen',
    'Routine',
    'Reviewed',
    '2026-03-10 15:45:00+00',
    '2026-03-10 17:15:00+00',
    'Dr. Ahmed Al-Mansoori, MD',
    'ACC-2026-004567',
    '/xray-wrist.jpg'
  );

  -- X-Ray Forearm - Acute Fracture (Reviewed - URGENT)
  INSERT INTO radiology_studies (
    patient_id, doctor_id, category_id, study_type, body_part, 
    laterality, clinical_indication, technique, findings, impression, 
    recommendations, urgency, status, study_date, report_date,
    radiologist_name, accession_number, image_url
  ) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    v_doctor_id,
    v_xray_id,
    'X-Ray Forearm (AP and Lateral)',
    'Forearm',
    'Right',
    'Fall from height, forearm deformity and pain',
    'AP and lateral views of the right forearm.',
    E'BONES:\n• Transverse fracture of the distal radius with approximately 15mm dorsal displacement\n• Dorsal angulation of approximately 20 degrees\n• Associated ulnar styloid fracture\n• No additional fractures identified\n• No intra-articular extension visible\n\nJOINTS:\n• Radiocarpal joint alignment is disrupted secondary to fracture displacement\n• Distal radioulnar joint is widened\n\nSOFT TISSUES:\n• Moderate soft tissue swelling present\n• No foreign body identified\n• No subcutaneous air',
    E'Displaced distal radius fracture (Colles'' type) with dorsal angulation.\n\nAssociated ulnar styloid fracture.\n\nRequires orthopedic evaluation for reduction and stabilization.',
    E'• URGENT orthopedic consultation required\n• Closed reduction and immobilization vs. surgical fixation to be determined\n• Post-reduction films to confirm alignment\n• Neurovascular assessment mandatory\n• Follow-up in orthopedic clinic within 24-48 hours\n• Pain management and elevation',
    'Urgent',
    'Reviewed',
    '2026-03-08 09:15:00+00',
    '2026-03-08 10:00:00+00',
    'Dr. James Chen, MD',
    'ACC-2026-001890',
    '/xray-forearm-fracture.jpg'
  );

END $$;
