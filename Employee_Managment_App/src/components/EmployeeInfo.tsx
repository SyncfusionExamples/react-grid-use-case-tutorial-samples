import * as React from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Internationalization } from '@syncfusion/ej2-base';
import { useLocation } from 'react-router-dom';
import { EmployeeDetails } from '../interface';
import EmployeeLeave from './EmployeeLeave';
import EmployeePayStub from './EmployeePayStub';
import EmployeePayRoll from './EmployeePayRoll';
import Employees from './Employees';

const EmployeeInfo = (props: { employeeData?: EmployeeDetails; userInfo?: EmployeeDetails }) => {
    const location = useLocation();
    const employeeID = location.state?.employeeID;
    let employeeData: EmployeeDetails = props.employeeData
        ? props.employeeData
        : employeeID
            ? employeeID
            : {};
    const userInfo: EmployeeDetails = location.state?.userInfo
        ? location.state?.userInfo
        : props.userInfo
            ? props.userInfo
            : {};
    let intl: Internationalization = new Internationalization();
    let dFormatter: Function = intl.getDateFormat({ type: 'date', skeleton: 'medium' });
    let dateOfJoining: string = employeeData && dFormatter(employeeData.DateOfJoining);
    let dob: string = employeeData && dFormatter(employeeData.DOB);
    let experience: number = new Date().getFullYear() - employeeData.DateOfJoining.getFullYear();
    let headerText: Object[] = [
        { text: 'Official' },
        { text: 'Personal' },
        { text: 'Leave report' },
        { text: 'Pay Stub' },
        { text: 'Pay Roll' },
        { text: 'Contact' },
        { text: 'Education' },
        { text: 'About Me' },
    ];
    const content0 = () => {
        return (
            <div className="tab-content">
                <div className="detail">
                    <span className="sub-heading">Employee ID</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.EmployeeCode}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Team</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.Team}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Reporting person</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.TeamLead}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Manager Name</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.ManagerName}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Mail ID</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.Mail}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Designation</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.Designation}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Confirmed</span>
                    <span className="gap">:</span>
                    <span className="information">Yes</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Office Location</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.Branch}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Date Joined</span>
                    <span className="gap">:</span>
                    <span className="information">
                        {dateOfJoining}
                    </span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Experience</span>
                    <span className="gap">:</span>
                    <span className="information">{experience}+ years</span>
                </div>
            </div>
        );
    };

    const content1 = () => {
        return (
            <div className="tab-content">
                <div className="detail">
                    <span className="sub-heading">First Name</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.FirstName}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Last Name</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.LastName}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Date of Birth</span>
                    <span className="gap">:</span>
                    <span className="information">{dob}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Gender</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.Gender}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Father's Name</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.FatherName}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Mother's Name</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.MotherName}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Blood Group</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.BloodGroup}</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Marital Status</span>
                    <span className="gap">:</span>
                    <span className="information">{employeeData.MaritalStatus}</span>
                </div>
            </div>
        );
    };

    const content2 = () => {
        return (
            <div className="tab-content">
                <EmployeeLeave employeeData={employeeData} userInfo={userInfo} />
            </div>
        );
    };

    const content3 = () => {
        return (
            <div className="tab-content">
                <EmployeePayStub employeeData={employeeData} />
            </div>
        );
    };

    const content4 = () => {
        return (
            <div className="tab-content">
                <EmployeePayRoll employeeData={employeeData} />
            </div>
        );
    };

    const overview = () => {
        return (
            <div>
                <div className="overview-header">
                    <div className="profile-image">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            fill="currentColor"
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                            color="rgba(0, 0, 0, .54)"
                        >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path
                                fillRule="evenodd"
                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="profile-data">
                            <b>{employeeData.Name}</b>
                        </div>
                        <div className="profile-data">{employeeData.Designation}</div>
                        <div className="profile-data">Branch: {employeeData.Branch}</div>
                        <div className="profile-data">Lead: {employeeData.TeamLead}</div>
                    </div>
                </div>
                <div className="overview-content">
                    <TabComponent heightAdjustMode="Auto">
                        <TabItemsDirective>
                            <TabItemDirective header={headerText[0]} content={content0} />
                            {employeeData &&
                                userInfo &&
                                (userInfo.Name === employeeData.Name ||
                                    userInfo.Name === employeeData.TeamLead) && (
                                    <TabItemDirective header={headerText[1]} content={content1} />
                                )}
                            {employeeData &&
                                userInfo &&
                                (userInfo.Name === employeeData.Name ||
                                    userInfo.Name === employeeData.TeamLead) && (
                                    <TabItemDirective header={headerText[2]} content={content2} />
                                )}
                            {employeeData &&
                                userInfo &&
                                userInfo.Name === employeeData.Name && (
                                    <TabItemDirective header={headerText[3]} content={content3} />
                                )}
                            {employeeData &&
                                userInfo &&
                                userInfo.Name === employeeData.Name && (
                                    <TabItemDirective header={headerText[4]} content={content4} />
                                )}
                        </TabItemsDirective>
                    </TabComponent>
                </div>
            </div>
        );
    };
    const myTeam = () => {
        return (
            <div className="tab-content">
                <Employees employeeData={employeeData} userInfo={userInfo} />
            </div>
        );
    };
    return (
        <div className="employeeinfopage">
            <div className="employeeinfo-header">
                {employeeData.Name === userInfo.Name ? 'My' : employeeData.Name + "'s"}{' '}
                Profile
            </div>
            <div className="employeeinfo-content">
                <TabComponent heightAdjustMode="Auto">
                    <TabItemsDirective>
                        <TabItemDirective
                            header={{ text: 'Overview' }}
                            content={overview}
                        />
                        {employeeData.Name === userInfo.Name && (
                            <TabItemDirective header={{ text: 'My Team' }} content={myTeam} />
                        )}
                    </TabItemsDirective>
                </TabComponent>
            </div>
        </div>
    );
};

export default EmployeeInfo;
