import React, { useEffect, useRef, useState } from 'react';
import { Collapse } from 'antd';
import checkOne from '../../../assets/images/checkOne.svg';
import error from '../../../assets/images/error.svg';
import SimpleField from './SimpleField';
import SimpleTextArea from './SimpleTextArea';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import RadioField from './RadioField';
import { RightOutlined } from '@ant-design/icons'; // Importing default right arrow icon

import { makeRequest } from '../../../utils/helpers';
import { fetchAutoFillData } from '../../api';
import { IAutoApply } from '../../interfaces/autoApply';
import { getAuthFromCookie } from '../../../utils/auth';
import Spinner from '../Spinner';
import AiQuestionAnswerListing from '../AiQuestionAnswerListing';
import { Mixpanel } from '../../utils/mixpanel';
const script = require("../../utils/extractor")


const { Panel } = Collapse;

type FormFieldsProps = {
  showFilledView: (open: boolean) => void;
};

const FormFields: React.FC<FormFieldsProps> = ({ showFilledView }) => {

  const [currentPageUrl, setCurrentPageUrl] = useState<string>()
  const [auth, setAuth] = useState<string>()
  const [formData, setFormData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tabId, setTabId] = useState<number>(0)

  const myStateRef = useRef(formData);
  const AuthStateRef = useRef(auth);
  const currentPageUrlStateRef = useRef(currentPageUrl);

  const setMyState = (data: FormData[]) => {
    myStateRef.current = data;
    setFormData(data);
  };

  const setMyAuth = (data: string) => {
    AuthStateRef.current = data;
    setAuth(data);
  };

  const setMyCurrentPageUrl = (data: string) => {
    currentPageUrlStateRef.current = data;
    setCurrentPageUrl(data);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    getCurrentTabUrlAndId()
    getAuth()
  }, [])

  useEffect(() => {
    if (currentPageUrl && auth) {
      getFieldsData()
    }
  }, [currentPageUrl, auth])

  const listener = (message: any, sender: any, sendResponse: any) => {
    if (message.action === "fieldChanged") {
      const { value, type,text, index, checkboxes } = message.data;
      const prevData = [...myStateRef.current]
      let field = prevData[index]
      if (type == "checkbox") {
        const { name,value,checkvalue,checkboxes } = message.data;
        if (currentPageUrlStateRef.current?.includes("applytojob.com")) {
          field.checkboxes = field.checkboxes.map((checkbox:any) => {
            if (checkbox.value === value) {
              return { ...checkbox, checked: checkvalue };
            }
            return checkbox;
          });
        }else{
          field = {
            ...field,
            value: value,
            checkboxes: checkboxes ? checkboxes.map((checkbox: any) => checkbox) : []
          };  
        }
      }
      else if (type === "radio") {
        const { text } = message.data;
        // Exception for Bamboo HR. Need to remove label for other ATS as well
        if (currentPageUrlStateRef.current?.includes("bamboohr.com")) {
          field = {
            ...field,
            text,
            checkboxes: field.checkboxes.map((checkbox: any) =>
              checkbox.value === text
                ? { ...checkbox, checked: true }
                : { ...checkbox, checked: false }
            ),
          };
        } else if(currentPageUrlStateRef.current?.includes("applytojob.com")){
          field = {
            ...field,
            text,
            checkboxes: field.checkboxes.map((checkbox: any) =>
              checkbox.value === text
              ? { ...checkbox, checked: true }
              : { ...checkbox, checked: false }
            ),
          };
        } else {
          field = {
            ...field,
            text,
            checkboxes: field.checkboxes.map((checkbox: any) =>
              checkbox.label === text
              ? { ...checkbox, checked: true }
              : { ...checkbox, checked: false }
            ),
          };
        }
      }
      else {
        field = {
          ...field,
          value
        }
      }
      prevData[index] = field
      setMyState([...prevData])
    }
    else if (message.action === "selectOptionChanged") {

      const { text, id } = message.data;

      const prevData = [...myStateRef.current];
      const index = prevData.find(val => val.id === id)
      let field = prevData[index];
      if (field) {
        const { options } = field;
        const updatedOptions = options.map((op: any) =>
          op.text === text ? { ...op, selected: true } : { ...op, selected: false }
        );
        const { value } = updatedOptions.find((op: any) => op.selected);
        field = { ...field, text, value, options: updatedOptions };
        prevData[index - 1] = field;
      }
      setMyState(prevData);
    }
    else if (message.action === "saveIFrameData") {
      const { jobTitle, jobDescription } = message
      chrome.runtime.sendMessage(
        {
          action: 'saveExtensionData',
          data: {
            auth: AuthStateRef.current,
            currentUrl: currentPageUrlStateRef.current,
            InputFields: [...myStateRef.current, jobTitle, jobDescription],
          },
        }
        , function (response) {
          console.log("response save data success fully", response); // Process the response from the background script
        }
      )
      sendResponse({ success: true });

    } else if (message.action === "refillJobForm") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        tabs[0].id && setTabId(tabs[0].id);
        autoFiller(tabs[0].id!, myStateRef.current, url, true)
      });
    }
    // else if (message.action === "saveIFrameData") {
    //   const { auth, currentPageUrl, InputFields } = message.data;

    //   chrome.runtime.sendMessage({
    //     action: "saveExtensionData",
    //     data: {
    //       auth,
    //       currentPageUrl,
    //       InputFields 
    //     }
    //   }, function (response) {
    //     console.log("response", response); // Process the response from the background script if needed
    //   });
    // }
  };

  // const showAutofill = () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id!, { action: "initializeIFrame" });
  //   });
  // }

  const getCurrentTabUrlAndId = () => {
    // Query the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      setMyCurrentPageUrl(url!)
      tabs[0].id && setTabId(tabs[0].id);
    });
  };

  const getAuth = async () => {
    const cookieAuth = await getAuthFromCookie()
    setMyAuth(cookieAuth)
  }

  const getFieldsData = () => {
    script.executeScript(tabId, auth, currentPageUrl, processFormFieldsData)
  }

  const processFormFieldsData = async (fields: any) => {
    const payload: IAutoApply = {
      job_url: currentPageUrl!,
      form_list: fields,
      auth: auth!,
    }
    makeRequest(setLoading, fetchAutoFillData, payload, fillData, ErrorHandler);
  }

  const fillData = async (promise: any) => {
    const data = await promise
    if (data.data) {
      const localStorageData = localStorage.getItem("ResumeInformationData");
      const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
      const email = parsedData ? parsedData["Contact information"]?.email : null;
      if (email) {
        const properties = {
          page: "Auto Applier",
          environment: "Production",
          timestamp: new Date().toISOString(),
          $email: email,
          "Tool Name": "Auto Applier",
          current_url: currentPageUrl,
        };
        Mixpanel.track("Output Generated", properties, auth, email)
      }
      let userData = data.data
      if (data?.resume_url) {
        script.uploadFile(tabId, data?.resume_url,currentPageUrl)
        if (currentPageUrl?.includes("greenhouse.io")) {
          userData = [...userData.filter((field: any) => field.id !== 'resume_text')]
        }
      }
      setMyState(userData)
      autoFiller(tabId, userData, currentPageUrl)
    } else {
      chrome.runtime.sendMessage({ action: "closeIFrame" }, function (response) {
        console.log(response); // Process the response from the background script
      });
    }

  }

  const ErrorHandler = () => {
    chrome.runtime.sendMessage({ action: "closeIFrame" }, function (response) {
      console.log(response); // Process the response from the background script
    });
  }

  const autoFiller = (tabId: number, formData: any[], pageURL?: string, isRefill: boolean = false) => {
    script.fillForm(tabId, formData, pageURL, isRefill)
    if (!isRefill) {
      showFilledView(true)
    }
  }

  // const customPanelHeader = (
  //   <div style={{
  //     color: '#04041FCC',
  //     textAlign: 'center',
  //     fontFamily: "'Inter', sans-serif",
  //     fontSize: '18px',
  //     fontStyle: 'normal',
  //     fontWeight: 600,
  //     lineHeight: '150%',
  //   }}>
  //     Application Fields
  //   </div>
  // );

  const inputs = [
    {
      types: ['text', 'email'],
      component: (field: any, index: number) =>
        <SimpleField
          handleChange={
            (e: React.ChangeEvent<HTMLInputElement>) => {
              updateForm(e.target.value, index)
            }
          } value={field.value} />
    },
    {
      types: ['select-one'],
      component: (field: any, index: number) =>
        <SelectField
          key={index}
          options={field.options}
          value={field.value}
          updateSelect={(value) => updateForm(value, index)}
          index={index}
        />
    },
    {
      types: ['textarea'],
      component: (field: any, index: number) =>
        <SimpleTextArea
          onChange={
            (value: string) => {
              updateForm(value, index)
            }
          }
          defaultValue={field.value}
          tooltip={field.tooltip}
          labelQuestion={field.label}
        />
    },
    {
      types: ['checkbox'],
      component: (field: any, index: number) =>
        <CheckboxField
          checkboxes={field.checkboxes}
          onUpdate={(value) => updateForm(value, index)} />
    },
    {
      types: ['radio'],
      component: (field: any, index: number) => {
        const defaultValue = field.checkboxes.find((f: any) => f.checked);
        return (
          <RadioField
            onUpdate={(name, checkboxes) => updateFormRadio(name, checkboxes)}
            options={field.checkboxes}
            defaultValue={defaultValue?.label}
          />
        );
      },
    },
  ];

  const getInputField = (field: any, index: number) => {
    return inputs.find(input => input.types.some(type => type === field.type))?.component(field, index)
  }

  const updateForm = (value: any, index: any) => {
    const newData = [...myStateRef.current]
    newData[index].value = value
    chrome.runtime.sendMessage({
      action: "fieldChanged",
      data: { name: newData[index].name, value: value }
    });
    script.fillForm(tabId, newData, currentPageUrl, true)
    setMyState(newData)
  }

  const updateFormRadio = (name: string, radios: any[]) => {
    const newData = [...myStateRef.current];
    const index = newData.findIndex(
      // (data) => data.name == name
      (data) => data.value == name
    );

    const defaultValue = radios.find((radio: any) => radio.checked);
    newData[index] = {
      ...newData[index],
      checkboxes: radios,
      text: defaultValue.label,
    };
    script.fillForm(tabId, newData, currentPageUrl, true);
    setMyState(newData)
  }
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
    <div >
      {/* <Collapse defaultActiveKey={['0']} expandIconPosition="end" ghost>
        <Panel header={customPanelHeader} key="1"> */}
      <div className='form-fields-container'>
        {loading ?
          <div className='loader-spinner'>
            <Spinner />
          </div>
          :
          <div>
            {formData.map((data: any, index) =>
              <div>
                {data.label != "" &&
                  <div>
                    <Collapse expandIconPosition="end"
                      expandIcon={customExpandIcon} // Use the custom expand icon function
                      ghost>
                      <Panel header={
                        <>
                          {data.value === undefined || data.value === null || data.value === "" ?
                            <>
                              <img src={error} height={'21px'} width={'21px'} alt="Check One Icon" style={{ verticalAlign: 'middle', margin: '0px 4px 4px -2px', width: '21px', height: '21px' }} />
                            </>
                            :
                            <img src={checkOne} height={'21px'} width={'21px'} alt="Check One Icon" style={{ verticalAlign: 'middle', margin: '0px 4px 4px -2px', width: '21px', height: '21px' }} />
                          }
                          {/* for labels */}
                          {data.label}


                          {data.value === undefined || data.value === null || data.value === "" ?

                            <>
                              <div className='error-container'>
                                <p className='error-text'>
                                  We could not fill this field. Please write in your answer or use AI to generate a draft for you.
                                </p>
                              </div>
                            </>
                            : ""
                          }


                        </>
                      }
                        key="2">
                        {/* {data.type === "textarea" && data.value==="" ?
                    <>
                      <div className='tooltip-container'>
                        <p className='tooltip-text'>
                          {data.tooltip}
                        </p>
                      </div>
                    </>
                    : ""
                  } */}
                        {getInputField(data, index)}
                      </Panel>
                    </Collapse>
                    <div style={{ color: "#04041F1A", padding: "4px", textAlign: "center", opacity: 0.4, marginBottom: "4px", marginTop: "4px" }}>
                      <hr style={{ width: "100%", color: "#04041F1A", opacity: 0.4 }} />
                    </div>
                  </div>
                }
              </div>
            )}
          </div>
        }

      </div>
      {formData.length > 0 && (
        <AiQuestionAnswerListing />
      )}

    </div>
  );
};

export default FormFields;
