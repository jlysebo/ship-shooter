export class daylightCycle {
    /**
     * Constructs a daylightCycle object.
     * @param {int} daylight - The length of the day.
     * @param {int} nighttime - The lenght of the night.
     */
    constructor(daylight, nighttime) {
        this.cycleTime = daylight + nighttime;
        this.daylight = daylight;
        this.nighttime = nighttime;
        this.time = daylight/2;
    }
    /**
     * Progresses time by adding 1 time unit each time its called.
     */
    progressTime() {
        if (this.time >= this.cycleTime) {
            this.time = 0;
        }
        else {
            this.time += 1;
        }
    }
    /**
     * Returns a bool for wheater or not it is day.
     * @returns {Boolean} True if day, false if night
     */
    daylightBool() {
        if (this.time <= this.daylight) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Calculates a number which can be set as the opacity for fading in/out light.
     * @returns {int} A number between 0 and 1.
     */
    daylightInt() {
        let t;
        if (this.daylightBool()) {
            t = 1 - this.time / this.daylight;
        } else {
            t = (this.time - this.daylight) / this.nighttime;
        }
        t = Math.max(0, Math.min(1, t));
        return t * t * t;
    }
}