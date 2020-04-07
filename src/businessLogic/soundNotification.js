class SoundNotifications {

    constructor() {
        this.sounds = {};
    }

    checkOrderAndPlayNotification(order) {
        if(localStorage.getItem('sound_notifications')==='false')
          return true;
        if (order.express) {
            this.express();
        } else if (order.isOutOfCity) {
            this.outOfCity();
        } else {
            this.regular();
        }
    }

    express() {
        if (this.sounds.express === void 0) {
            this.sounds.express = new Audio("https://s3.amazonaws.com/dook-assets/sounds/order3.mp3");
        }
        this.sounds.express.play();
    }

    outOfCity() {
        if (this.sounds.outOfCity === void 0) {
            this.sounds.outOfCity = new Audio("https://s3.amazonaws.com/dook-assets/sounds/order2.mp3");
        }
        this.sounds.outOfCity.play();
    }

    regular() {
        if (this.sounds.regular === void 0) {
            this.sounds.regular = new Audio("https://s3.amazonaws.com/dook-assets/sounds/order1.mp3");
        }
        this.sounds.regular.play();
    }

}

export default new SoundNotifications();
