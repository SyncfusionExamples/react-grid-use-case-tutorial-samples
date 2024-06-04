import * as React from 'react';

const Policies = () => {
  return (
    <div className="policiespage">
      <div className="policies-header">
        <div>Policies</div>
      </div>
      <div className="policies-content">
        <div className="col-lg-12 card-control-section basic_card_layout">
          <div className="e-card-resize-container">
            <div className="row">
              <div className="row card-layout">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                  <div className="e-card" id="basic_card">
                    <div className="e-card-header">
                      <div className="e-card-header-caption">
                        <div className="e-card-header-title">Assets Policy</div>
                      </div>
                    </div>
                    <div className="e-card-content">
                      XYZ provides devices to its employees for work purposes
                      and allows employees to carry these devices home. We
                      expect devices to be in good condition when they are
                      returned or exchanged for updated devices.
                    </div>
                    <div className="e-card-actions">
                      <a href="https://ej2.syncfusion.com/" target="_blank" rel="noopener noreferrer">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                  <div className="e-card" id="weather_card">
                    <div className="e-card-header">
                      <div className="e-card-header-caption">
                        <div className="e-card-header-title">
                          Attendance Policy
                        </div>
                      </div>
                    </div>
                    <div className="e-card-content">
                      Attendance and punctuality are important factors for your
                      success within our company. We work as a team and this
                      requires that each person be in the right place at the
                      right time.
                    </div>
                    <div className="e-card-actions">
                      <a href="https://ej2.syncfusion.com/" target="_blank" rel="noopener noreferrer">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="row card-layout">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                  <div className="e-card" id="basic_card">
                    <div className="e-card-header">
                      <div className="e-card-header-caption">
                        <div className="e-card-header-title">
                          Protecting Information Policy
                        </div>
                      </div>
                    </div>
                    <div className="e-card-content">
                      Protecting our company's information is the responsibility
                      of every associate, and we all share a common interest in
                      making sure information is not improperly or accidentally
                      disclosed.
                    </div>
                    <div className="e-card-actions">
                      <a href="https://ej2.syncfusion.com/" target="_blank" rel="noopener noreferrer">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                  <div className="e-card" id="weather_card">
                    <div className="e-card-header">
                      <div className="e-card-header-caption">
                        <div className="e-card-header-title">Leave Policy</div>
                      </div>
                    </div>
                    <div className="e-card-content">
                      Employees have a yearly entitlement of 36 leave days. This
                      allocation allows for adequate time off to rest and
                      recharge. Such benefits contribute to employee well-being
                      and job satisfaction.
                    </div>
                    <div className="e-card-actions">
                      <a href="https://ej2.syncfusion.com/" target="_blank" rel="noopener noreferrer">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
