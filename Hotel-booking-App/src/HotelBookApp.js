import * as React from 'react';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Inject,
    Page, Print
} from '@syncfusion/ej2-react-grids';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { ButtonComponent, ChipListComponent, ChipsDirective, ChipDirective } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { NumericTextBoxComponent, TextBoxComponent, RatingComponent, SliderComponent, UploaderComponent, MaskedTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { FormValidator } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TreeViewComponent, CarouselComponent } from '@syncfusion/ej2-react-navigations';

import { MapsComponent, LayersDirective, LayerDirective, MarkersDirective, MarkerDirective, Marker, MapsTooltip, DataLabel } from '@syncfusion/ej2-react-maps';
import * as USA from './usa.json';

import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { data } from './DataCreation';
import './HotelBookApp.css';

function HotelBookApp() {
    // Hotel grid which render the hotel list using grid component
    let hotelGrid;
    let filterDataPredicate;
    const hotelData = React.useRef(data);
    const [showHotels, setShowHotels] = React.useState(true);
    const [hotelGridData, setHotelGridData] = React.useState([]);

    // Menu ref property for opening and closing the menu when clicking menu button
    let menu = React.useRef(null);

    // Check in and check out information for rendering the hotel list according to user specified date
    let checkInOutDate = React.useRef(null);
    let defaultCheckInDate = new Date();
    defaultCheckInDate = new Date(
        defaultCheckInDate.getFullYear(),
        defaultCheckInDate.getMonth(),
        defaultCheckInDate.getDate()
    );
    const defaultCheckOutDate = new Date(defaultCheckInDate);
    defaultCheckOutDate.setDate(defaultCheckInDate.getDate() + 2);
    const checkInDate = React.useRef(defaultCheckInDate);
    const checkOutDate = React.useRef(defaultCheckOutDate);

    // Price range information for rendering the hotel list according to user expecting price
    let priceRange = React.useRef(null);
    let minPriceText = React.useRef(null);
    let maxPriceText = React.useRef(null);
    const defaultMinPrice = 50;
    const defaultMaxPrice = 1000;

    // Map information for hotel location
    let map = React.useRef(null);
    const [showMapDialog, setShowMapDialog] = React.useState(false);
    const [mapDataSource, setMapDataSource] = React.useState([]);

    // Sorting the hotels according to user specific choice
    let sortOptionContainer = React.useRef(null);
    const sortOption = [
        { key: 1, value: 'Top rating' },
        { key: 2, value: 'Price (low to high)' },
        { key: 3, value: 'Price (high to low)' },
    ];
    let sortOptionValue = React.useRef(1);

    // Hotel amenities infromation for rendering the hotel list according to user requirement that present in the hotel
    let hotelAmenities = React.useRef(null);
    let hotelAmenitiesData = [
        { id: 1001, name: 'Amenities', hasChild: true, expanded: true, fieldValue: 'HotelFacility' },
        { id: 1002, pid: 1001, name: 'Parking' },
        { id: 1003, pid: 1001, name: 'Pet allowed' },
        { id: 1004, pid: 1001, name: 'Swiming pool' },
        { id: 1005, pid: 1001, name: 'Restaurant' },
        { id: 1006, pid: 1001, name: 'Spa' },
    ];
    const hotelAmenitiesField = { dataSource: hotelAmenitiesData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };

    // Room amenities infromation for rendering the hotel list according to user requirement that present in the room
    let roomAmenities = React.useRef(null);
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
    const roomAmenitiesField = { dataSource: roomAmenitiesData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };

    // Hotel images for user booking room
    let backgroundBlurImage = React.useRef(null);
    const [hotelImages, setHotelImages] = React.useState([]);

    // Obtaining user information via input field with validator while booking room in hotel
    const [selectedRoom, setSelectedRoom] = React.useState({});
    let formValidator = React.useRef(null);
    let firstName = React.useRef(null);
    let lastName = React.useRef(null);
    let email = React.useRef(null);
    let phno = React.useRef(null);
    let address = React.useRef(null);
    let city = React.useRef(null);
    let code = React.useRef(null);
    let country = React.useRef(null);
    let person = React.useRef(null);
    let extraBed = React.useRef(null);
    let lineThroughPriceText = React.useRef(null);
    let taxedPriceText = React.useRef(null);
    let priceStatementText = React.useRef(null);
    let priceCollectionData = React.useRef({});

    // Printing the booked room infromation
    let printInfo = React.useRef({});
    let personalInfoGrid = React.useRef(null);
    let hotelInfoGrid = React.useRef(null);
    const [showPrintInfo, setShowPrintInfo] = React.useState(false);

    // This method calls for checking the selected sorting option for generating hotel list
    const checkSortOptions = (query) => {
        const value = sortOptionContainer.current.value;
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

    // This method calls for checking the selected hotel and room amenities options for generating hotel list
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

    // This method calls for checking both user expecting price and amenities for generating hotel list
    const checkPriceRangeAndAmenities = (query) => {
        const value = priceRange.current.value;
        filterDataPredicate = new Predicate('Price', 'greaterthanorequal', value[0]);
        filterDataPredicate = filterDataPredicate.and('Price', 'lessthanorequal', value[1]);
        checkAmenities(hotelAmenities.current);
        checkAmenities(roomAmenities.current);
        query.where(filterDataPredicate);
    }

    // This method will generate and assign data for hotel grid
    const generateHotelData = () => {
        // Generating query here
        let query = new Query();
        checkPriceRangeAndAmenities(query);
        checkSortOptions(query);

        // Generating data according to query
        new DataManager(hotelData.current).executeQuery(query).then((e) => {
            // Assigning data to hotel grid
            setHotelGridData(e.result);
        });
    }

    // This method calls for generating hotel list when hotel grid is created
    const hotelGridCreated = () => {
        generateHotelData();
    }

    // This method calls for generating hotel list when sort options is changed
    const sortOptionsChange = (args) => {
        sortOptionValue.current = args.value;
        generateHotelData();
    }

    // This method calls for generating hotel list when check in and check out date is changed
    const checkInOutDateChange = (args) => {
        if (args.startDate && args.endDate) {
            checkInDate.current = args.startDate;
            checkOutDate.current = args.endDate;
            generateHotelData();
        }
    }

    // This method calls for generating hotel list when price range is changed
    const priceRangeChanged = (args) => {
        minPriceText.current.innerText = args.value[0];
        maxPriceText.current.innerText = args.value[1];
        generateHotelData();
    }

    // This method calls for generating hotel list when amenities is changed 
    const amenitiesNodeChecked = (args) => {
        generateHotelData();
    }

    // This method calls for showing hotel location in map
    const showMap = (args) => {
        const rowIndex = closest(args.target, 'tr').rowIndex;
        const rowObject = hotelGrid.currentViewData[rowIndex];
        setMapDataSource([rowObject.Location]);
        const mapInst = map.current;
        setTimeout(() => {
            mapInst.refresh();
        }, 10);
        setShowMapDialog(true);
    }

    // This method calls for closing the map
    const closeMap = () => {
        setShowMapDialog(false);
    }

    // This method calls for validating the input field in a custom way
    const customValidation = (args) => {
        const argsLength = args.element.ej2_instances[0].value.length;
        return argsLength >= 10;
    };

    // This method calls for validating the first and last name input field in a custom way
    const nameValidation = (args) => {
        // Regex to allow only letters and spaces
        if (/^[A-Za-z\s]*$/.test(args.value)) {
            return true;
        }
        return false;
    };

    // This method calls for validating the proof input field in a custom way
    const proofValidation = (args) => {
        return args.element.ej2_instances[0].filesData.length ? true : false;
    };

    // This method calls for rendering the room price with discount and tax
    const renderRoomPrice = (selectedRoom) => {
        const price = selectedRoom.Price + (extraBed.current.value * selectedRoom.ExtraBedCost);
        const priceCollection = calculatePrice(price, selectedRoom.DiscountPercentage, selectedRoom.TaxPercentage);
        priceCollectionData.current = priceCollection;
        lineThroughPriceText.current.innerText = '$' + price.toFixed(2);
        taxedPriceText.current.innerText = '$' + priceCollection.TaxedPrice;
        priceStatementText.current.innerHTML = 'includes ' + selectedRoom.DiscountPercentage + '% discount (<span class="e-discount-style">-$' + priceCollection.DiscountAmount + '</span>) and ' + selectedRoom.TaxPercentage + '% tax (<span class="e-tax-style">+$' + priceCollection.TaxAmount + '</span>)';
    }

    // This method calls for navigate the user to booking page and rendering the input field with form validator
    const goToRoomBookingPage = (args) => {
        const rowIndex = closest(args.target, 'tr').rowIndex;
        const rowObject = hotelGrid.currentViewData[rowIndex];
        setSelectedRoom(rowObject);
        setHotelImages([
            { ID: 1, Name: rowObject.HotelImgID, imageName: rowObject.HotelImgID },
            { ID: 2, Name: rowObject.RoomImgID, imageName: rowObject.RoomImgID }
        ]);
        setShowHotels(false);
        setTimeout(() => {
            const options = {
                rules: {
                    firstname: {
                        required: [nameValidation, '* Please enter your first name (only letters accept)'],
                        minLength: 3
                    },
                    lastname: {
                        required: [nameValidation, '* Please enter your last name (only letters accept)'],
                        minLength: 3
                    },
                    email: {
                        required: [true, '* Please enter your email'],
                    },
                    phno: {
                        numberValue: [customValidation, '* Please enter your phone number'],
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
                    proof: {
                        required: [proofValidation, '* Submit your proof'],
                    },
                },
            };
            formValidator.current = new FormValidator('#form1', options);
            renderRoomPrice(rowObject);
        }, 10);
    }

    // This method calls for revisting the hotel list page
    const backToHotels = () => {
        checkInDate.current = defaultCheckInDate;
        checkOutDate.current = defaultCheckOutDate;
        setShowHotels(true);
    }

    const getDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    // This method calls for checking the room whether it is available or not for the user choosed check in and check out date
    const checkRoomAvailable = (checkInOut) => {
        let isRoomAvailable = true;
        const startDate = getDate(checkInDate.current);
        const endDate = getDate(checkOutDate.current);
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

    // This method calculate and return the price with discount and tax
    const calculatePrice = (price, discount, tax) => {
        const discountAmount = price * (discount * 0.01);
        const discountedPrice = price - discountAmount;
        const taxAmount = discountedPrice * (tax * 0.01);
        const taxedPrice = discountedPrice + taxAmount;
        return { OriginalCost: price.toFixed(2), DiscountAmount: discountAmount.toFixed(2), DiscountedPrice: discountedPrice.toFixed(2), TaxAmount: taxAmount.toFixed(2), TaxedPrice: taxedPrice.toFixed(2) };
    }

    // This method calls for rendering hotel grid row in a custom way using rowTemplate feature
    const renderHotelGridRow = (props) => {
        const src = '/images/' + props.RoomImgID + '.jpg';
        const hotelFacilityList = props.HotelFacility.split(', ');
        const roomFacilityList = props.RoomFacility.split(', ');
        const extrasList = props.Extras.split(', ');
        const isRoomAvailable = checkRoomAvailable(props.CheckInOut);
        const priceCollection = calculatePrice(props.Price, props.DiscountPercentage, props.TaxPercentage);
        return (
            <tr className='templateRow primary-text-style'>
                <td className='e-rowtemplate-border-applier'>
                    {!isRoomAvailable && <div className='e-room-not-available-cover'></div>}
                    <div className='e-flex-layout e-img-info-container'>
                        <div className='e-img-container'>
                            <img src={src} alt={props.RoomImgID} className='e-img' />
                        </div>
                        <div className='e-info-container'>
                            <div className='e-row-template-separator'>
                                <div className='e-flex-layout'>
                                    <div className='e-info-flex-width-applier'>
                                        <div>
                                            <span className='e-semi-bold-header-text'>{props.HotelName}</span>
                                        </div>
                                        <div className='normal-text-color'>
                                            <span className='e-address-text-styler'>{props.Address}</span>
                                            <span className='e-map-text-spacer'><span className='e-map-text-styler e-semi-title-header-text' onClick={showMap}><img src="./images/map.png" className="e-map-img" alt="Map" title='Show on map' /></span></span>
                                        </div>
                                    </div>
                                    <div className='e-info-flex-width-applier'>
                                        <div>
                                            <span className='e-semi-title-header-text'>Rating:</span>
                                        </div>
                                        <div className='e-flex-layout e-rating-reviews-container'>
                                            <div>
                                                <RatingComponent value={props.Rating} readOnly={true} cssClass='e-custom-rating e-custom-rating-color'></RatingComponent>
                                            </div>
                                            <div className='e-reviews-container normal-text-color'>
                                                ({props.ReviewCount} reviews)
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='e-row-template-separator'>
                                <div className='e-flex-layout'>
                                    <div className='e-info-flex-width-applier normal-text-color'>
                                        {props.Description}
                                    </div>
                                    <div className='e-info-flex-width-applier'>
                                        <div>
                                            <span className='e-semi-title-header-text'>Room Name:</span> <span className='e-semi-bold-title-header-text'>{props.RoomName}</span><span className='normal-text-color'> ({props.Capacity} person)</span>
                                        </div>
                                        <div className='e-semi-title-header-text normal-hint-text-color'>(Extra bed capacity: {props.ExtraBed} and per bed cost: ${props.ExtraBedCost})</div>
                                    </div>

                                </div>
                            </div>
                            <div className='e-row-template-separator'>
                                <div className='e-flex-layout'>
                                    <div className='e-info-flex-width-applier'>
                                        <span className='e-semi-title-header-text'>Amenities:</span>
                                        <ChipListComponent cssClass='e-outline'>
                                            <ChipsDirective>
                                                {hotelFacilityList.map((item, index) => (
                                                    <ChipDirective key={index} text={item} cssClass="e-info"></ChipDirective>
                                                ))}
                                            </ChipsDirective>
                                        </ChipListComponent>
                                    </div>
                                    <div className='e-info-flex-width-applier'>
                                        <span className='e-semi-title-header-text'>Room Amenities:</span>
                                        <ChipListComponent cssClass='e-outline'>
                                            <ChipsDirective>
                                                {roomFacilityList.map((item, index) => (
                                                    <ChipDirective key={index} text={item} cssClass="e-info"></ChipDirective>
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
                                <ChipListComponent cssClass='e-outline'>
                                    <ChipsDirective>
                                        {extrasList.map((item, index) => (
                                            <ChipDirective key={index} text={item} cssClass="e-success"></ChipDirective>
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>
                            <div className='e-book-spacer'></div>
                            <div className='e-price-info'>
                                <div>
                                    <span className='e-cost-line-through-styler normal-hint-text-color'>${props.Price.toFixed(2)}</span>
                                    <span className='e-cost-styler'>${priceCollection.TaxedPrice}</span>
                                </div>
                                <div className='normal-text-color e-semi-title-header-text'>
                                    includes {props.DiscountPercentage}% discount (<span className='e-discount-style'>-${priceCollection.DiscountAmount}</span>) and {props.TaxPercentage}% tax (<span className='e-tax-style'>+${priceCollection.TaxAmount}</span>)
                                </div>
                            </div>
                        </div>
                        <div className='e-book-spacer'></div>
                        <div className='e-book-button'>
                            <ButtonComponent cssClass='e-primary e-outline' onClick={goToRoomBookingPage} disabled={!isRoomAvailable}>{!isRoomAvailable ? "Room's not available" : "Book Room"}</ButtonComponent>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    // This method calls for rendering the empty record template in the hotel grid when there is no hotel is available according to user specification
    const renderHotelGridEmptyRecordRow = () => {
        return (
            <div className='emptyRecordTemplate'>
                <img src="/images/emptyRecordTemplate.svg" className="e-emptyRecord" alt="No record" />
                <div>
                    There is no hotel available to display at the moment.
                </div>
            </div>
        );
    }

    // This method calls for rendering the hotel grid header in custom way using headerTemplate feature
    const renderHotelGridHeader = (args) => {
        return (
            <div className='primary-text-style'>
                <div className='e-header-text'>{args.headerText}</div>
                <div className='e-operation-container'>
                    <DropDownListComponent ref={dd => sortOptionContainer.current = dd} width={160} dataSource={sortOption} fields={{ text: 'value', value: 'key' }} value={sortOptionValue.current} change={sortOptionsChange} />
                </div>
            </div>
        );
    }

    // Memoized the hotel grid to prevent unnecessary rerenders
    const memoizedHotelGrid = React.useMemo(() => {
        return (
            <GridComponent
                ref={g => hotelGrid = g}
                dataSource={hotelGridData}
                height={'100%'}
                allowPaging={true}
                created={hotelGridCreated}
                rowTemplate={renderHotelGridRow}
                emptyRecordTemplate={renderHotelGridEmptyRecordRow}
            >
                <ColumnsDirective>
                    <ColumnDirective headerText='Hotel Information' headerTextAlign='center' headerTemplate={renderHotelGridHeader} />
                </ColumnsDirective>
                <Inject services={[Page]} />
            </GridComponent>
        );
    }, [hotelGridData]);

    const renderDayCell = (args) => {
        if (!isNullOrUndefined(args.isOutOfRange) && !args.isOutOfRange) {
            const bookedDate = [];
            hotelGridData.map((data) => {
                data.CheckInOut.map((date) => {
                    bookedDate.push(date);
                });
            });
            const roomBooked = bookedDate.find(({ CheckIn, CheckOut }) => {
                CheckIn.setHours(0, 0, 0, 0);
                CheckOut.setHours(0, 0, 0, 0);
                if (args.date >= CheckIn && args.date <= CheckOut) {
                    return true;
                }
                return false;
            });
            if (roomBooked) {
                args.element.classList.add('e-date-cell-orange');
            } else {
                args.element.classList.add('e-date-cell-green');
            }
        }
    }

    // Memoized the check in, check out data picker to prevent unnecessary rerenders
    const memoizedCheckInOutDate = React.useMemo(() => {
        return (
            <DateRangePickerComponent ref={dr => checkInOutDate.current = dr} min={defaultCheckInDate} startDate={defaultCheckInDate} endDate={defaultCheckOutDate} change={checkInOutDateChange}
                renderDayCell={renderDayCell}
            />
        );
    }, [hotelGridData]);

    // This method calls for rendering the hotel images in a custom way in carousel using itemTemplate feature
    const hotelImagesItemTemplate = (props) => {
        return (<figure className="e-carousel-img-container"><img src={"/images/" + props.imageName + ".jpg"} alt={props.imageName} /></figure>);
    }

    // This method calls for rendering the room price when extra bed value change
    const extraBedChange = (args) => {
        renderRoomPrice(selectedRoom);
    }

    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // The method calls for storing the user entered infromation for booking the room and display the receipt dialog to user
    const bookRoom = (args) => {
        if (formValidator.current.validate()) {
            const dataIndex = hotelData.current.findIndex(data => data.HotelID === selectedRoom.HotelID && data.RoomID === selectedRoom.RoomID);
            hotelData.current[dataIndex].CheckInOut.push({ CheckIn: checkInDate.current, CheckOut: checkOutDate.current });
            checkInDate.current = defaultCheckInDate;
            checkOutDate.current = defaultCheckOutDate;
            setShowHotels(true);
            printInfo.current = {
                FirstName: firstName.current.value,
                LastName: lastName.current.value,
                Email: email.current.value,
                Phno: phno.current.value,
                Address: address.current.value,
                City: city.current.value,
                Code: code.current.value,
                Country: country.current.value,
                Person: person.current.value,
                ExtraBed: extraBed.current.value,
                HotelData: hotelData.current[dataIndex],
                PriceCollection: priceCollectionData.current,
                FinalPrice: parseFloat(priceCollectionData.current.TaxedPrice),
                ReceiptID: getRandomNumber(1111111, 100000000),
                BookedDate: new Date(),
                CheckIn: checkInDate.current,
                CheckOut: checkOutDate.current,
            };
            setShowPrintInfo(true);
        }
    }

    // This method calls for opening the menu
    const menuClick = (args) => {
        menu.current.style.display = 'block';
        setTimeout(() => {
            priceRange.current.refresh();
        }, 10);
    }

    // This method calls for closing the menu
    const menuCloseClick = (args) => {
        menu.current.style.display = 'none';
    }

    // This method calls for closing the print information dialog
    const closePrintInfo = (args) => {
        setShowPrintInfo(false);
    }

    // This method calls for printing the receipt using print method of grid 
    const printInformation = (args) => {
        personalInfoGrid.current.print();
    }

    // This method calls for printing the receipt in a custom way
    const beforePrint = (args) => {

        args.cancel = true;

        // formating the booked date
        const bookedDate = printInfo.current.BookedDate;
        const formattedDate = bookedDate.toLocaleDateString();
        const formattedTime = bookedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const formattedDateTime = formattedDate + " " + formattedTime;

        // Creating the print window
        let printWindow = window.open(
            "",
            "_blank",
            "width=" + window.outerWidth + ",height=" + window.outerHeight
        );

        if (printWindow) {
            // Customizing the receipt
            printWindow.document.write("<body>");

            printWindow.document.write("<div style='text-align: center; margin-top: 20px;'>");
            printWindow.document.write("<h1>Hotel Receipt</h1>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='text-align: center; margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 24px;font-weight: 800;'>" + printInfo.current.HotelData.HotelName + "</div>");
            printWindow.document.write("<div style='font-size: 20px;'>" + printInfo.current.HotelData.Address + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write('<div style="width: 100%; padding-top: 20px; text-align: center;">' + '******************************' + '</div>');

            printWindow.document.write("<div style='display: flex; text-align: center;'>");

            printWindow.document.write("<div style='width: 50%'>");

            printWindow.document.write("<div style='margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 20px; font-weight: 600;'>Check In</div>");
            printWindow.document.write("<div style='font-size: 24px;'>" + printInfo.current.CheckIn.toLocaleDateString() + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 20px; font-weight: 600;'>Recipient name</div>");
            printWindow.document.write("<div style='font-size: 24px;'>" + printInfo.current.FirstName + " " + printInfo.current.LastName + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 20px; font-weight: 600;'>Room name</div>");
            printWindow.document.write("<div style='font-size: 24px;'>" + printInfo.current.HotelData.RoomName + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write("</div>");

            printWindow.document.write("<div style='width: 50%'>");

            printWindow.document.write("<div style='margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 20px; font-weight: 600;'>Check Out</div>");
            printWindow.document.write("<div style='font-size: 24px;'>" + printInfo.current.CheckOut.toLocaleDateString() + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 20px; font-weight: 600;'>Booking ID</div>");
            printWindow.document.write("<div style='font-size: 24px;'>" + printInfo.current.ReceiptID.toString() + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='margin-top: 20px;'>");
            printWindow.document.write("<div style='font-size: 20px; font-weight: 600;'>Booked date</div>");
            printWindow.document.write("<div style='font-size: 24px;'>" + formattedDateTime + "</div>");
            printWindow.document.write("</div>");

            printWindow.document.write("</div>");

            printWindow.document.write("</div>");

            printWindow.document.write('<div style="width: 100%; padding-top: 20px; text-align: center;">' + '******************************' + '</div>');

            printWindow.document.write("<table style='width: 100%; margin-top: 30px;'>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 24px; font-weight: 800; padding: 10px; text-align: center;'>");
            printWindow.document.write("Description");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 24px; font-weight: 800; padding: 10px; text-align: center;'>");
            printWindow.document.write("Price");
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("Room cost");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("+$" + printInfo.current.HotelData.Price);
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("Extra bed cost ( " + printInfo.current.HotelData.ExtraBedCost + " * " + printInfo.current.ExtraBed + " )");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("+$" + (printInfo.current.HotelData.ExtraBedCost * printInfo.current.ExtraBed));
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("Discount " + printInfo.current.HotelData.DiscountPercentage + "%");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("-$" + printInfo.current.PriceCollection.DiscountAmount);
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("Tax " + printInfo.current.HotelData.TaxPercentage + "%");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("+$" + printInfo.current.PriceCollection.TaxAmount);
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("------------------------------------");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 24px; padding: 10px; text-align: center;'>");
            printWindow.document.write("-------------------------");
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("<tr>");
            printWindow.document.write("<td style='font-size: 22px; font-weight: 800; padding: 10px; text-align: center;'>");
            printWindow.document.write("Final price");
            printWindow.document.write("</td>");
            printWindow.document.write("<td style='font-size: 22px; font-weight: 800; padding: 10px; text-align: center;'>");
            printWindow.document.write("$" + printInfo.current.PriceCollection.TaxedPrice);
            printWindow.document.write("</td>");
            printWindow.document.write("</tr>");

            printWindow.document.write("</table>");

            printWindow.document.write('<div style="width: 100%; padding-top: 20px; text-align: center;">' + '******************************' + '</div>');

            printWindow.document.write("<div style='font-size: 24px; font-weight: 800; padding: 10px; text-align: center;'>Thank you for booking the hotel from Room!</div>");

            printWindow.document.write("<div style='margin-top: 30px;'>");
            printWindow.document.write("<div><span style='font-size: 20px; font-weight: 600;'>Room amenities: </span><span style='font-size: 20px;'>" + printInfo.current.HotelData.RoomFacility + ".</span></div>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='margin-top: 30px;'>");
            printWindow.document.write("<div><span style='font-size: 20px; font-weight: 600;'>Hotel amenities: </span><span style='font-size: 20px;'>" + printInfo.current.HotelData.HotelFacility + ".</span></div>");
            printWindow.document.write("</div>");

            printWindow.document.write("<div style='margin-top: 30px;'>");
            printWindow.document.write("<div><span style='font-size: 20px; font-weight: 600;'>Hotel policy: </span><span style='font-size: 20px;'>" + printInfo.current.HotelData.Extras + ".</span></div>");
            printWindow.document.write("</div>");

            printWindow.document.write("</body>");

            printWindow.document.close();

            // Printing the receipt
            printWindow.print();

            if ("onafterprint" in printWindow) {
                printWindow.onafterprint = function () {
                    printWindow.close();
                };
            }

        } else {
            console.error("Print window could not be opened.");
        }
    }

    const onSlideChanging = (args) => {
        backgroundBlurImage.current.src = "/images/" + hotelImages[args.nextIndex].imageName + ".jpg";
        backgroundBlurImage.current.alt = hotelImages[args.nextIndex].imageName;
    }

    return (
        <div className='e-hotel-book'>
            <div className='e-title-bar'>
                {showHotels && <div className='e-menu-button-container'><span className='e-menu-button' onClick={menuClick}></span></div>}
                <div className='e-title-text-container'>
                    <span className='e-title-text'>
                        <span className='e-title-text-book'>Book</span>
                        <span className='e-title-text-my'> My</span>
                        <span className='e-title-text-room'>Room</span>
                    </span>
                </div>
            </div>
            {showHotels ?
                <div className='e-main-container'>
                    <div ref={e => menu.current = e} className='e-side-bar'>
                        <div className='e-side-bar-operation-container'>
                            <div className='e-side-bar-separator e-side-bar-title'>
                                <div className='e-title-bar'>
                                    <span className='e-title-text'>
                                        <span className='e-title-text-book'>Book</span>
                                        <span className='e-title-text-my'> My</span>
                                        <span className='e-title-text-room'>Room</span>
                                    </span>
                                </div>
                                <div>
                                    <span className='e-side-bar-close-button' onClick={menuCloseClick}></span>
                                </div>
                            </div>
                            <div className='e-side-bar-separator'>
                                <div className='e-daterangepicker-container'>
                                    <div className='e-semi-header-text e-check-in-out-text'>Check-in date - Check-out date</div>
                                    <div>
                                        {memoizedCheckInOutDate}
                                    </div>
                                </div>
                            </div>
                            <div className='e-side-bar-separator'>
                                <div className='e-semi-header-text'>
                                    Price Range: $<span ref={e => minPriceText.current = e}>{defaultMinPrice}</span> to $<span ref={e => maxPriceText.current = e}>{defaultMaxPrice}</span>
                                </div>
                                <div className='e-slidercomponent-container'>
                                    <SliderComponent ref={p => priceRange.current = p} type='Range' value={[defaultMinPrice, defaultMaxPrice]} min={defaultMinPrice} max={defaultMaxPrice} tooltip={{ placement: 'After', isVisible: true, showOn: 'Focus' }} changed={priceRangeChanged} />
                                </div>
                            </div>
                            <div className='e-line-separator'></div>
                            <div className='e-side-bar-treeview-separator'>
                                <TreeViewComponent ref={a => hotelAmenities.current = a} fields={hotelAmenitiesField} showCheckBox={true} nodeChecked={amenitiesNodeChecked} />
                            </div>
                            <div className='e-line-separator'></div>
                            <div className='e-side-bar-treeview-separator'>
                                <TreeViewComponent ref={r => roomAmenities.current = r} fields={roomAmenitiesField} showCheckBox={true} nodeChecked={amenitiesNodeChecked} />
                            </div>
                        </div>
                    </div>
                    <div className='e-app-container'>
                        <div className='e-grid-container'>
                            {memoizedHotelGrid}
                            <DialogComponent width='95%' height='95%' visible={showMapDialog} close={closeMap} isModal={true} target='.e-grid' header="Location" showCloseIcon={true} cssClass='e-dialog-map'>
                                <div className="dialogContent">
                                    <MapsComponent ref={m => map.current = m} background='#ffffff' mapsArea={{ background: '#ffffff' }}>
                                        <Inject services={[Marker, MapsTooltip, DataLabel]} />
                                        <LayersDirective>
                                            <LayerDirective shapeData={USA} shapeSettings={{ fill: '#10b981' }} dataLabelSettings={{ visible: true, labelPath: 'iso_3166_2', smartLabelMode: 'Hide', textStyle: { color: 'black' } }}>
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
                    <div className='e-back-button-carousel-container e-carousel-image-holder-height'>
                        <div className='e-background-blur-image-container e-carousel-image-holder-height'>
                            <img ref={e => backgroundBlurImage.current = e} className='e-background-blur-image' src={"./images/" + hotelImages[0].imageName + ".jpg"} alt={hotelImages[0].imageName} />
                        </div>
                        <div className='e-back-button-container'>
                            <span className='e-back-button' onClick={backToHotels}></span>
                        </div>
                        <div className='e-carouselcomponent-container'>
                            <CarouselComponent selectedIndex={0} dataSource={hotelImages} itemTemplate={hotelImagesItemTemplate} slideChanging={onSlideChanging}></CarouselComponent>
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
                                            <TextBoxComponent ref={f => firstName.current = f} width='75%' placeholder="First name *" name='firstname' floatLabelType="Always" type="text" data-msg-containerid="errorForFirstName" />
                                            <div id="errorForFirstName" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent ref={l => lastName.current = l} width='75%' placeholder="Last name *" name='lastname' floatLabelType="Always" type="text" data-msg-containerid="errorForLastName" />
                                            <div id="errorForLastName" />
                                        </div>
                                    </div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent ref={e => email.current = e} width='75%' placeholder="Email *" name='email' floatLabelType="Always" type='email' data-msg-containerid="errorForEmail" />
                                            <div id="errorForEmail" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <MaskedTextBoxComponent ref={p => phno.current = p} width='75%' mask="(999) 999-9999" placeholder="Phone number *" name='phno' floatLabelType='Always' />
                                            <label className='e-error' htmlFor='phno' />
                                        </div>
                                    </div>
                                </div>

                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Current address</div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent ref={a => address.current = a} width='75%' placeholder="Address *" name='address' floatLabelType="Always" type="text" data-msg-containerid="errorForAddress" />
                                            <div id="errorForAddress" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent ref={c => city.current = c} width='75%' placeholder="City *" name='city' floatLabelType="Always" type="text" data-msg-containerid="errorForCity" />
                                            <div id="errorForCity" />
                                        </div>
                                    </div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <TextBoxComponent ref={c => code.current = c} width='75%' placeholder="Zip/Post code *" name='code' floatLabelType="Always" type="number" data-msg-containerid="errorForCode" />
                                            <div id="errorForCode" />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <DropDownListComponent ref={c => country.current = c} width='75%' placeholder='Country/Region *' name='country' floatLabelType="Always" dataSource={['USA']} value="USA" data-msg-containerid="errorForCountry" />
                                            <div id="errorForCountry" />
                                        </div>
                                    </div>
                                </div>

                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Upload ID proof *</div>
                                    <div className='e-booking-details-separator'>
                                        <UploaderComponent name='proof' data-msg-containerid="errorForProof" selected={(args) => {
                                            setTimeout(() => {
                                                formValidator.current.validate('proof');
                                            }, 0);
                                        }} />
                                        <div id="errorForProof" />
                                    </div>
                                </div>

                                <div className='e-booking-details-separator'>
                                    <div className='e-semi-header-text'>Room details</div>
                                    <div className='e-flex-layout e-booking-details-separator'>
                                        <div className='e-info-flex-width-applier'>
                                            <NumericTextBoxComponent ref={c => person.current = c} width='75%' placeholder={'No of person (capacity: ' + selectedRoom.Capacity + ')'} floatLabelType='Always' value={1} min={1} max={selectedRoom.Capacity} />
                                        </div>
                                        <div className='e-info-flex-width-applier'>
                                            <NumericTextBoxComponent ref={e => extraBed.current = e} width='75%' placeholder={'No of extra bed (capacity: ' + selectedRoom.ExtraBed + ' and per bed cost: $' + selectedRoom.ExtraBedCost + ')'} floatLabelType='Always' value={0} min={0} max={selectedRoom.ExtraBed} change={extraBedChange} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className='e-data-line-separator'></div>
                            <div className='e-book-layout'>
                                <div className='e-book-spacer'></div>
                                <div className='e-price-info'>
                                    <div>
                                        <span className='e-cost-line-through-styler normal-hint-text-color' ref={e => lineThroughPriceText.current = e}></span>
                                        <span className='e-cost-styler' ref={e => taxedPriceText.current = e}></span>
                                    </div>
                                    <div className='normal-text-color e-semi-title-header-text' ref={e => priceStatementText.current = e}></div>
                                </div>
                                <div className='e-book-button e-book-details-button'>
                                    <ButtonComponent cssClass='e-primary e-outline' onClick={bookRoom}>Book Room</ButtonComponent>
                                </div>
                            </div>

                        </div>
                        <div className='e-hotel-details-container'>
                            <div className='e-header-text e-light-blue-border-bottom'>Information</div>
                            <div className='e-hotel-details-side-bar-separator'><span className='e-semi-title-header-text'>Hotel Name: </span><span className='e-semi-bold-header-text'>{selectedRoom.HotelName}</span></div>
                            <div className='e-info-flex-items-center-applier e-hotel-details-side-bar-separator'><span className='e-semi-title-header-text'>Rating: </span><RatingComponent value={selectedRoom.Rating} readOnly={true} cssClass='e-custom-rating-color'></RatingComponent></div>
                            <div className='e-hotel-details-side-bar-separator'><span className='e-semi-title-header-text'>Room Name: </span><span className='e-semi-bold-title-header-text'>{selectedRoom.RoomName}</span></div>
                            <div className='e-hotel-details-side-bar-separator'><span className='e-semi-title-header-text'>Capacity: </span><span className='normal-text-color'>{selectedRoom.Capacity} person</span></div>
                            <div className='e-hotel-details-side-bar-separator'>
                                <span className='e-semi-title-header-text'>Amenities:</span>
                                <ChipListComponent cssClass='e-outline'>
                                    <ChipsDirective>
                                        {selectedRoom.HotelFacility.split(', ').map((item, index) => (
                                            <ChipDirective key={index} text={item} cssClass="e-info"></ChipDirective>
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>
                            <div className='e-hotel-details-side-bar-separator'>
                                <span className='e-semi-title-header-text'>Room Amenities:</span>
                                <ChipListComponent cssClass='e-outline'>
                                    <ChipsDirective>
                                        {selectedRoom.RoomFacility.split(', ').map((item, index) => (
                                            <ChipDirective key={index} text={item} cssClass="e-info"></ChipDirective>
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className='e-print-info' style={{ display: showPrintInfo ? 'block' : 'none' }}>
                <DialogComponent width='90%' height='75%' visible={showPrintInfo} close={closePrintInfo} isModal={true} target='.e-print-info' header='Hotel room booked successfully!' showCloseIcon={true}>
                    <div className="dialogContent">
                        {showPrintInfo && <div className='e-print-info-container'>
                            <div className='e-flex-layout'>
                                <div className='e-flex-spacer'></div>
                                <ButtonComponent cssClass='e-primary e-outline' onClick={printInformation}>Print</ButtonComponent>
                            </div>
                            <div className='e-header-text e-light-blue-border-bottom e-print-info-separator'>Personal Information</div>
                            <GridComponent ref={g => personalInfoGrid.current = g}
                                width={'100%'}
                                dataSource={[printInfo.current]}
                                allowTextWrap={true}
                                beforePrint={beforePrint}>
                                <ColumnsDirective>
                                    <ColumnDirective field='FirstName' headerText='First name' width={120} />
                                    <ColumnDirective field='LastName' headerText='Last name' width={120} />
                                    <ColumnDirective field='Email' headerText='Email' width={120} />
                                    <ColumnDirective field='Address' headerText='Address' width={120} />
                                    <ColumnDirective field='Country' headerText='Country' width={120} />
                                </ColumnsDirective>
                                <Inject services={[Print]} />
                            </GridComponent>
                            <div className='e-header-text e-light-blue-border-bottom e-print-info-separator'>Room Information</div>
                            <GridComponent ref={g => hotelInfoGrid.current = g} width={'100%'} dataSource={[printInfo.current]} allowTextWrap={true}>
                                <ColumnsDirective>
                                    <ColumnDirective field='HotelData.HotelName' headerText='Hotel name' width={120} customAttributes={{ class: 'e-grid-hotel-name' }} />
                                    <ColumnDirective field='HotelData.RoomName' headerText='Room name' width={120} customAttributes={{ class: 'e-grid-room-name' }} />
                                    <ColumnDirective field='CheckIn' headerText='Check In date' format={{ type: 'date', format: 'dd/MM/yyyy' }} width={120} customAttributes={{ class: 'e-grid-date' }} />
                                    <ColumnDirective field='CheckOut' headerText='Check Out date' format={{ type: 'date', format: 'dd/MM/yyyy' }} width={120} customAttributes={{ class: 'e-grid-date' }} />
                                    <ColumnDirective field='Person' headerText='No of person' width={120} />
                                    <ColumnDirective field='ExtraBed' headerText='No of extra bed' width={120} />
                                    <ColumnDirective field='FinalPrice' headerText='Price' type='number' format='C2' width={120} />
                                </ColumnsDirective>
                            </GridComponent>
                        </div>}
                    </div>
                </DialogComponent>
            </div>
        </div>
    );
}
export default HotelBookApp;