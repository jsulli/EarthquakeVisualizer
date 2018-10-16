import * as $ from "jquery"

export class QuakeData {

    loadComplete
    data
    quakeMarkers

    constructor(path, loadComplete?) {
        this.loadComplete = loadComplete
        this.getJson(path)
    }

    getJson(path) {
        let _this = this
        $.getJSON(path, function(json) {
            _this.data = json
            _this.loadComplete(json)
        })
    }

    getQuakes() {
        return this.data.features
    }


    sortByTime() {
        console.log("starting sort by time")
        this.data.features.sort(function(a, b) {
            return parseInt(a.properties.time) - parseFloat(b.properties.time)
        })
    }

    sortByMagnitude() {
        console.log("starting sort by magnitude")
        this.data.features.sort(function(a, b) {
            return parseFloat(b.properties.mag) - parseFloat(a.properties.mag)
        })
    }


    clearAndRebuild(quakeList) {
        this.quakeMarkers.clearMarkers()
        quakeList.clearList()
        this.quakeMarkers.initMarkers()
        quakeList.initList()
    }


    /*
     * Builds content displayed when a quake is selected
     */
    buildQuakeDetails(index) {
        var quake = this.data.features[index]
        var props = quake.properties
        var info = ""
        var escape = "\n"

        // build date
        var timeOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
        var date = new Date(0)
        date.setUTCMilliseconds(props.time)
        var dateOffset = new Date(0)
        dateOffset.setUTCMilliseconds(props.time + (props.tz * 60000))
        var offsetFormat = dateOffset.toLocaleDateString("en-US", timeOptions)
        var dateFormat = date.toLocaleDateString("en-US", timeOptions)

        var felt
        if (props.felt == null) felt = "No reports"
        else felt = props.felt + " reports"

        info += "Location: " + props.place + escape
        info += "UTC Time: " + dateFormat + escape
        info += "Local Time: " + offsetFormat + escape
        info += "Magnitude: " + props.mag + escape
        info += "Intensity: " + props.cdi + escape
        info += "Tsunami: " + (props.tsunami ? "Yes" : "No") + escape
        //info += "USGS Link: " + props.url + escape
        info += "Coordinates: " + quake.geometry.coordinates[1] + ", " + quake.geometry.coordinates[0] + escape
        info += "Felt: " + felt + escape
        info += "Significance: " + props.sig + escape
        info += "DMin: " + props.dmin + escape
        info += "RMS: " + props.rms + escape
        info += "Gap: " + props.gap + " degrees" + escape

        return info
    }
}