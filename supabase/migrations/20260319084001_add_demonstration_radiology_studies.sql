/*
  # Add Demonstration Radiology Studies
  
  Creates realistic radiology studies based on provided medical images
  Studies can be viewed by all authenticated users for demonstration purposes
*/

DO $$
DECLARE
  xray_cat_id uuid;
  mri_cat_id uuid;
  ct_cat_id uuid;
  study1_id uuid := gen_random_uuid();
  study2_id uuid := gen_random_uuid();
  study3_id uuid := gen_random_uuid();
  study4_id uuid := gen_random_uuid();
  study5_id uuid := gen_random_uuid();
BEGIN
  -- Get category IDs
  SELECT id INTO xray_cat_id FROM radiology_categories WHERE name = 'X-Ray';
  SELECT id INTO mri_cat_id FROM radiology_categories WHERE name = 'MRI';
  SELECT id INTO ct_cat_id FROM radiology_categories WHERE name = 'CT Scan';

  -- X-RAY STUDY 1: Left Forearm Fracture (Initial presentation)
  INSERT INTO radiology_studies (
    id, category_id, study_type, body_part, laterality,
    clinical_indication, technique, findings, impression, recommendations,
    urgency, status, study_date, radiologist_name, accession_number
  ) VALUES (
    study1_id, xray_cat_id,
    'X-Ray Forearm',
    'Forearm',
    'Left',
    'Patient presents with left forearm pain and swelling following a fall onto an outstretched hand. Assess for fracture or dislocation.',
    'AP and lateral radiographs of the left forearm were obtained using standard technique.',
    E'BONES:\n\nThere is a complete transverse fracture of the distal third of the left ulnar shaft. The fracture line is well-defined with approximately 3-4mm of displacement and mild angulation. No significant comminution is noted. The fracture edges are sharp and distinct.\n\nThe radius appears intact with normal cortical margins and no evidence of fracture.\n\nJOINTS:\n\nThe distal radioulnar joint shows mild subluxation secondary to the ulnar fracture. The radiocarpal joint and intercarpal joints appear well-maintained with normal joint space.\n\nThe elbow joint is grossly unremarkable with no evidence of effusion or dislocation.\n\nSOFT TISSUES:\n\nMild soft tissue swelling is present overlying the fracture site. No radiopaque foreign bodies are identified.\n\nALIGNMENT:\n\nThere is approximately 10 degrees of volar angulation at the fracture site. The overall alignment of the forearm is slightly altered but remains acceptable.',
    E'1. Complete transverse fracture of the distal third of the left ulnar shaft with mild displacement (3-4mm) and volar angulation (10 degrees).\n\n2. Mild subluxation of the distal radioulnar joint secondary to the ulnar fracture.\n\n3. Intact radius with no evidence of associated fracture.\n\n4. Soft tissue swelling at the fracture site.\n\nRECOMMENDATION: Orthopedic consultation for fracture management. Closed reduction and immobilization versus surgical fixation may be considered based on clinical assessment.',
    'Orthopedic referral recommended. Consider closed reduction with cast immobilization or open reduction internal fixation (ORIF) if conservative management fails. Follow-up radiographs in 1-2 weeks to assess healing and alignment.',
    'Urgent',
    'Completed',
    NOW() - INTERVAL '2 days',
    'Dr. Sarah Ahmed Al-Mansouri',
    'XR20260318001'
  );

  -- Add findings for X-ray study 1
  INSERT INTO radiology_findings (study_id, finding_type, description, severity, location, measurements) VALUES
  (study1_id, 'Fracture', 'Complete transverse fracture of distal ulnar shaft', 'Moderate', 'Left distal ulna, distal third', 'Displacement: 3-4mm, Angulation: 10 degrees volar'),
  (study1_id, 'Joint Subluxation', 'Mild subluxation of distal radioulnar joint', 'Mild', 'Left distal radioulnar joint', NULL),
  (study1_id, 'Soft Tissue Swelling', 'Mild soft tissue swelling overlying fracture site', 'Mild', 'Left forearm, distal third', NULL);

  -- X-RAY STUDY 2: Left Forearm Post-Reduction (Follow-up)
  INSERT INTO radiology_studies (
    id, category_id, study_type, body_part, laterality,
    clinical_indication, technique, findings, impression, recommendations,
    urgency, status, study_date, radiologist_name, accession_number
  ) VALUES (
    study2_id, xray_cat_id,
    'X-Ray Forearm Follow-up',
    'Forearm',
    'Left',
    'Follow-up imaging after closed reduction of left ulnar fracture. Assess fracture alignment and healing.',
    'AP and lateral radiographs of the left forearm were obtained. Patient is status post closed reduction with long arm cast in place.',
    E'COMPARISON: Prior radiographs from 2 days ago available for comparison.\n\nBONES:\n\nThe previously identified transverse fracture of the distal third left ulnar shaft is redemonstrated. Following closed reduction, there is improved alignment with less than 2mm of residual displacement. The angulation has been corrected to approximately 5 degrees, which is within acceptable limits.\n\nEarly callus formation is not yet evident, which is expected at this early post-injury stage.\n\nThe radius remains intact with no new fractures identified.\n\nJOINTS:\n\nThe distal radioulnar joint now shows improved alignment compared to the prior study. Normal joint space is maintained.\n\nThe radiocarpal and elbow joints remain unremarkable.\n\nSOFT TISSUES:\n\nPersistent soft tissue swelling is present but appears slightly decreased compared to the prior examination. Cast material is visualized surrounding the forearm.\n\nNo complications such as compartment syndrome or vascular compromise are radiographically evident.',
    E'1. Status post closed reduction of left distal ulnar shaft fracture with satisfactory alignment.\n\n2. Residual displacement of less than 2mm and angulation of approximately 5 degrees, within acceptable parameters for conservative management.\n\n3. No evidence of fracture healing complications at this early stage.\n\n4. Improved alignment of the distal radioulnar joint.\n\n5. Cast in appropriate position.\n\nCONCLUSION: Successful closed reduction. Recommend continued immobilization with follow-up imaging in 2-3 weeks to assess fracture healing.',
    'Continue cast immobilization. Clinical follow-up in 2-3 weeks with repeat radiographs to assess callus formation and ensure maintained alignment. Monitor for signs of cast complications.',
    'Routine',
    'Completed',
    NOW() - INTERVAL '6 hours',
    'Dr. Sarah Ahmed Al-Mansouri',
    'XR20260318002'
  );

  INSERT INTO radiology_findings (study_id, finding_type, description, severity, location, measurements) VALUES
  (study2_id, 'Post-Reduction Alignment', 'Improved fracture alignment after closed reduction', 'Mild', 'Left distal ulna', 'Residual displacement: <2mm, Angulation: 5 degrees'),
  (study2_id, 'Cast Immobilization', 'Long arm cast in appropriate position', 'Normal', 'Left upper extremity', NULL);

  -- X-RAY STUDY 3: Wrist Soft Tissue Injury
  INSERT INTO radiology_studies (
    id, category_id, study_type, body_part, laterality,
    clinical_indication, technique, findings, impression, recommendations,
    urgency, status, study_date, radiologist_name, accession_number
  ) VALUES (
    study3_id, xray_cat_id,
    'X-Ray Wrist',
    'Wrist',
    'Right',
    'Patient reports right wrist pain after lifting heavy object. Rule out fracture or ligamentous injury.',
    'PA, lateral, and oblique views of the right wrist were obtained.',
    E'BONES:\n\nThe distal radius and ulna demonstrate normal cortical thickness and trabecular pattern. No acute fracture is identified.\n\nThe carpal bones including the scaphoid, lunate, triquetrum, pisiform, trapezium, trapezoid, capitate, and hamate all appear intact with normal morphology.\n\nJOINTS:\n\nThe radiocarpal joint space is preserved and symmetric. The intercarpal joint spaces appear normal without widening.\n\nSOFT TISSUES:\n\nMild soft tissue swelling is present along the radial aspect of the wrist, particularly over the anatomical snuffbox region. The pronator fat plane and scaphoid fat plane are preserved.\n\nBONE MINERALIZATION:\n\nBone density appears appropriate for age.',
    E'1. No acute fracture or dislocation of the right wrist.\n\n2. Mild soft tissue swelling over the radial aspect of the wrist.\n\n3. Preserved fat planes argue against occult fracture.\n\n4. Normal carpal alignment.\n\nNOTE: Clinical correlation recommended. If scaphoid tenderness persists, consider MRI or CT to evaluate for occult scaphoid fracture.',
    'Conservative management with wrist immobilization and pain control. Consider advanced imaging if symptoms persist beyond 1-2 weeks.',
    'Routine',
    'Completed',
    NOW() - INTERVAL '5 days',
    'Dr. Mohammed Hassan Al-Zaabi',
    'XR20260313001'
  );

  INSERT INTO radiology_findings (study_id, finding_type, description, severity, location) VALUES
  (study3_id, 'Soft Tissue Swelling', 'Mild soft tissue swelling over anatomical snuffbox', 'Mild', 'Right wrist, radial aspect'),
  (study3_id, 'No Fracture', 'No radiographic evidence of acute fracture', 'Normal', 'Right wrist');

  -- MRI BRAIN STUDY 1: Chronic Headaches Evaluation
  INSERT INTO radiology_studies (
    id, category_id, study_type, body_part, laterality,
    clinical_indication, technique, findings, impression, recommendations,
    urgency, status, study_date, radiologist_name, accession_number
  ) VALUES (
    study4_id, mri_cat_id,
    'MRI Brain with and without contrast',
    'Brain',
    'Bilateral',
    'Patient presents with chronic headaches, occasional visual disturbances, and family history of cerebrovascular disease. Rule out structural abnormality, mass lesion, or vascular malformation.',
    E'MRI of the brain performed on 3 Tesla system.\n\nSEQUENCES: T1-weighted sagittal, T2-weighted axial, FLAIR axial, DWI/ADC, T1 post-gadolinium, 3D TOF MR angiography.\n\nContrast: 15ml gadolinium-based contrast administered intravenously.',
    E'BRAIN PARENCHYMA:\n\nThe cerebral hemispheres demonstrate normal grey-white matter differentiation. No focal mass lesion, abnormal enhancement, or restricted diffusion.\n\nSeveral scattered T2/FLAIR hyperintense foci in the periventricular and subcortical white matter bilaterally, measuring 2-5mm. These are nonspecific but may represent chronic small vessel ischemic changes.\n\nCEREBELLUM AND BRAINSTEM:\n\nNormal morphology. The cerebellar tonsils are in normal position. The brainstem appears unremarkable.\n\nVENTRICULAR SYSTEM:\n\nThe lateral, third, and fourth ventricles are normal in size. No hydrocephalus.\n\nEXTRA-AXIAL SPACES:\n\nNo extra-axial collections or masses.\n\nVASCULAR STRUCTURES:\n\nMR angiography demonstrates patent anterior and posterior circulations. No significant stenosis, aneurysm, or vascular malformation.',
    E'1. No acute intracranial abnormality, mass lesion, or hemorrhage.\n\n2. Scattered nonspecific white matter T2/FLAIR hyperintensities, likely chronic microvascular ischemic changes.\n\n3. Normal brain morphology with age-appropriate ventricular size.\n\n4. Patent intracranial vasculature with no aneurysm or vascular malformation.\n\n5. No abnormal enhancement.\n\nCONCLUSION: MRI findings do not explain chronic headache symptoms. Consider neurology follow-up.',
    'Neurology consultation for headache management. Consider vascular risk factor assessment. Clinical follow-up as needed.',
    'Routine',
    'Completed',
    NOW() - INTERVAL '1 week',
    'Dr. Fatima Al-Hashimi',
    'MR20260311001'
  );

  INSERT INTO radiology_findings (study_id, finding_type, description, severity, location, measurements) VALUES
  (study4_id, 'White Matter Changes', 'Scattered T2/FLAIR hyperintense foci in periventricular and subcortical white matter', 'Mild', 'Bilateral cerebral hemispheres', '2-5mm diameter foci'),
  (study4_id, 'Normal Vasculature', 'Patent intracranial vessels, no aneurysm or malformation', 'Normal', 'Circle of Willis', NULL);

  -- MRI BRAIN STUDY 2: Dizziness and Balance Issues
  INSERT INTO radiology_studies (
    id, category_id, study_type, body_part, laterality,
    clinical_indication, technique, findings, impression, recommendations,
    urgency, status, study_date, radiologist_name, accession_number
  ) VALUES (
    study5_id, mri_cat_id,
    'MRI Brain without contrast',
    'Brain',
    'Bilateral',
    'Patient experiencing dizziness, balance difficulties, and occasional memory lapses. Rule out posterior fossa pathology, demyelinating disease, or neurodegenerative changes.',
    E'MRI of brain performed on 1.5 Tesla system without contrast.\n\nSEQUENCES: T1-weighted axial, T2-weighted axial (multiple slices), FLAIR axial, GRE axial.',
    E'SUPRATENTORIAL STRUCTURES:\n\nThe cerebral hemispheres demonstrate symmetric morphology with preserved grey-white matter differentiation. Normal basal ganglia, thalami, and hippocampal formations.\n\nA few punctate T2/FLAIR hyperintense foci (3-4 foci, each <3mm) scattered in periventricular white matter. Nonspecific and within normal limits for age.\n\nVENTRICLES:\n\nLateral, third, and fourth ventricles are symmetric and normal in size. No hydrocephalus.\n\nINFRATENTORIAL STRUCTURES:\n\nThe cerebellum demonstrates normal morphology bilaterally with preserved folial pattern. No masses, infarcts, or abnormal signal.\n\nThe pons and medulla appear unremarkable. Cerebellopontine angles are clear bilaterally.',
    E'1. Normal brain MRI without acute infarction, hemorrhage, mass, or significant atrophy.\n\n2. Age-appropriate mild scattered white matter hyperintensities, nonspecific.\n\n3. Normal ventricular system.\n\n4. Normal cerebellum and brainstem structures.\n\n5. No evidence of demyelinating disease or posterior fossa pathology.\n\nCONCLUSION: No structural cause identified for symptoms. Consider vestibular function testing.',
    'Recommend ENT/vestibular evaluation. Consider neuropsychological testing if memory concerns persist. No imaging follow-up needed unless new symptoms develop.',
    'Routine',
    'Completed',
    NOW() - INTERVAL '4 days',
    'Dr. Fatima Al-Hashimi',
    'MR20260314001'
  );

  INSERT INTO radiology_findings (study_id, finding_type, description, severity, location) VALUES
  (study5_id, 'Normal Brain Structure', 'No structural abnormality identified', 'Normal', 'Entire brain'),
  (study5_id, 'White Matter Foci', 'Minimal age-appropriate white matter hyperintensities', 'Mild', 'Periventricular white matter');

END $$;
