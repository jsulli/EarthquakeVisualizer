
var quakeList
console.log("creating UI")
function QuakeList(json) {

    this.buttonList = []

    this.createClickListener = function(button, index) {
        this.buttonList.push(button)
        button.addEventListener("click", function() {
            console.log("clicked item with index " + index)
            quakes.selectIndex(index)
        })
    }

    this.buildQuakeInfo = function(quake) {
        var props = quake.properties
        var info = ""
        var escape = "\n"

        // buildilng date
        var timeOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'}
        var date = new Date(0)
        date.setUTCMilliseconds(props.time)
        var dateOffset = new Date(0)
        dateOffset.setUTCMilliseconds(props.time + (props.tz * 60000))
        var offsetFormat = dateOffset.toLocaleDateString("en-US", timeOptions)
        var dateFormat = date.toLocaleDateString("en-US", timeOptions)

        var felt
        if(props.felt == null) felt = "No reports"
        else felt = props.felt + " reports"

        info += "Location: " + props.place + escape
        info += "UTC Time: " + dateFormat + escape
        info += "Local Time: " + offsetFormat + escape
        info += "Magnitude: " + props.mag + escape
        info += "Intensity: " + props.cdi + escape
        info += "Tsunami: " + (props.tsunami ? "Yes" : "No") + escape
        info += "USGS Link: " + escape
        info += "Coordinates: " + quake.geometry.coordinates[1] + ", " + quake.geometry.coordinates[0] + escape
        info += "Felt: " + felt + escape
        info += "Significance: " + props.sig + escape
        info += "DMin: " + props.dmin + escape
        info += "RMS: " + props.rms + escape
        info += "Gap: " + props.gap + " degrees" + escape

        return info
    }

    for(var i = 0; i < json.length; i++) {
        var quake = json[i].properties
        var card = document.getElementById('card-base'),
            clone = card.cloneNode(true)
        clone.id = "quake" + i
        clone.style.display = "flex"
        var button = clone.querySelector('#header-button')
        button.id = "quake" + i + "-button"
        button.setAttribute("data-target", "#quakeCollapse" + i);
        button.innerHTML = quake.title
        this.createClickListener(button, i)

        var body = clone.querySelector('#quake-body-base')
        body.id = "quakeCollapse" + i
        var content = clone.querySelector('#quake-content-base')
        content.id = "quake" + i + "-content"
        content.innerHTML = this.buildQuakeInfo(json[i])
        document.getElementById('quake-list').appendChild(clone)
    }


    this.activateIndex = function(index) {
        this.buttonList[index].click()
        location.href = "#"
        location.href = "#" + this.buttonList[index].id
    }
}
QuakeList.prototype.constructor = QuakeList;