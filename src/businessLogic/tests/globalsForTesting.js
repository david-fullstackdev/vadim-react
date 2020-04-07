const langs = [
  {
    localStorage: 'ar',
    navigator: undefined
  },
  {
    localStorage: 'en',
    navigator: undefined
  },
  {
    localStorage: undefined,
    navigator: 'ar-AR'
  },
  {
    localStorage: undefined,
    navigator: 'en-US'
  },
];

export const orders = [
  {
    "deliveryTime": 1479326400000,
    "deliveryPoint": "Dachna Street 6, Vinnitsa, Vinnyts'ka oblast, Ukraine",
    "cashOnDeliveryAmount": 0,
    "orderStatus": "pickedUp",
    "expectedPickUpTime": {
      "startTime": 1479308400000,
      "endTime": 1479319200000
    },
    "realPickUpTime": 1486551669541,
    "cashOnDelivery": false,
    "deliveryCommission": 20,
    "createdBy": "myPlatform",
    "express": false,
    "oldCosts": [],
    "vehicleType": 5,
    "id": "58737f3990bf32a4369d7abe",
    "createdAt": "2017-01-09T12:16:57.994Z",
    "updatedAt": "2017-02-08T11:01:09.541Z",
    "recipientId": "58737f3990bf32a4369d7abd",
    "dispatcherId": "586fee271c80500f00ed2467",
    "createdByPlatformId": "586feabc1c80500f00ed245d",
    "orderCreatedTime": 1479308400000
  },
  {
    "deliveryTime": 1479326400000,
    "deliveryPoint": "Dachna Street 6, Vinnitsa, Vinnyts'ka oblast, Ukraine",
    "cashOnDeliveryAmount": 0,
    "orderStatus": "new",
    "expectedPickUpTime": {
      "startTime": 1479308400000,
      "endTime": 1479319200000
    },
    "cashOnDelivery": false,
    "deliveryCommission": 20,
    "createdBy": "myPlatform",
    "express": false,
    "oldCosts": [],
    "vehicleType": 5,
    "id": "58737f767d0a7a1436800cdb",
    "createdAt": "2017-01-09T12:17:58.291Z",
    "updatedAt": "2017-02-07T19:51:28.097Z",
    "recipientId": "58737f767d0a7a1436800cda",
    "dispatcherId": "586fee271c80500f00ed2467",
    "createdByPlatformId": "586feabc1c80500f00ed245d",
    "orderCreatedTime": 1479308400000
  },
  {
    "deliveryTime": 1479326400000,
    "deliveryPoint": "Dachna Street 6, Vinnitsa, Vinnyts'ka oblast, Ukraine",
    "cashOnDeliveryAmount": 0,
    "orderStatus": "pickedUp",
    "expectedPickUpTime": {
      "startTime": 1479308400000,
      "endTime": 1479319200000
    },
    "realPickUpTime": 1486153886052,
    "cashOnDelivery": false,
    "deliveryCommission": 20,
    "createdBy": "myPlatform",
    "express": false,
    "oldCosts": [],
    "vehicleType": 5,
    "id": "5873809c8d3e1fb81470a77f",
    "createdAt": "2017-01-09T12:22:52.504Z",
    "updatedAt": "2017-02-07T19:51:28.097Z",
    "recipientId": "5873809c8d3e1fb81470a77e",
    "dispatcherId": "586fee271c80500f00ed2467",
    "createdByPlatformId": "586feabc1c80500f00ed245d",
    "orderCreatedTime": 1479308400000
  },
  {
    "deliveryTime": 1479326400000,
    "deliveryPoint": "Dachna Street 6, Vinnitsa, Vinnyts'ka oblast, Ukraine",
    "cashOnDeliveryAmount": 0,
    "orderStatus": "new",
    "expectedPickUpTime": {
      "startTime": 1479308400000,
      "endTime": 1479319200000
    },
    "cashOnDelivery": false,
    "deliveryCommission": 50,
    "express": false,
    "oldCosts": [],
    "vehicleType": 5,
    "id": "587381323a3f327410a52ed2",
    "createdAt": "2017-01-09T12:25:22.804Z",
    "updatedAt": "2017-02-07T19:51:28.097Z",
    "recipientId": "587381323a3f327410a52ed1",
    "dispatcherId": "57908cb0ca705a12009d62ea",
    "orderCreatedTime": 1483964722802
  }
];

