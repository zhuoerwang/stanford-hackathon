## Post-Call Processing: Display Referral Letter in App

### Purpose
After completing a clinical trial screening call, analyze the conversation and generate a formal referral letter to be displayed in the app UI.

### Client Action Integration
Use the `show_referral_letter` client action to display the letter:

```javascript
trigger_client_action("show_referral_letter", {
  "patient_name": "[Patient Name]",
  "trial_name": "[Trial Name]",
  "nct_id": "[NCT ID]",
  "location": "[Trial Location]",
  "sponsor": "[Sponsor/Institution]",
  "criteria_met": ["Criterion 1", "Criterion 2"],
  "letter_html": "<generated_html_letter>"
})
```

### Instructions

1. **Extract from Transcript:**
   - Patient name (use "Patient" if not provided)
   - Clinical trial name and NCT ID
   - Trial location and sponsoring institution
   - Eligibility criteria the patient meets
   - Patient's motivation for the trial

2. **Generate Referral Letter (HTML Format):**
   Use this HTML template for proper formatting:

   ```html
   <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
     <p>Dear Doctor,</p>

     <p>I am writing to you regarding our recent conversation with your patient, <strong>[Patient Name]</strong>, concerning their interest in the <strong>[Clinical Trial Name]</strong> (NCT ID: [NCT_ID]) offered by [Sponsor/Institution].</p>

     <p>Based on our screening call, the patient appears to be a strong candidate for this trial due to:</p>
     <ul>
       <li>[Specific Criterion 1]</li>
       <li>[Specific Criterion 2]</li>
       <li>[Additional criteria as applicable]</li>
     </ul>

     <p>The trial is located at <strong>[Location]</strong> and further details can be found at:<br>
     <a href="https://clinicaltrials.gov/study/[NCT_ID]">https://clinicaltrials.gov/study/[NCT_ID]</a></p>

     <p>We would appreciate it if you could review their case and provide a formal referral if you deem it appropriate for their care plan.</p>

     <p>Best regards,<br>
     <strong>Sarah</strong><br>
     TrialMatch Clinical Trial Specialist</p>
   </div>
   ```

3. **Send Client Action:**
   After generating the letter, trigger the client action to display it in the app:
   ```
   trigger_client_action("show_referral_letter", {
     "patient_name": "[Patient Name]",
     "trial_name": "[Trial Name]",
     "nct_id": "[NCT ID]",
     "location": "[Trial Location]",
     "sponsor": "[Sponsor/Institution]",
     "criteria_met": ["List of criteria met"],
     "letter_html": "<html_letter_content>"
   })
   ```

### Edge Cases
- **Ineligible Patient:** Generate a letter explaining which criteria were not met and suggest discussing alternatives with their oncologist.
- **Incomplete Call:** Generate a partial summary noting what information is still needed for a complete referral.
- **Missing Trial Info:** Use "[Information Not Provided]" as placeholder and note this in the letter body.
- **Multiple Trials Discussed:** Generate a letter covering the primary trial of interest, or the one the patient showed most interest in.
