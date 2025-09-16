import * as React from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Employees from './Employees';
import './Organization.css';

type FiltersState = {
  active: boolean;
  myTeam: boolean;
  directReporters: boolean;
};

const Organization = () => {
  const [filters, setFilters] = React.useState<FiltersState>({
    active: true,
    myTeam: false,
    directReporters: false,
  });

  const toggleFilter = (key: keyof FiltersState) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };
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
   const FilterBar: React.FC = () => {
    return (
      <div className="org-filters">
        <span className="org-filters__label">Filters:</span>

        <ButtonComponent
          isToggle
          cssClass={`e-outline org-pill ${filters.active ? 'org-pill--active e-primary' : ''}`}
          onClick={() => toggleFilter('active')}
        >
          Active (Chennai)
        </ButtonComponent>

        <ButtonComponent
          isToggle
          cssClass={`e-outline org-pill ${filters.myTeam ? 'org-pill--active e-primary' : ''}`}
          onClick={() => toggleFilter('myTeam')}
        >
          My Team
        </ButtonComponent>

        <ButtonComponent
          isToggle
          cssClass={`e-outline org-pill ${filters.directReporters ? 'org-pill--active e-primary' : ''}`}
          onClick={() => toggleFilter('directReporters')}
        >
          Direct Reporters
        </ButtonComponent>
      </div>
    );
  };
  const content0 = () => {
    return (
      <div className="tab-content">
        <FilterBar />
        <Employees userInfo={userInfo} />
      </div>
    );
  };
  return (
    <div className="employeespage">
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
