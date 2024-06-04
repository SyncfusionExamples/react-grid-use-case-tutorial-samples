import * as React from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import Employees from './Employees';

const Organization = () => {
  const userInfo = {
    Name: 'Michael Anderson',
    EmployeeCode: 'EMP100001',
    Branch: 'Tower 1',
    Team: 'Management',
    Designation: 'General Manager',
    TeamLead: 'Christopher Anderson',
    ManagerName: 'Christopher Anderson',
    Mail: 'michael_anderson100001@xyz.com',
    DateOfJoining: new Date(new Date().getFullYear() - 20, 2, 1),
    FirstName: 'Michael',
    LastName: 'Anderson',
    FatherName: 'David Anderson',
    MotherName: 'Pamela Anderson',
    Gender: 'Male',
    BloodGroup: 'O+ve',
    MaritalStatus: 'Married',
    DOB: new Date(new Date().getFullYear() - 42, 3, 20),
  };
  const content0 = () => {
    return (
      <div className="tab-content">
        <Employees userInfo={userInfo} />
      </div>
    );
  };
  return (
    <div className="employeespage">
      <div className="employees-header">
        <div>Organization</div>
      </div>
      <div className="employees-content">
        <TabComponent heightAdjustMode="Auto">
          <TabItemsDirective>
            <TabItemDirective
              header={{ text: 'Employees' }}
              content={content0}
            />
          </TabItemsDirective>
        </TabComponent>
      </div>
    </div>
  );
};

export default Organization;
