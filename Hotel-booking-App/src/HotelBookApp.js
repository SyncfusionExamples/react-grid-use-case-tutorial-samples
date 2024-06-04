import * as React from 'react';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Inject,
    Page
} from '@syncfusion/ej2-react-grids';
import { closest } from '@syncfusion/ej2-base';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { ButtonComponent, ChipListComponent, ChipsDirective, ChipDirective } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { NumericTextBoxComponent, TextBoxComponent, RatingComponent, SliderComponent, UploaderComponent, MaskedTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { FormValidator } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TreeViewComponent, CarouselComponent } from '@syncfusion/ej2-react-navigations';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';

import { MapsComponent, LayersDirective, LayerDirective, MarkersDirective, MarkerDirective, Marker, MapsTooltip } from '@syncfusion/ej2-react-maps';
import * as USA from './usa.json';

import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { hotelData } from './DataCreation';
import './HotelBookApp.css';

function HotelBookApp() {

    const localHotelData = React.useRef(hotelData);

    let toastRef = React.useRef(null);

    let sidebarRef = React.useRef(null);
    let carouselContainerRef = React.useRef(null);

    const [showHotels, setShowHotels] = React.useState(true);

    let gridRef;
    const gridPageSettings = { pageSize: 10, pageSizes: true };
    let filterDataPredicate;
    const [hotelBookAppData, setHotelBookAppData] = React.useState([]);

    let drRef = React.useRef(null);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    const [rangeStartDate, setRangeStartDate] = React.useState(startDate);
    const [rangeEndDate, setRangeEndDate] = React.useState(endDate);

    let minPriceRef = React.useRef(null);
    let maxPriceRef = React.useRef(null);
    const minPrice = 50;
    const maxPrice = 1000;
    const sliderTooltip = { placement: 'After', isVisible: true, showOn: 'Focus' };

    const [showMapDialog, setShowMapDialog] = React.useState(false);

    let mapRef = React.useRef(null);
    const [mapDataSource, setMapDataSource] = React.useState([]);

    let sortDDRef = React.useRef(null);
    const ddData = [
        { key: 1, value: 'Top rating' },
        { key: 2, value: 'Price (low to high)' },
        { key: 3, value: 'Price (high to low)' },
    ];
    const ddFields = { text: 'value', value: 'key' };

    let priceRangeRef = React.useRef(null);

    let amenitiesRef = React.useRef(null);

    let roomAmenitiesRef = React.useRef(null);
    let amenitiesData = [
        { id: 1001, name: 'Amenities', hasChild: true, expanded: true, fieldValue: 'HotelFacility' },
        { id: 1002, pid: 1001, name: 'Parking' },
        { id: 1003, pid: 1001, name: 'Pet allowed' },
        { id: 1004, pid: 1001, name: 'Swiming pool' },
        { id: 1005, pid: 1001, name: 'Restaurant' },
        { id: 1006, pid: 1001, name: 'Spa' },
    ];
    let roomAmenitiesData = [
        { id: 2001, name: 'Room Amenities', hasChild: true, expanded: true, fieldValue: 'RoomFacility' },
        { id: 2002, pid: 2001, name: 'Television' },
        { id: 2003, pid: 2001, name: 'Projector' },
        { id: 2004, pid: 2001, name: 'Balcony' },
        { id: 2005, pid: 2001, name: 'Whiteboard' },
        { id: 2006, pid: 2001, name: 'Kitchen' },
        { id: 2007, pid: 2001, name: 'Internet' },
        { id: 2008, pid: 2001, name: 'Shower' },

    ];
    const amenitiesField = { dataSource: amenitiesData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
    const roomAmenitiesField = { dataSource: roomAmenitiesData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };

    let carouselRef = React.useRef(null);
    const [carouselDataSource, setCarouselDataSource] = React.useState([]);

    const [selectedRoom, setSelectedRoom] = React.useState({});

    let firstNameRef = React.useRef(null);

    let formObject = React.useRef(null);

    let extraBedRef = React.useRef(null);

    let lineThroughPriceRef = React.useRef(null);
    let taxedPriceRef = React.useRef(null);
    let priceStatementRef = React.useRef(null);

    const checkSortDD = (query) => {
        const value = sortDDRef.current.value;
        switch (value) {
            case 1:
                query.sortBy('Rating', 'descending');
                break;
            case 2:
                query.sortBy('Price', 'ascending');
                break;
            case 3:
                query.sortBy('Price', 'descending');
                break;
        }
    }

    const checkAmenities = (ref) => {
        const checkedNodes = ref.checkedNodes;
        for (let i = 0; i < checkedNodes.length; i++) {
            const childInfo = ref.treeData.find((data) => {
                return data.id.toString() === checkedNodes[i] && data.pid;
            });
            if (childInfo) {
                const parentInfo = ref.treeData.find(data => data.id === childInfo.pid);
                filterDataPredicate = filterDataPredicate.and(parentInfo.fieldValue, 'contains', childInfo.name);
            }
        }
    }

    const checkPriceRangeAndAmenities = (query) => {
        const value = priceRangeRef.current.value;
        filterDataPredicate = new Predicate('Price', 'greaterthanorequal', value[0]);
        filterDataPredicate = filterDataPredicate.and('Price', 'lessthanorequal', value[1]);

        checkAmenities(amenitiesRef.current);
        checkAmenities(roomAmenitiesRef.current);

        query.where(filterDataPredicate);
    }

    const generateHotelData = () => {
        let query = new Query();
        checkPriceRangeAndAmenities(query);
        checkSortDD(query);
        new DataManager(localHotelData.current).executeQuery(query).then((e) => {
            setHotelBookAppData(e.result);
        });
    }

    const gridCreated = () => {
        generateHotelData();
    }

    const sortDDChange = (args) => {
        generateHotelData();
    }

    const dateRangeChange = (args) => {
        if (args.startDate && args.endDate) {
            setRangeStartDate(args.startDate);
            setRangeEndDate(args.endDate);
            generateHotelData();
        }
    }

    const priceSliderChanged = (args) => {
        minPriceRef.current.innerText = args.value[0];
        maxPriceRef.current.innerText = args.value[1];
        generateHotelData();
    }

    const amenitiesNodeChecked = (args) => {
        generateHotelData();
    }

    const showMap = (args) => {
        const rowIndex = closest(args.target, 'tr').rowIndex;
        const rowObject = gridRef.currentViewData[rowIndex];
        setMapDataSource([rowObject.Location]);
        const mapInstRef = mapRef.current;
        setTimeout(() => {
            mapInstRef.refresh();
        }, 10);
        setShowMapDialog(true);
    }

    const closeShowMapDialog = () => {
        setShowMapDialog(false);
    }

    const customFn = (args) => {
        const argsLength = args.element.ej2_instances[0].value.length;
        return argsLength >= 10;
    };

    const setBookDetailsPrice = (selectedRoom) => {
        const price = selectedRoom.Price + (extraBedRef.current.value * selectedRoom.ExtraBedCost);
        const priceCollection = calculatedPrice(price, selectedRoom.DiscountPercentage, selectedRoom.TaxPercentage);
        lineThroughPriceRef.current.innerText = '$' + price.toFixed(2);
        taxedPriceRef.current.innerText = '$' + priceCollection.TaxedPrice;
        priceStatementRef.current.innerText = 'includes ' + selectedRoom.DiscountPercentage + '% discount (-$' + priceCollection.DiscountAmount + ') and ' + selectedRoom.TaxPercentage + '% tax (+$' + priceCollection.TaxAmount + ')';
    }

    const bookDetails = (args) => {
        const rowIndex = closest(args.target, 'tr').rowIndex;
        const rowObject = gridRef.currentViewData[rowIndex];
        setSelectedRoom(rowObject);
        setCarouselDataSource([
            { ID: 1, Name: rowObject.HotelImgID, imageName: rowObject.HotelImgID },
            { ID: 2, Name: rowObject.RoomImgID, imageName: rowObject.RoomImgID }
        ]);
        setShowHotels(false);

        setTimeout(() => {
            firstNameRef.current.element.focus();
            const options = {
                rules: {
                    firstname: {
                        required: [true, '* Please enter your first name'],
                        minLength: 3
                    },
                    lastname: {
                        required: [true, '* Please enter your last name'],
                        minLength: 3
                    },
                    email: {
                        required: [true, '* Please enter your email'],
                    },
                    phno: {
                        numberValue: [customFn, '* Please enter your phone number'],
                    },

                    address: {
                        required: [true, '* Please enter your address'],
                        minLength: 5
                    },
                    city: {
                        required: [true, '* Please enter your city'],
                        minLength: 3
                    },
                    code: {
                        required: [true, '* Please enter your code'],
                        minLength: 3
                    },
                    country: {
                        required: [true, '* Please enter your country'],
                    },
                },
            };
            formObject.current = new FormValidator('#form1', options);
            setBookDetailsPrice(rowObject);
        }, 10);

    }

    const backToHotels = () => {
        setShowHotels(true);
    }

    const getDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const checkRoomAvailable = (checkInOut) => {
        let isRoomAvailable = true;
        const startDate = getDate(drRef.current.startDate);
        const endDate = getDate(drRef.current.endDate);
        for (let i = 0; i < checkInOut.length; i++) {
            const checkIn = getDate(checkInOut[i].CheckIn);
            const checkOut = getDate(checkInOut[i].CheckOut);
            if ((checkIn <= startDate && startDate <= checkOut) || (checkIn <= endDate && endDate <= checkOut)) {
                isRoomAvailable = false;
                break;
            }
        }
        return isRoomAvailable;
    }

    const calculatedPrice = (price, discount, tax) => {
        const discountAmount = price * (discount * 0.01);
        const discountedPrice = price - discountAmount;
        const taxAmount = discountedPrice * (tax * 0.01);
        const taxedPrice = discountedPrice + taxAmount;
        return { DiscountAmount: discountAmount.toFixed(2), DiscountedPrice: discountedPrice.toFixed(2), TaxAmount: taxAmount.toFixed(2), TaxedPrice: taxedPrice.toFixed(2) };
    }

    const gridRowTemplate = (props) => {
        const src = '/images/' + props.RoomImgID + '.jpg';
        const hotelFacilityList = props.HotelFacility.split(', ');
        const roomFacilityList = props.RoomFacility.split(', ');
        const extrasList = props.Extras.split(', ');
        const isRoomAvailable = checkRoomAvailable(props.CheckInOut);
        const priceCollection = calculatedPrice(props.Price, props.DiscountPercentage, props.TaxPercentage);
        return (
            <tr className='templateRow'>
                <td className='e-rowtemplate-border-applier'>
                    {!isRoomAvailable && <div className='e-room-not-available-cover'></div>}
                    <div className='e-flex-layout e-img-info-container'>
                        <div className='e-img-container'>
                            <img src={src} alt={props.RoomImgID} className='e-img' />
                            {props.hotelImgID}
                        </div>
                        <div className='e-info-container'>
                            <div className='e-row-template-separator'>
                                <div className='e-flex-layout'>
                                    <div className='e-info-flex-width-applier'>
                                        <div>
                                            <span className='e-semi-bold-header-text'>{props.HotelName}</span>
                                        </div>
                                        <div className='e-below-text-styler'>
                                            <span className='e-address-text-styler'>{props.Address}</span>
                                            <span className='e-map-text-spacer'>(<span className='e-map-text-styler' onClick={showMap}>Show on map</span>)</span>
                                        </div>
                                    </div>
                                    <div className='e-flex-layout e-info-flex-width-applier e-rating-reviews-container'>
                                        <div>
                                            <RatingComponent value={props.Rating} readOnly={true} cssClass='e-custom-rating'></RatingComponent>
                                        </div>
                                        <div className='e-reviews-container'>
                                            ({props.ReviewCount} reviews)
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='e-row-template-separator'>
                                <div className='e-flex-layout'>
                                    <div className='e-info-flex-width-applier e-quote-styler'>
                                        {props.Description}
                                    </div>
                                    <div className='e-info-flex-width-applier'>
                                        <div>
                                            <span className='e-semi-header-text'>Room Name:</span> {props.RoomName} ({props.Capacity} person)
                                        </div>
                                        <div className='e-below-text-styler'>(Extra bed capacity: {props.ExtraBed} and per bed cost: ${props.ExtraBedCost})</div>
                                    </div>

                                </div>
                            </div>
                            <div className='e-row-template-separator'>
                                <div className='e-flex-layout'>
                                    <div className='e-info-flex-width-applier'>
                                        <span className='e-semi-header-text'>Amenities:</span>
                                        <ChipListComponent>
                                            <ChipsDirective>
                                                {hotelFacilityList.map((item, index) => (
                                                    <ChipDirective key={index} text={item}></ChipDirective>
                                                ))}
                                            </ChipsDirective>
                                        </ChipListComponent>
                                    </div>
                                    <div className='e-info-flex-width-applier'>
                                        <span className='e-semi-header-text'>Room Amenities:</span>
                                        <ChipListComponent>
                                            <ChipsDirective>
                                                {roomFacilityList.map((item, index) => (
                                                    <ChipDirective key={index} text={item}></ChipDirective>
                                                ))}
                                            </ChipsDirective>
                                        </ChipListComponent>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='e-data-line-separator'></div>
                    <div className='e-book-layout'>
                        <div className='e-extralist-price-info-container'>
                            <div className='e-extralist-container'>
                                <ChipListComponent>
                                    <ChipsDirective>
                                        {extrasList.map((item, index) => (
                                            <ChipDirective key={index} text={item}></ChipDirective>
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>
                            <div className='e-book-spacer'></div>
                            <div className='e-price-info'>
                                <div>
                                    <span className='e-cost-line-through-styler'>${props.Price.toFixed(2)}</span>
                                    <span className='e-cost-styler'>${priceCollection.TaxedPrice}</span>
                                </div>
                                <div>
                                    includes {props.DiscountPercentage}% discount (-${priceCollection.DiscountAmount}) and {props.TaxPercentage}% tax (+${priceCollection.TaxAmount})
                                </div>
                            </div>
                        </div>
                        <div className='e-book-spacer'></div>
                        <div className='e-book-button'>
                            <ButtonComponent cssClass='e-primary' onClick={bookDetails} disabled={!isRoomAvailable}>{!isRoomAvailable ? "Room's not available" : "Book Room"}</ButtonComponent>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    const gridEmptyRecordTemplate = () => {
        return (
            <div className='emptyRecordTemplate'>
                <img src="/images/emptyRecordTemplate.svg" className="e-emptyRecord" alt="No record" />
                <div>
                    There is no hotel available to display at the moment.
                </div>
            </div>
        );
    }

    const gridHeaderTemplate = (args) => {
        return (
            <div className='e-header-text'>{args.headerText}</div>
        );
    }

    const memoizedGridComponent = React.useMemo(() => {
        return (
            <GridComponent
                ref={g => gridRef = g}
                dataSource={hotelBookAppData}
                height={620}
                allowPaging={true}
                pageSettings={gridPageSettings}
                created={gridCreated}
                rowTemplate={gridRowTemplate}
                emptyRecordTemplate={gridEmptyRecordTemplate}
            >
                <ColumnsDirective>
                    <ColumnDirective headerText='Hotel Information' headerTextAlign='center' headerTemplate={gridHeaderTemplate} />
                </ColumnsDirective>
                <Inject services={[Page]} />
            </GridComponent>
        );
    }, [hotelBookAppData]);

    const memoizedDateRangePickerComponent = React.useMemo(() => {
        return (
            <DateRangePickerComponent ref={dr => drRef.current = dr} placeholder='Check-in date - Check-out date' min={startDate} startDate={startDate} endDate={endDate} change={dateRangeChange} />
        );
    }, []);

    const carouselItemTemplate = (props) => {
        return (<figure className="e-carousel-img-container"><img src={"/images/" + props.imageName + ".jpg"} alt={props.imageName} /></figure>);
    }
    const extraBedChange = (args) => {
        setBookDetailsPrice(selectedRoom);
    }

    const bookRoom = (args) => {
        if (formObject.current.validate()) {
            const dataIndex = localHotelData.current.findIndex(data => data.HotelID === selectedRoom.HotelID && data.RoomID === selectedRoom.RoomID);
            localHotelData.current[dataIndex].CheckInOut.push({ CheckIn: rangeStartDate, CheckOut: rangeEndDate });
            setShowHotels(true);
            toastRef.current.show();
        }
    }

    const menuButtonClick = (args) => {
        sidebarRef.current.style.display = 'block';
    }

    const sideBarCloseButtonClick = (args) => {
        sidebarRef.current.style.display = 'none';
    }

    return (
        <div>
            <div className='e-title-bar'>
                {showHotels && <div className='e-menu-button-container'><span className='e-menu-button' onClick={menuButtonClick}></span></div>}
                <div className='e-title-text-container'>
                    <span className='e-title-text'>Book My HoRoomtel</span>
                </div>
            </div>
            {showHotels ?
                <div className='e-main-container'>
                    <div ref={e => sidebarRef.current = e} className='e-side-bar'>
                        <div className='e-side-bar-operation-container'>
                            <div className='e-side-bar-separator e-side-bar-title'>
                                <div className='e-title-bar'>
                                    <span className='e-title-text'>Book My HoRoomtel</span>
                                </div>
                                <div>
                                    <span className='e-side-bar-close-button' onClick={sideBarCloseButtonClick}></span>
                                </div>
                            </div>
                            <div className='e-side-bar-separator'>
                                <div className='e-daterangepicker-container'>
                                    <div className='e-semi-header-text e-check-in-out-text'>Check-in date - Check-out date</div>
                                    <div>
                                        {memoizedDateRangePickerComponent}
                                    </div>
                                </div>
                            </div>
                            <div className='e-side-bar-separator'>
                                <div className='e-semi-header-text'>
                                    Price Range: $<span ref={e => minPriceRef.current = e}>{minPrice}</span> to $<span ref={e => maxPriceRef.current = e}>{maxPrice}</span>
                                </div>
                                <div className='e-slidercomponent-container'>
                                    <SliderComponent width={200} ref={p => priceRangeRef.current = p} type='Range' value={[minPrice, maxPrice]} min={minPrice} max={maxPrice} tooltip={sliderTooltip} changed={priceSliderChanged} />
                                </div>
                            </div>
                            <div className='e-line-separator'></div>
                            <div className='e-side-bar-treeview-separator'>
                                <TreeViewComponent ref={a => amenitiesRef.current = a} fields={amenitiesField} showCheckBox={true} nodeChecked={amenitiesNodeChecked} />
                            </div>
                            <div className='e-line-separator'></div>
                            <div className='e-side-bar-treeview-separator'>
                                <TreeViewComponent ref={r => roomAmenitiesRef.current = r} fields={roomAmenitiesField} showCheckBox={true} nodeChecked={amenitiesNodeChecked} />
                            </div>
                        </div>
                    </div>
                    <div className='e-app-container'>
                        <div className='e-operation-container'>
                            <div className='e-dd-container'>
                                <DropDownListComponent ref={dd => sortDDRef.current = dd} width="auto" dataSource={ddData} fields={ddFields} value={1} change={sortDDChange} />
                            </div>
                        </div>
                        <div className='e-grid-container'>
                            {memoizedGridComponent}
                            <DialogComponent width='95%' height='95%' visible={showMapDialog} close={closeShowMapDialog} isModal={true} target='.e-grid' header="Location" showCloseIcon={true}>
                                <div className="dialogContent">
                                    <MapsComponent ref={m => mapRef.current = m}>
                                        <Inject services={[Marker, MapsTooltip]} />
                                        <LayersDirective>
                                            <LayerDirective shapeData={USA} shapeSettings={{ fill: '#5cd65c' }}>
                                                <MarkersDirective>
                                                    <MarkerDirective visible={true}
                                                        height={20}
                                                        width={20}
                                                        animationDuration={0}
                                                        dataSource={mapDataSource}
                                                        tooltipSettings={{
                                                            visible: true,
                                                            valuePath: 'TooltipContent'
                                                        }}>
                                                    </MarkerDirective>
                                                </MarkersDirective>
                                            </LayerDirective>
                                        </LayersDirective>
                                    </MapsComponent>
                                </div>
                            </DialogComponent>
                        </div>
                    </div>
                </div>
                :
                <div className='e-details-container'>
                    <div ref={e => carouselContainerRef.current = e} className='e-flex-layout e-back-button-carousel-container'>
                        <div className='e-back-button-container'>
                            <span className='e-back-button' onClick={backToHotels}></span>
                        </div>
                        <div className='e-carouselcomponent-container'>
                            <CarouselComponent ref={c => carouselRef.current = c} selectedIndex={0} dataSource={carouselDataSource} itemTemplate={carouselItemTemplate}></CarouselComponent>
                        </div>
                    </div>
                    <div className='e-details-info-container'>
                        <div className='e-booking-details-container'>
                            <div className='e-header-text e-light-blue-border-bottom'>Booking Details</div>
                            <form id="form1" method="post">
                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Personal information</div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent ref={f => firstNameRef.current = f} width='75%' placeholder="First name *" name='firstname' floatLabelType="Always" type="text" data-msg-containerid="errorForFirstName" />
                                            <div id="errorForFirstName" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent width='75%' placeholder="Last name *" name='lastname' floatLabelType="Always" type="text" data-msg-containerid="errorForLastName" />
                                            <div id="errorForLastName" />
                                        </div>
                                    </div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent width='75%' placeholder="Email *" name='email' floatLabelType="Always" type='email' data-msg-containerid="errorForEmail" />
                                            <div id="errorForEmail" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <MaskedTextBoxComponent width='75%' mask="(999) 999-9999" placeholder="Phone number *" name='phno' floatLabelType='Always' />
                                            <label className='e-error' htmlFor='phno' />
                                        </div>
                                    </div>
                                </div>

                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Current address</div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent width='75%' placeholder="Address *" name='address' floatLabelType="Always" type="text" data-msg-containerid="errorForAddress" />
                                            <div id="errorForAddress" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent width='75%' placeholder="City *" name='city' floatLabelType="Always" type="text" data-msg-containerid="errorForCity" />
                                            <div id="errorForCity" />
                                        </div>
                                    </div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent width='75%' placeholder="Zip/Post code *" name='code' floatLabelType="Always" type="number" data-msg-containerid="errorForCode" />
                                            <div id="errorForCode" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <DropDownListComponent width='75%' placeholder='Country/Region *' name='country' floatLabelType="Always" dataSource={['USA']} value="USA" data-msg-containerid="errorForCountry" />
                                            <div id="errorForCountry" />
                                        </div>
                                    </div>
                                </div>

                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Upload ID proof (optional)</div>
                                    <div className='e-booking-details-separator'>
                                        <UploaderComponent />
                                    </div>
                                </div>

                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Room details</div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <NumericTextBoxComponent width='75%' placeholder={'No of person (capacity: ' + selectedRoom.Capacity + ')'} floatLabelType='Always' value={1} min={1} max={selectedRoom.Capacity} />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <NumericTextBoxComponent ref={e => extraBedRef.current = e} width='75%' placeholder={'No of extra bed (capacity: ' + selectedRoom.ExtraBed + ' and per bed cost: $' + selectedRoom.ExtraBedCost + ')'} floatLabelType='Always' value={0} min={0} max={selectedRoom.ExtraBed} change={extraBedChange} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className='e-data-line-separator'></div>
                            <div className='e-book-layout'>
                                <div className='e-book-spacer'></div>
                                <div className='e-price-info'>
                                    <div>
                                        <span className='e-cost-line-through-styler' ref={e => lineThroughPriceRef.current = e}></span>
                                        <span className='e-cost-styler' ref={e => taxedPriceRef.current = e}></span>
                                    </div>
                                    <div ref={e => priceStatementRef.current = e}></div>
                                </div>
                                <div className='e-book-button e-book-details-button'>
                                    <ButtonComponent cssClass='e-primary' onClick={bookRoom}>Book Room</ButtonComponent>
                                </div>
                            </div>

                        </div>
                        <div className='e-hotel-details-container'>
                            <div className='e-header-text e-light-blue-border-bottom'>Information</div>
                            <div className='e-hotel-details-side-bar-separator'><span className='e-semi-header-text'>Hotel Name: </span>{selectedRoom.HotelName}</div>
                            <div className='e-info-flex-items-center-applier e-hotel-details-side-bar-separator'><span className='e-semi-header-text'>Rating: </span><RatingComponent value={selectedRoom.Rating} readOnly={true}></RatingComponent></div>
                            <div className='e-hotel-details-side-bar-separator'><span className='e-semi-header-text'>Room Name: </span>{selectedRoom.RoomName}</div>
                            <div className='e-hotel-details-side-bar-separator'><span className='e-semi-header-text'>Capacity: </span>{selectedRoom.Capacity} person</div>
                            <div className='e-hotel-details-side-bar-separator'>
                                <span className='e-semi-header-text'>Amenities:</span>
                                <ChipListComponent>
                                    <ChipsDirective>
                                        {selectedRoom.HotelFacility.split(', ').map((item, index) => (
                                            <ChipDirective key={index} text={item}></ChipDirective>
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>
                            <div className='e-hotel-details-side-bar-separator'>
                                <span className='e-semi-header-text'>Room Amenities:</span>
                                <ChipListComponent>
                                    <ChipsDirective>
                                        {selectedRoom.RoomFacility.split(', ').map((item, index) => (
                                            <ChipDirective key={index} text={item}></ChipDirective>
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ToastComponent ref={t => toastRef.current = t} content="Hotel room booked successfully!" position={{ X: 'Center', Y: "Top" }} />
        </div>
    );
}
export default HotelBookApp;