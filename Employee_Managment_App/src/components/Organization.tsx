// src/components/Organization.tsx
import * as React from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Employees from './Employees';
import './Organization.css';

export type SelectedFilter = 'active' | 'myTeam' | 'directReporters' | null;

const Organization = () => {
  // Single-select state (one active pill at a time)
  const [selected, setSelected] = React.useState<SelectedFilter>('active');

  // Click handler: selects a pill; clicking the same pill toggles it off
  const handleSelect = (key: Exclude<SelectedFilter, null>) => {
    setSelected(prev => (prev === key ? null : key));
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
      <div className="org-theme org-page">
        <div className="org-filters">
          <span className="org-filters__label">Filters:</span>

          <div className="org-filters__pills">
            <ButtonComponent
              cssClass={`e-outline org-pill ${selected === 'active' ? 'org-pill--active e-primary' : ''}`}
              onClick={() => handleSelect('active')}
              aria-pressed={selected === 'active'}
            >
              Active (Chennai)
            </ButtonComponent>

            <ButtonComponent
              cssClass={`e-outline org-pill ${selected === 'myTeam' ? 'org-pill--active e-primary' : ''}`}
              onClick={() => handleSelect('myTeam')}
              aria-pressed={selected === 'myTeam'}
            >
              My Team
            </ButtonComponent>

            <ButtonComponent
              cssClass={`e-outline org-pill ${selected === 'directReporters' ? 'org-pill--active e-primary' : ''}`}
              onClick={() => handleSelect('directReporters')}
              title='Including employees in India and the US'
              aria-pressed={selected === 'directReporters'}
            >
              Direct Reporters
            </ButtonComponent>
          </div>
        </div>
      </div>
    );
  };

  const content0 = () => {
    return (
      <div className="org-theme org-page">
        <FilterBar />
        {/* Pass the selected filter and userInfo to Employees */}
        <Employees userInfo={userInfo} selected={selected} />
      </div>
    );
  };

  return (
    <div className="employeespage org-theme">
      <div className="employees-content" style={{paddingTop: "11px"}}>{content0()} </div>
    </div>
  );
};

export default Organization;