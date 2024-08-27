import React, { useEffect, useState } from 'react';
import { Collapse, Input, Tooltip, message } from 'antd';
import copyIcon from '../../assets/images/copy.svg';
import { RightOutlined } from '@ant-design/icons'; // Importing default right arrow icon

import { Certification, EducationExperience, WorkExperience } from '../interfaces/autoApply';
import AiAnswer from './AiAnswer';

import { makeRequest } from '../../utils/helpers';
import { checkPremium } from '../../popup/request';
import { getAuthFromCookie } from '../../utils/auth';
import AiQuestionAnswerListing from './AiQuestionAnswerListing';
const { Panel } = Collapse;

type ResumeInformationProps = {
  // setOpen: (open: boolean) => void;
};

const ResumeInformation: React.FC<ResumeInformationProps> = ({ }) => {
  const [resumeInfo, setResumeInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    linkedinURL: '',
    email: '',
    address: '',
    country: '',
    city: '',
    state: '',
    zip: '',
    race: '',
    gender: '',
    sex: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    veteranStatus: '',
    sponsorship: '',
    legal: '',
    disability: '',
  });

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educationExperiences, setEducationExperiences] = useState<EducationExperience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loader, setLoader] = useState(false);


  useEffect(() => {
    (async () => {
      const auth = await getAuthFromCookie();
      const payload = {
        auth: auth || "",
        token: "adsasdadsaddassasdsa",
      };
      makeRequest(setLoader, checkPremium, payload, onSuccess, onError);
    })();
  }, []);


  const onSuccess = (response: any) => {
    const resumeData = response.resume_data;
    const contactInfo = resumeData["Contact information"] || {};
    setResumeInfo(contactInfo);

    const workExperienceArray = resumeData["Work experience(s)"] || [];
    setWorkExperiences(workExperienceArray);

    const educationArray = resumeData["Education"] || [];
    setEducationExperiences(educationArray);

    const certificationArray = resumeData["Skills"] || [];
    setCertifications(certificationArray);
  }
  const onError = (response: any) => {
    console.log(response);
  }
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      message.success('Copied to clipboard!');
    });
  };

  const camelCaseToSentenceCase = (text: string) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const renderInputWithCopy = (placeholder: string, label: string, value: string) => (
    <>
      <div style={{
        marginTop: '10px',
        color: '#81818F !important',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '150%',
      }}>
        {camelCaseToSentenceCase(label)}
      </div>
      <Input
        className='simple-input-field'
        value={value}
        placeholder={camelCaseToSentenceCase(placeholder)}
        suffix={
          <Tooltip title="Copy">
            <img
              src={copyIcon}
              alt="Copy"
              onClick={(e) => {
                e.preventDefault();
                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                handleCopy(input.value);
              }}
              style={{ cursor: 'pointer', width: '21px', height: '21px' }}
            />
          </Tooltip>
        }
      />
    </>
  );

  const renderStyledHeader = (text: string) => (
    <div style={{
      color: 'var(--System-Primary, rgba(4, 4, 31, 0.80))',
      fontFamily: "'Inter', sans-serif",
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '150%',
    }}>
      {text}
    </div>
  );

  const customPanelHeader = (
    <div style={{
      color: '#04041FCC',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '150%',
    }}>
      Your Resume Information
    </div>
  );

  const customExpandIcon = (panelProps: any) => {
    const { isActive } = panelProps; // This indicates if the panel is open
    return (
      <RightOutlined
        style={{
          transition: 'transform 0.2s',
          transform: `rotate(${isActive ? 270 : 90}deg)`, // Rotate icon when panel is active
        }}
      />
    );
  };

  return (
    // <div >
    //   <Collapse expandIconPosition="end"
    //     expandIcon={customExpandIcon} // Use the custom expand icon function
    //     ghost>
    //     <Panel header={renderStyledHeader("My Information")} key="2">
    //       {renderInputWithCopy("First Name", "First Name")}
    //       {renderInputWithCopy("Last Name", "Last Name")}
    //       {renderInputWithCopy("Phone", "Phone")}
    //       {renderInputWithCopy("Linkedin URL", "Linkedin URL")}
    //       {renderInputWithCopy("Email", "Email")}
    //       {renderInputWithCopy("Address", "Address")}
    //       {renderInputWithCopy("Country", "Country")}
    //       {renderInputWithCopy("City", "City")}
    //       {renderInputWithCopy("State", "State")}
    //       {renderInputWithCopy("Zip", "Zip")}
    //       {renderInputWithCopy("Race", "Race")}
    //       {renderInputWithCopy("Gender", "Gender")}
    //       {renderInputWithCopy("Sex", "Sex")}
    //       {renderInputWithCopy("Birth Day", "Birth Day")}
    //       {renderInputWithCopy("Birth Month", "Birth Month")}
    //       {renderInputWithCopy("Birth Year", "Birth Year")}
    //       {renderInputWithCopy("Veteran Status", "Veteran Status")}
    //       {renderInputWithCopy("Sponsorship", "Sponsorship")}
    //       {renderInputWithCopy("Legal", "Legal")}
    //       {renderInputWithCopy("Disability", "Disability")}
    //     </Panel>
    //   </Collapse>

    //   <Collapse expandIconPosition="end"
    //     expandIcon={customExpandIcon} // Use the custom expand icon function
    //     ghost>
    //     <Panel header={renderStyledHeader("Professional Experience")} key="3">
    //       {renderInputWithCopy("Company", "Company")}
    //       {renderInputWithCopy("Title", "Title")}
    //       {renderInputWithCopy("Start", "Start")}
    //       {renderInputWithCopy("End", "End")}
    //       {renderInputWithCopy("City", "City")}
    //       {renderInputWithCopy("State", "State")}
    //     </Panel>
    //   </Collapse>

    //   <Collapse expandIconPosition="end"
    //     expandIcon={customExpandIcon} // Use the custom expand icon function

    //     ghost>
    //     <Panel header={renderStyledHeader("Education")} key="4">
    //       {renderInputWithCopy("Degree", "Degree")}
    //       {renderInputWithCopy("Subject", "Subject")}
    //       {renderInputWithCopy("Institution", "Institution")}
    //       {renderInputWithCopy("Graduation Date", "Graduation Date")}
    //       {renderInputWithCopy("City", "City")}
    //       {renderInputWithCopy("State", "State")}
    //     </Panel>
    //   </Collapse>

    //   <Collapse expandIconPosition="end"
    //     expandIcon={customExpandIcon} // Use the custom expand icon function
    //     ghost>
    //     <Panel header={renderStyledHeader("Certifications")} key="5">
    //       {renderInputWithCopy("Enter your certifications", "Certifications")}
    <div
    >
      {/* <Collapse defaultActiveKey={['0']} expandIconPosition="end" ghost>
        <Panel header={customPanelHeader} key="1"> */}
      <Collapse expandIconPosition="end"
        expandIcon={customExpandIcon} // Use the custom expand icon function
        ghost>
        <Panel header={renderStyledHeader("My Information")} key="2">
          {Object.entries(resumeInfo).map(([key, value]) => (
            renderInputWithCopy(key, key, value)
          ))}
        </Panel>
      </Collapse>

      <Collapse expandIconPosition="end"
        expandIcon={customExpandIcon} // Use the custom expand icon function

        ghost>
        <Panel header={renderStyledHeader("Professional Experience")} key="3">
          {workExperiences.map((workExp, index) => (
            <div key={index} className="mb-2">
              {renderInputWithCopy("Company", "Company", workExp.company)}
              {renderInputWithCopy("Title", "Title", workExp["role/Job title"])}
              {renderInputWithCopy("Start", "Start", workExp["start date (MM/YY)"])}
              {renderInputWithCopy("End", "End", workExp["end date (MM/YY)"])}
              {renderInputWithCopy("City", "City", workExp["expCity"])}
              {renderInputWithCopy("State", "State", workExp["expState"])}
            </div>
          ))}
        </Panel>
      </Collapse>

      <Collapse expandIconPosition="end"
        expandIcon={customExpandIcon} // Use the custom expand icon function

        ghost>
        <Panel header={renderStyledHeader("Education")} key="4">
          {educationExperiences.map((eduExp, index) => (
            <div key={index} className="mb-2">
              {renderInputWithCopy("Degree", "Degree", eduExp["degree achieved"])}
              {renderInputWithCopy("Subject", "Subject", eduExp["degree achieved"])}
              {renderInputWithCopy("Institution", "Institution", eduExp["school name"])}
              {renderInputWithCopy("Graduation Date", "Graduation Date", eduExp["end date (MM/YY)"])}
              {renderInputWithCopy("City", "City", eduExp.eduCity)}
              {renderInputWithCopy("State", "State", eduExp.eduState)}
            </div>
          ))}
        </Panel>
      </Collapse>

      {/* <Collapse expandIconPosition="end" 
          expandIcon={customExpandIcon} // Use the custom expand icon function
          ghost>
            <Panel header={renderStyledHeader("Certifications")} key="5">
              {certifications.map((certi, index) => (
                <div key={index} className="mb-2">
                  {renderInputWithCopy("Certification Name", "Certification Name", certi.type)}
                  {renderInputWithCopy("Organization", "Organization", certi.description)}
                  {renderInputWithCopy("Completion Year", "Completion Year", certi.graduationYear)}
                </div>
              ))}
            </Panel>
          </Collapse> */}
      {certifications.length > 0 && (
        <Collapse expandIconPosition="end" expandIcon={customExpandIcon} ghost>
          <Panel header={renderStyledHeader("Certifications")} key="5">
            {certifications.map((certi, index) => (
              <div key={index} className="mb-2">
                {renderInputWithCopy("Certification Name", "Certification Name", certi.type)}
                {renderInputWithCopy("Organization", "Organization", certi.description)}
                {renderInputWithCopy("Completion Year", "Completion Year", certi.graduationYear)}
              </div>
            ))}
          </Panel>
        </Collapse>
      )}

      <AiQuestionAnswerListing />
      {/* </Panel>
      </Collapse> */}

    </div>
  );
};

export default ResumeInformation;