export const users = [
  {
      "currency": "SAR",
      "firstName": "deleteitnull",
      "lastName": "",
      "phone": "5555555555",
      "mobile": "5555555555",
      "shopName": "deleteshop",
      "deliveryCommission": 35,
      "expressDeliveryCommission": 25,
      "city": "King Abdul Aziz",
      "country": "King Abdul Aziz",
      "pickUpTimeWindow": 3,
      "email": "delete@it.com",
      "id": "5878d3a52a4efe0f008ddd63",
      "createdAt": "2017-01-13T13:18:29.842Z",
      "updatedAt": "2017-02-12T17:47:48.890Z",
      "role": "dispatcher"
    },
    {
      "currency": "SAR",
      "firstName": "New",
      "lastName": "User",
      "phone": "12345678",
      "mobile": "12345678",
      "shopName": "MyShop",
      "deliveryCommission": 35,
      "expressDeliveryCommission": 25,
      "city": "Riyadh",
      "country": "Saudi Arabia",
      "pickUpTimeWindow": 3,
      "email": "somenewuser@example.com",
      "id": "5878f04adf60820f00d1d37b",
      "createdAt": "2017-01-13T15:20:42.671Z",
      "updatedAt": "2017-02-12T17:47:48.890Z",
      "role": "dispatcher"
    },
    {
      "currency": "SAR",
      "firstName": "deletename",
      "phone": "6666666666",
      "mobile": "6666666666",
      "shopName": "deleteshop",
      "deliveryCommission": 35,
      "expressDeliveryCommission": 25,
      "city": "Ministry of the National Guard",
      "country": "Ministry of the National Guard",
      "pickUpTimeWindow": 3,
      "email": "delete@it.ru",
      "id": "587a3caaa351b70f00d57ada",
      "createdAt": "2017-01-14T14:58:50.310Z",
      "updatedAt": "2017-02-12T17:47:48.890Z",
      "role": "dispatcher"
    },
    {
      "currency": "SAR",
      "firstName": "deleteitnull",
      "lastName": "",
      "phone": "22222222222",
      "mobile": "222222222",
      "shopName": "shoshoppp",
      "deliveryCommission": 35,
      "expressDeliveryCommission": 25,
      "city": "Mosab Ibn Umair St, Al Malaz, Riyadh 12832, Saudi Arabia",
      "country": "Mosab Ibn Umair St, Al Malaz, Riyadh 12832, Saudi Arabia",
      "pickUpTimeWindow": 3,
      "email": "test-test.test___test@test.ru",
      "id": "587bca29f6b0700f0009e5ae",
      "createdAt": "2017-01-15T19:14:49.608Z",
      "updatedAt": "2017-02-12T17:47:48.890Z",
      "role": "dispatcher"
    },
    {
      "currency": "SAR",
      "firstName": "Test",
      "phone": "256636851",
      "mobile": "635236521",
      "shopName": "Test",
      "deliveryCommission": 35,
      "expressDeliveryCommission": 25,
      "city": "",
      "country": "Saudi Arabia",
      "pickUpTimeWindow": 3,
      "email": "fydgfufu@dffddg.com",
      "id": "587ce5e0f6b0700f0009e64a",
      "createdAt": "2017-01-16T15:25:20.952Z",
      "updatedAt": "2017-02-12T17:47:48.891Z",
      "role": "dispatcher"
    },
    {
      "currency": "SAR",
      "firstName": "Test12345$&-=) (@%:'*\"null",
      "lastName": "",
      "phone": "258369147258",
      "mobile": "258369147258",
      "shopName": "Testing on Andr",
      "deliveryCommission": 35,
      "expressDeliveryCommission": 25,
      "city": "Zolotovorits'kyi Passage, Kyiv, Ukraine",
      "country": "Zolotovorits'kyi Passage, Kyiv, Ukraine",
      "pickUpTimeWindow": 3,
      "email": "kswiridenko@ukr.net",
      "id": "587ce632f6b0700f0009e64d",
      "createdAt": "2017-01-16T15:26:42.058Z",
      "updatedAt": "2017-02-12T17:47:48.891Z",
      "role": "dispatcher"
    }
];
