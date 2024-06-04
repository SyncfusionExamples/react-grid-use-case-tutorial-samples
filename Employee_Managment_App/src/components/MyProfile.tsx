import * as React from 'react';
import EmployeeInfo from './EmployeeInfo';
import { EmployeeDetails } from '../interface';

const MyProfile = () => {
  const employeeData: EmployeeDetails = {
    Name: 'Michael Anderson',
    EmployeeCode: 'EMP100001',
    Branch: 'Tower 1',
    Team: 'Management',
    Designation: 'General Manager',
    TeamLead: 'Christopher Anderson',
    ManagerName: 'Christopher Anderson',
    Mail: 'michael_anderson100001@xyz.com',
    DateOfJoining: new Date(new Date().getFullYear() - 20, 1, 1),
    FirstName: 'Michael',
    LastName: 'Anderson',
    FatherName: 'David Anderson',
    MotherName: 'Pamela Anderson',
    Gender: 'Male',
    BloodGroup: 'O+ve',
    MaritalStatus: 'Married',
    DOB: new Date(new Date().getFullYear() - 42, 2, 20),
  };
  const userInfo: EmployeeDetails = employeeData;

  return (
    <div>
      <EmployeeInfo employeeData={employeeData} userInfo={userInfo} />
    </div>
  );
};

export default MyProfile;
