import * as React from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { useLocation } from 'react-router-dom';
import { EmployeeDetails } from '../interface';
import EmployeeLeave from './EmployeeLeave';
import EmployeePayStub from './EmployeePayStub';
import EmployeePayRoll from './EmployeePayRoll';
import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';



const EmployeeInfo = (props: { employeeData?: EmployeeDetails; userInfo?: EmployeeDetails }) => {
    const location = useLocation();
    const [defaultEmployee, setDefaultEmployee] = React.useState<EmployeeDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    
    // Fetch default employee on component mount if no employee is selected
    React.useEffect(() => {
        const fetchDefaultEmployee = async () => {
            setLoading(true);
            try {
                const dataManager = new DataManager({
                    url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesData',
                    adaptor: new UrlAdaptor(),
                    crossDomain: true,
                });
                
                const query = new Query().take(1);
                const result: any = await dataManager.executeQuery(query);
                
                console.log('Fetched employee data:', result);
                
                // Handle different response formats
                let employeeArray: any[] = [];
                if (Array.isArray(result)) {
                    employeeArray = result;
                } else if (result && Array.isArray(result.result)) {
                    employeeArray = result.result;
                }
                
                if (employeeArray.length > 0) {
                    setDefaultEmployee(employeeArray[0] as EmployeeDetails);
                }
            } catch (error) {
                console.error('Error fetching default employee:', error);
            } finally {
                setLoading(false);
            }
        };
        
        // Only fetch if no employee is already provided
        const routeEmployee = (location.state as any)?.employeeID;
        if (!routeEmployee && !props.employeeData && !props.userInfo) {
            fetchDefaultEmployee();
        }
        // Always set loading to false after checking - we have defaults
        setLoading(false);
    }, []);
    
    // Default employee - used if API fetch fails or takes time
    const defaultEmployeeData: EmployeeDetails = {
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

    
    
    // Prefer explicit employee from route state, then prop, then fallback to defaultEmployee or hardcoded default
    const routeEmployee = (location.state as any)?.employeeID as any;
    const routeUser = (location.state as any)?.userInfo as any;
    const userInfo: EmployeeDetails = (routeUser as any) ?? (props.userInfo as any) ?? {} as any;
    let employeeData: EmployeeDetails = (routeEmployee as any) ?? (props.employeeData as any) ?? (userInfo as any) ?? (defaultEmployee as any) ?? defaultEmployeeData;
    // Format the date to the desired output
    const custom: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };

    // Normalize possible string dates to Date objects and guard for missing values
    const dojDate: Date | null = employeeData && (employeeData as any).DateOfJoining
        ? new Date((employeeData as any).DateOfJoining)
        : null;
    const dobDate: Date | null = employeeData && (employeeData as any).DOB
        ? new Date((employeeData as any).DOB)
        : null;

    const dateOfJoining: string = dojDate ? dojDate.toLocaleDateString('en-US', custom).replace(/,/g, ''): '-';
    const dob: string = dobDate ? dobDate.toLocaleDateString('en-US', custom).replace(/,/g, ''): '-';

    const now = new Date();
    let experienceYears = 0;
    let experienceMonths = 0;
    if (dojDate) {
        let months = (now.getFullYear() - dojDate.getFullYear()) * 12 + (now.getMonth() - dojDate.getMonth());
        if (months < 0) months = 0;
        experienceYears = Math.floor(months / 12);
        experienceMonths = months % 12;
    }
    let headerText: Object[] = [
        { text: 'OFFICIAL' },
        { text: 'PERSONAL' },
        { text: 'LEAVE REPORT' },
        { text: 'PAY STUB' },
        { text: 'PAY ROLL' },
        { text: 'CONTACT' },
        { text: 'EDUCATION' },
        { text: 'ABOUT ME' },
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
                    <span className="information">{experienceYears} Years {experienceMonths} Months</span>
                </div>
                <div className="detail">
                    <span className="sub-heading">User Work Shift</span>
                    <span className="gap">:</span>
                    <span className="information">
                        {"Regular"}
                    </span>
                </div>
                <div className="detail">
                    <span className="sub-heading">WFH</span>
                    <span className="gap">:</span>
                    <span className="information">
                        {"Yes"}
                    </span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Employment Type</span>
                    <span className="gap">:</span>
                    <span className="information">
                        {"Full-Time"}
                    </span>
                </div>
                <div className="detail">
                    <span className="sub-heading">Company Benefits</span>
                    <span className="gap">:</span>
                    <span className="information">
                        {"Health Insurance, Gift Cards"}
                    </span>
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

    const hasEmployee = employeeData && Object.keys(employeeData as any).length > 0;

    // Determine if private tabs should be visible
// Only show when viewing the logged-in user's own profile.
// With TopNav now passing EMP100001 as userInfo, this enables private tabs only when the selected
// employee is EMP100001.
const canSeePrivateTabs =
  !!employeeData?.EmployeeCode &&
  !!userInfo?.EmployeeCode &&
  userInfo.EmployeeCode === employeeData.EmployeeCode;

  <TabComponent heightAdjustMode="Auto" swipeMode="None" overflowMode='Scrollable'>
  <TabItemsDirective>
    <TabItemDirective header={headerText[0]} content={content0} />
    {canSeePrivateTabs && <TabItemDirective header={headerText[1]} content={content1} />}
    {canSeePrivateTabs && <TabItemDirective header={headerText[2]} content={content2} />}
    {canSeePrivateTabs && <TabItemDirective header={headerText[3]} content={content3} />}
    {canSeePrivateTabs && <TabItemDirective header={headerText[4]} content={content4} />}
  </TabItemsDirective>
</TabComponent>

    const overview = () => {
        if (loading) {
            return (
                <div className="tab-content">
                    <div>Loading employee data...</div>
                </div>
            );
        }
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
                    <div className="profile-content">
                        <div className="profile-data-name">{employeeData.Name}</div>
                        <div className="profile-data-mail">{employeeData.Mail}</div>
                        <div className="profile-data-designation">{employeeData.Designation}</div>
                        <div className='profile-data-Teamname'>{employeeData.Team}</div>
                        <div className="profile-data-supervisor">Supervisor: {employeeData.TeamLead}</div>
                        <div className="Profile-data-availability e-badge"> Available - {employeeData.Branch}</div>
                    </div>
                </div>
                <div className="overview-content">
                    <TabComponent heightAdjustMode="Auto" swipeMode="None" overflowMode='Scrollable' cssClass='content-overview'>
                        <TabItemsDirective >
                            <TabItemDirective header={headerText[0]} content={content0} />
                            {employeeData &&
                                userInfo &&
                                (userInfo.Name === employeeData.Name) && (
                                    <TabItemDirective header={headerText[1]} content={content1} />
                                )}
                            {employeeData &&
                                userInfo &&
                                (userInfo.Name === employeeData.Name) && (
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
    return (
        <div className="employeeinfopage">
            <div className="employeeinfo-content">
                <TabComponent heightAdjustMode="Auto" cssClass='employee-header'>
                    <TabItemsDirective>
                        <TabItemDirective
                            header={{ text: 'OVERVIEW' }}
                            content={overview}
                        />
                    </TabItemsDirective>
                </TabComponent>
            </div>
        </div>
    );
};

export default EmployeeInfo;