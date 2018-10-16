import * as $ from "jquery"

export class QuakeList {

    buttonList = []

    quakeMarkers
    quakeData
    sortByTime

    constructor(quakeMarkers, quakeData) {
        this.quakeMarkers = quakeMarkers
        this.quakeData = quakeData

        this.sortByTime = true
        var sortTime = $('#sort-time')
        var _this = this
        sortTime.click(function() {

            if (!_this.sortByTime) {
                _this.sortByTime = true
                sortTime.addClass("active").siblings().removeClass("active")
                quakeData.sortByTime()
                quakeData.clearAndRebuild(this)
            }
        })
        var sortMag = $('#sort-mag')
        sortMag.click(function() {
            if (_this.sortByTime) {
                _this.sortByTime = false
                sortMag.addClass("active").siblings().removeClass("active")
                quakeData.sortByMagnitude()
                quakeData.clearAndRebuild(this)
            }
        })
        this.initList()
    }


    createClickListener(button, index) {
        this.buttonList.push(button)
        button.addEventListener("click", () => {
            console.log("clicked item with index " + index)
            this.quakeMarkers.selectIndex(index)
        })
    }


    /*
     * Initialize sorting buttons. Currently, to sort the list the entire list is deleted, including all corresponding
     * markers on the globe, the json itself is sorted, then everything else is rebuilt from scratch.
     * There is a lot of room to optimize this process by reordering things instead of rebuilding, but
     * currently it can sort and build new UI elements and 3d markers in less than 16ms with a list of ~100 items
     */

    /*
     * Build list of earthquakes. Uses a template defined in index.hmtl, copies it, and changes necessary fields
     */
    initList() {

        for (var i = 0; i < this.quakeData.getQuakes().length; i++) {

            var quake = this.quakeData.getQuakes()[i].properties

            // root element
            var card = document.getElementById('card-base') as HTMLElement,
                clone = card.cloneNode(true) as HTMLElement
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
            content.innerHTML = this.quakeData.buildQuakeDetails(i)

            // add freshly built component to parent
            document.getElementById('quake-list').appendChild(clone)
        }

        // open sidebar when complete to reduce jank
        $('#sidebar').removeClass('sidebar-closed')
    }


    // Select item in list at index
    activateIndex(index) {
        this.buttonList[index].click()
        location.href = "#"
        location.href = "#" + this.buttonList[index].id
    }

    // Wipe the list for rebuilding in a new sort
    clearList() {
        var container = document.getElementById('quake-list')
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
        this.buttonList = []
    }
}
