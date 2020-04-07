export default {
  loginPageState: {
    request: null,
    redirect: false,
    loading: false,
    error: null
  },
  resetPageState: {
    request: null,
    redirect: false,
    loading: false,
    error: null
  },
  logoutPageState: {
    redirect: false
  },
  recipientState: {
    dooklogo: "./logo-dook.png",

    order:
    {
      id: 1,
      cashOnDelivery: true,
      cashOnDeliveryAmount: 55,
      deliveryPoint: 'here',
      deliveryTime: 123
    }
    ,
    dispatcher:
    {
      shopName: 'name',
      phone: '321312312321'
    }
    ,
    recipient:
    {
      "firstName": "fdvfd",
      "lastName": "Ogir",
      "mobile": "078567546445",
      "deliveryPoint": "Unnamed Road, Koting, Jharkhand 835206, India",
      "gpsLocation": {
        "lat": 23.079731762449878,
        "lng": 84.298095703125
      },
      "id": "33"
    }
  },
  fleetOwnerState: {
    orderListViewMode: 'orders',
    pickUpPoints: [
      "address": "6964 Said Ibn Al Munther Street, Ar Rabwah, Riyadh 12824 4649, Саудовская Аравия",
      "gpsLocation": {
        "lat": 24.69681621927367,
        "lng": 46.77124097352129
      },
      "title": "my-warehouse",
      "id": "587735a5b752030f00ee3a06",
      "createdAt": "2017-01-12T07:52:05.819Z",
      "updatedAt": "2017-01-12T07:52:05.819Z",
      "dispatcherId": "587735a5b752030f00ee3a05"
    ],
    driversLocations: [
      {
        "id": "5767c9ccd6d52e01005611b9",
        "driverId": "575a9afd3159880100354fc2",
        "createdAt": "2016-06-20T14:07:11.870Z",
        "updatedAt": "2016-06-24T15:18:21.300Z",
        "lat": 53.9255553,
        "lng": 27.5122648
      },
      {
        "id": "57682dc69eef130100f6788d",
        "driverId": "575a9ba93159880100354fc4",
        "createdAt": "2016-06-20T17:54:14.233Z",
        "updatedAt": "2016-06-24T15:43:36.162Z",
        "lat": 24.8114141,
        "lng": 46.6471842
      },
      {
        "id": "576a886d8a443b0100873aab",
        "driverId": "575a9b2b3159880100354fc3",
        "createdAt": "2016-06-22T12:45:33.793Z",
        "updatedAt": "2016-06-24T15:30:07.483Z",
        "lat": 53.92540898540696,
        "lng": 27.51228377359982
      },
      {
        "id": "576bf99d3759590100280f7e",
        "driverId": "576a59d56ce96101004e1a1d",
        "createdAt": "2016-06-23T15:00:45.815Z",
        "updatedAt": "2016-06-24T13:33:54.516Z",
        "lat": 53.9254409,
        "lng": 27.5123328
      }
    ],
    account: {
      "id": "c1Rp3uBoQmbTGJLzRo4ByFG8nsoxWIE5k7JFgxy0djVRbbkDWQa5DZR9W1IoQNVo",
      "ttl": 1209600,
      "created": "2017-01-30T20:41:37.578Z",
      "userId": "57908cb0ca705a12009d62ea",
      "role": "fleetowner",
      "lastLogin": 1485808897590,
      "language": "en"
    },
    groupages: [
      {
        "groupageDescription": null,
        "expectedPickUpTime": {
          "startTime": 1485792000000,
          "endTime": 1485795600000
        },
        "groupageStatus": "pickedUp",
        "deliveryCommission": 100,
        "id": "588f7269500f080f006c384b",
        "createdAt": "2017-01-30T17:05:45.588Z",
        "updatedAt": "2017-01-30T17:20:23.006Z",
        "operatorId": "580fb036834e44f3493fb7f8",
        "driverId": "588f5681500f080f006c383f",
        "driverReward": -7.000000000000001,
        "companyProceeds": 107
      }
    ],
    orders: [
      {
        "deliveryTime": 1485799200000,
        "deliveryPoint": "3235 Prince Nasir Ibn Farhan Al Saud, Salah Ad Din, Riyadh 12435 8141, Saudi Arabia",
        "cashOnDeliveryAmount": null,
        "orderStatus": "waitingForReturn",
        "expectedPickUpTime": {
          "startTime": 1485792000000,
          "endTime": 1485795600000
        },
        "realPickUpTime": 1485796803528,
        "cashOnDelivery": false,
        "deliveryCommission": 100,
        "express": true,
        "id": "588f656d500f080f006c3848",
        "createdAt": "2017-01-30T16:10:21.970Z",
        "updatedAt": "2017-01-30T17:20:54.726Z",
        "recipientId": "588f656d500f080f006c3847",
        "groupageId": "588f7269500f080f006c384b",
        "dispatcherId": "57efd8e45bf9bd000fe2dcdb",
        "vehicleType": 2,
        "orderCreatedTime": 1485792621963,
        "driverReward": -7.000000000000001,
        "companyProceeds": 107,
        "items": [
          {
            "packingList": "Car",
            "itemStatus": "created",
            "metadata": "",
            "id": "574ee52f4c9780a10ecf444a",
            "orderId": "574ee3221167c8560e6e7a8f",
            "pickUpPointId": "574ea5e7b4bd7cd30b53c373"
          },
          {
            "packingList": "Car",
            "itemStatus": "created",
            "metadata": "",
            "id": "574ee52f4c9780a10ecf4i4a",
            "orderId": "574ee3221167c8560e6e7a8f",
            "pickUpPointId": "574ea5e7b4bd7cd30b53c376"
          }
        ]
      }
    ]
  },
  appState: {
    showHeadersInfo: true,
    driversCount: 0,
    nearestDrivers: [],
    cityForInfo: {},
    error: {},
    fortResponse: undefined,
    statistics: undefined,
    subscribed: false,
    teams: {

    },
    company: {

    },
    fleets: [],
    floatingPickUpPoint: {

    },
    loaded: true,
    driverListViewMode: 'drivers',
    orderListPageNumber: 0,
    groupageListPageNumber: 0,
    orderHistoryPageNumber: 0,
    createdPickUpPoint: {},
    countries: [

    ],
    countries: [

    ],
    users: [

    ],
    orders: [

    ],
    cards: [],
    orderForReturn: {},
    orderForUpdate: {},
    addedToTeam: '',
    removedFromTeam: '',
    pickUpPoints: {},
    groupages: [],
    recipients: [],
    dook_logo: "./dook-logo.png",
    driversLocations: [

    ],
    account: {
      "expressDeliveryCommission": 0
    },
    accountUpdated: 0,
    teamUpdated: {},
    teamCreated: {},
    userDeleted: 0,
    teamDeleted: 0,
    pickUpPointRemoved: 0,
    platforms: [
      {
        type: 'ios',
        icon: './ios-icon.png'
      },
      {
        type: 'android',
        icon: './android-icon.png'
      }
    ],
    flags: './flags.png',
    vehicles: [
      {
        type: 'motobike',
        size: 1,
        icon: './mot.png'
        // icon: 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/64/motorcycle.png'
        // icon: 'http://www.icon100.com/up/3938/64/46-Black-motorbike-silhouette.png'
      },
      {
        type: 'sedan',
        size: 2,
        icon: './sed.png'
        //icon: 'http://icons.iconarchive.com/icons/icons8/android/64/Transport-Sedan-icon.png'
      },
      {
        type: 'suv',
        size: 3,
        icon: './suv.png'
        //icon: 'http://icons.iconarchive.com/icons/icons8/android/64/Transport-Suv-icon.png'
      },
      {
        type: 'pickup',
        size: 4,
        icon: './pic.png'
        //icon: 'http://icons.iconarchive.com/icons/icons8/windows-8/64/Transport-Pickup-icon.png'
      },
      {
        type: 'van',
        size: 5,
        icon: './van.png'
        //icon: 'http://free-icon-rainbow.com/i/icon_01471/icon_014710_64.png'
      }
    ]
  },
  usersListState: {},
  dashboardState: {
    historyView: false,
    defaultMapCenter: { lat: 40, lng: 30 },
    dateFilter: new Date(Date.now()).toDateString(),
    groupageCreated: 0,
    groupageDestroyed: 0,
    newGroupage: {},
    orderUpdated: 0,
    groupageAssigned: 0,
    groupageUnassigned: 0,
    groupage: {},
    setOfItemIdsWithShowInfo: new Set(),
    orderCanceled: 0,
    orderListViewMode: 'orders',
  },
  companies: [

  ],
  coefficients: [

  ],
  createUserState: {
    userCreated: 0,
    pickUpPointCreated: 0,
    pickUpPointUpdated: 0,
    createdUser: {}
  },
  orderCreationState: {
    orderCreated: 0,
    createdStuff: {}
  },
  driverInfoPageState: {
    loading: false,
    error: null,
    salary: null
  }
};
