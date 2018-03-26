
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
        var info = ""

        var epoch = Math.floor(quake.time / 1e3)
        console.log(epoch)
        var timeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
        var date = new Date(0)
        date.setUTCSeconds(epoch)
        var dateFormat = date.toLocaleDateString("en-US", timeOptions)
        info += "Location: " + quake.place + "\n"
        info += "Time: " + dateFormat + "\n"
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
        content.innerHTML = this.buildQuakeInfo(quake)
        document.getElementById('quake-list').appendChild(clone)
    }


    this.activateIndex = function(index) {
        this.buttonList[index].click()
        location.href = "#"
        location.href = "#" + this.buttonList[index].id
    }
}
QuakeList.prototype.constructor = QuakeList;
