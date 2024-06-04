
export interface EmployeeDetails {
    Name: string;
    EmployeeCode: string;
    Branch: string;
    Team: string;
    Designation: string;
    TeamLead: string;
    ManagerName: string;
    Mail: string;
    DateOfJoining: Date;
    FirstName: string;
    LastName: string;
    FatherName: string;
    MotherName: string;
    Gender: string;
    BloodGroup: string;
    MaritalStatus: string;
    DOB: Date;
}
export interface EmployeeLeaveDetails {
    Name: string;
    EmployeeCode: string;
    DateOfJoining: Date;
    Branch: string;
    Team: string;
    Designation: string;
    TeamLead: string;
    ManagerName: string;
    Image: string;
    Mail: string;
    AttendanceID: string;
    AbsenceType: string;
    ShiftName: string;
    From: Date;
    To: Date;
    Days: number;
    Status: string;
    CreatedBy: string;
}

export interface EmployeePayStubDetails {
    Name: string;
    EmployeeCode: string;
    DateOfJoining: Date;
    Branch: string;
    Team: string;
    Designation: string;
    TeamLead: string;
    ManagerName: string;
    Image: string;
    Mail: string;
    JanPayStub: MonthPayStub;
    FebPayStub: MonthPayStub;
    MarPayStub: MonthPayStub;
    AprPayStub: MonthPayStub;
    MayPayStub: MonthPayStub;
    JunPayStub: MonthPayStub;
    JulPayStub: MonthPayStub;
    AugPayStub: MonthPayStub;
    SepPayStub: MonthPayStub;
    OctPayStub: MonthPayStub;
    NovPayStub: MonthPayStub;
    DecPayStub: MonthPayStub;

}

export interface MonthPayStub {
    RegularHoursWorked: number;
    OverTimeHoursWorked: number;
    Bonus: number;
    Commission: number;
    FederalIncomeTax: number;
    StateIncomeTax: number;
    SocialSecurityTax: number;
    MedicareTax: number;
}