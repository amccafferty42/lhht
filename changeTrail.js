let newTrail;

// Select DOM elements
const file = document.getElementById('trailFile');
const uploadTrailBtn = document.getElementById('upload-trail-btn');
const validJsonLabel = document.getElementById('validJson');

function readFile(input) {
    let file = input.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file); 
    fileReader.onload = function() {
        setNewTrail(fileReader.result)
    }; 
    fileReader.onerror = function() {
        alert(fileReader.error);
    }; 
}

function setNewTrail(file) {
    const trail = validJson(file);
    if (trail) {
        console.log("Successfully validated " + trail.name);
        validJsonLabel.innerHTML = '';
        this.newTrail = trail;
        changeTrail();
    } else {
        validJsonLabel.innerHTML = '&nbsp;invalid JSON';
        uploadTrailBtn.disabled = true;
        this.newTrail = undefined;
    }
}

function changeTrail() {
    if (this.newTrail != undefined) {
        console.log("Changing trail to " + this.newTrail.name);
        console.log(this.newTrail);
        trail = this.newTrail;
        reset();
        setTrailDetails(trail);
        initMap();
        $('#changeTrail').modal('hide');
    }
}

function submitTrail() {
    const trail = validJson(jsonTemplate.value);
    this.newTrail = trail ? trail : undefined;
    changeTrail();
}

function validJson(file) {
    try {
        const trail = JSON.parse(file);
        // if (!trail || typeof trail != "object") return false;
        // if (!trail.name || typeof trail.name != "string" || trail.name == '' || trail.name.length > 50) return false;
        // if (!trail.length || typeof trail.length != "number" || trail.length < 1 || trail.length > 999) return false;
        // if (!trail.unit || (trail.unit !== 'mi' && trail.unit !== 'km')) return false;
        // if (typeof trail.circuit != "boolean") return false;
        // if (!trail.campsites || trail.campsites.length < 1 || trail.campsites > 99) return false;
        // if (!trail.trailheads || trail.trailheads.length < 2 || trail.trailheads.length > 99 || trail.trailheads[0].distance != 0 || (!trail.circuit && trail.trailheads[trail.trailheads.length - 1].distance != trail.length)) return false;
        // for (campsite of trail.campsites) if (!campsite.name || typeof campsite.name != "string" || campsite.name == '' || campsite.name.length > 50 || typeof campsite.distance != "number" || campsite.distance < 0 || campsite.distance > 999) return false;
        // for (trailhead of trail.trailheads) if (!trailhead.name || typeof trailhead.name != "string" || trailhead.name == '' || trailhead.name.length > 50 || typeof trailhead.distance != "number" || trailhead.distance < 0 || trailhead.distance > 999) return false;
        return trail;
    } catch (e) {
        console.error(e);
    }
    return false;
}