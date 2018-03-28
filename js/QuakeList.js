var quakeList

function QuakeList() {

    this.buttonList = []


    this.createClickListener = function(button, index) {
        this.buttonList.push(button)
        button.addEventListener("click", function() {
            console.log("clicked item with index " + index)
            quakeMarkers.selectIndex(index)
        })
    }


    /*
     * Initialize sorting buttons. Currently, to sort the list the entire list is deleted, including all corresponding
     * markers on the globe, the json itself is sorted, then everything else is rebuilt from scratch.
     * There is a lot of room to optimize this process by reordering things instead of rebuilding, but
     * currently it can sort and build new UI elements and 3d markers in less than 16ms with a list of ~100 items
     */
    this.init = function() {

        this.sortByTime = true
        var sortTime = $('#sort-time')
        var _this = this
        sortTime.click(function() {

            if (!_this.sortByTime) {
                _this.sortByTime = true
                sortTime.addClass("active").siblings().removeClass("active")
                quakeMarkers.clearQuakes()
                quakeMarkers.sortByTime()
                quakeMarkers.initMarkers()
            }
        })
        var sortMag = $('#sort-mag')
        sortMag.click(function() {
            if (_this.sortByTime) {
                _this.sortByTime = false
                sortMag.addClass("active").siblings().removeClass("active")
                quakeMarkers.clearQuakes()
                quakeMarkers.sortByMagnitude()
                quakeMarkers.initMarkers()
            }
        })
    }

    /*
     * Build list of earthquakes. Uses a template defined in index.hmtl, copies it, and changes necessary fields
     */
    this.initList = function() {

        for (var i = 0; i < quakeData.getQuakes().length; i++) {

            var quake = quakeData.getQuakes()[i].properties

            // root element
            var card = document.getElementById('card-base'),
                clone = card.cloneNode(true)
            clone.id = "quake" + i
            clone.style.display = "flex"

            // button
            var button = clone.querySelector('#header-button')
            button.id = "quake" + i + "-button"
            button.setAttribute("data-target", "#quakeCollapse" + i)
            button.innerHTML = quake.title
            this.createClickListener(button, i)

            var body = clone.querySelector('#quake-body-base')
            body.id = "quakeCollapse" + i

            // inner content
            var content = clone.querySelector('#quake-content-base')
            content.id = "quake" + i + "-content"
            content.innerHTML = quakeData.buildQuakeDetails(i)

            // add freshly built component to parent
            document.getElementById('quake-list').appendChild(clone)
        }

        // open sidebar when complete to reduce jank
        $('#sidebar').removeClass('sidebar-closed')
    }

    this.initList()


    // Select item in list at index
    this.activateIndex = function(index) {
        this.buttonList[index].click()
        location.href = "#"
        location.href = "#" + this.buttonList[index].id
    }

    // Wipe the list for rebuilding in a new sort
    this.clearList = function() {
        var container = document.getElementById('quake-list')
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
        this.buttonList = []
    }
}

QuakeList.prototype.constructor = QuakeList
