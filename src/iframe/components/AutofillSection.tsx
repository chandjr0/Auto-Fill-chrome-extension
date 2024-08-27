import React, { useEffect, useState } from 'react';
import FormFields from './form/FormFields';
import ResumeInformation from './ResumeInformation';
import AiAnswer from './AiAnswer';
import Footer from './footer/Footer';
import SubHeader from './header/SubHeader';
import AddQuestion from './AddQuestion';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import './index.css'
import AiAnswerOld from './AiAnswerOld';
import ApplicationFilled from './ApplicationFilled';


const AutofillSection: React.FC = () => {
  const [showApplicationFilled, setShowApplicationFilled] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showApplicationFilled) {
      timer = setTimeout(() => {
        toggleApplicationFilled(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showApplicationFilled]);

  const toggleApplicationFilled = (check: boolean) => {
    setShowApplicationFilled(check)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Job Application',
      children: <FormFields showFilledView={toggleApplicationFilled} />,
    },
    {
      key: '2',
      label: 'My Profile',
      children: <ResumeInformation />,
    },
  ];


  return (
    <>
    {
      showApplicationFilled && <ApplicationFilled />
    }
      {/* <ApplicationFilled showApplicationFilled={showApplicationFilled} /> */}
      <div className={`sub-header-wrapper ${showApplicationFilled? 'hidden': ''}`}>
        <SubHeader />
        <AddQuestion />
        {/* tabs  */}

        <div className='navigator-tabs'>
          <Tabs defaultActiveKey="1" rootClassName="asdffff" items={items} />
        </div>
        {/* <AiAnswer /> */}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default AutofillSection;



