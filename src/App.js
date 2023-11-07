import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [introPoints, setIntroPoints] = useState('');
  const [tailoredExperiencePoints, setTailoredExperiencePoints] = useState('');
  const [companyAlignmentPoints, setCompanyAlignmentPoints] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [agreePromo, setAgreePromo] = useState(true);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [remainingArticles, setRemainingArticles] = useState(null);

  const handleModalSubmit = async () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const resetToInitialState = () => {
    setShowLoadingModal(false);
    setShowThankYouModal(false);
  }

    const handleSubmit = async () => {
        console.log("Sending request...");
        setShowLoadingModal(true);  // Show the loading modal

        try {
            console.log("Sending POST request to server...");
            const response = await fetch('https://coverlettergenerator-396114.ue.r.appspot.com/generate-cover-letter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    role: role,
                    company: company,
                    intro_points: introPoints,
                    tailored_experience_points: tailoredExperiencePoints,
                    company_alignment_points: companyAlignmentPoints,
                    email: email,
                    agreePromo: agreePromo
                    })
                });

            // read the response body here only once
            const data = await response.json();
            console.log("Response received:", data);

            if (response.status === 500) {
                console.log("500 status detected:", data.error);
                alert(data.error);
                resetToInitialState();
                return;
            }
            else if (response.status === 400) {
                alert(data.error);
            } else {
                setEmailSuccess(true);
                setShowThankYouModal(true);
                setRemainingArticles(data.remaining_articles);
            }
        } catch (error) {
            alert("An unexpected error occurred. Please try again.");
            console.error("Error submitting form:", error);
        } finally {
            setShowLoadingModal(false);
        }
    };

    function LoadingModal({ show }) {
      if (!show) return null;
      return (
        <div className="modal">
          <div className="modal-content">
            <div className="spinner"></div>
            <p>Your custom cover letter is processing. It may take a few moments.</p>
            <div className="notice">
              <p>
                <strong>
                  <span style={{color: 'red', textDecoration: 'underline'}}>PLEASE READ</span>
                </strong>
              </p>
              <p>In many instances, your cover letter will be longer than 1 page. It may also contain 'filler' paragraphs and extra salutations/signatures. I do my best to clean these, but I can't catch everything. Your finished cover letter that you're "ready to submit" should NEVER EVER be longer than 1 full page. It is up to you to get rid of content not contributing much and compress to a one page professional cover letter.</p>
            </div>
          </div>
        </div>
      );
    }

    function ThankYouModal({ show, success, onClose, remainingArticles }) {
      if (!show) return null;
      return (
        <div className="modal">
          <div className="modal-content">
            {success
              ? <><p>Email was sent successfully!</p>
                <p>You have {remainingArticles} free letter(s) left.</p>
                <p>Please check your spam folder. You may find an error trying to open the .docx attachment with Google Docs. If you download it and manually drag and drop it into your Google Drive, it will successfully upload.</p></>
              : <p>Failed to send email. Please try again.</p>}
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      );
    }

  return (
    <div className="App">
      <h1>Cover Letter Generator</h1>
      <p>Fill out your first name, role applying, and company applying in the first section. For Intro Points, list personality traits that make you attractive to a hiring manager. Separate with ";". For Tailored Experience & Skills, list skills that set you apart. And finally, for Company Alignment, copy and paste the company's About Us or Careers Page. The program will scrape that page and learn from it!</p>
      <p><strong>WE SUPPORT DIFFERENT LANGUAGES!</strong> If English isn't your first language, no problem! Input in points & skills sections from any of <a href="https://www.deepl.com/docs-api/translate-text" target="_blank" rel="noreferrer"fasfd>these languages</a>.</p>
      <p><strong>PRO TIP: </strong> Be specific in your details. The less specific you are, the more the AI tries to fill in the gaps with subpar and irrelevant content. </p>
      <div className="input-row">
        <input
          type="text"
          placeholder="Your First Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role Applying"
          value={role}
          onChange={e => setRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company Applying"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
      </div>
      <div className="input-section">
        <h2>Introduction Points:</h2>
        <textarea
         id="introPoints"
          value={introPoints}
          onChange={(e) => setIntroPoints(e.target.value)}
          rows="5"
          placeholder="I am motivated; I am punctual; I love to share my knowledge..."
        />
      </div>
      <div className="input-section">
        <h2>Tailored Experience & Skills:</h2>
        <textarea
          id="tailoredExperiencePoints"
          value={tailoredExperiencePoints}
          onChange={(e) => setTailoredExperiencePoints(e.target.value)}
          rows="5"
          placeholder="I make the process of ideation to creation seamless; My wireframes are clean and easy to understand; I can effectively communicate what I want my design to look like"
        />
      </div>
      <div className="input-section">
        <h2>Company Alignment:</h2>
        <input
          type="text"
          placeholder="Paste Company About Page URL"
          value={companyAlignmentPoints}
          onChange={e => setCompanyAlignmentPoints(e.target.value)}
        />
      </div>

      <button onClick={() => setShowModal(true)}>Generate Cover Letter</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <p>AI technologies are powerful but unpredictable. Be sure to proofread your Cover Letter for errors and omissions.</p>
            <p>Enter the email you want the Cover Letter delivered to:</p>
            <div>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="checkbox"
                checked={agreePromo}
                onChange={() => setAgreePromo(prev => !prev)}
              />
              <label>Agree to receive promotional emails from myaiguy.net domain email. See Terms and Conditions</label>
            </div>
            <button onClick={handleModalSubmit}>Get My Cover Letter</button>
          </div>
        </div>
      )}
      <LoadingModal show={showLoadingModal} />

      <ThankYouModal
        show={showThankYouModal}
        success={emailSuccess}
        onClose={() => setShowThankYouModal(false)}
        remainingArticles={remainingArticles}
      />
    </div>
  );
}

export default App;