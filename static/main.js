$(document).ready(() => {
    const data = {
        sprints: [],
        issues: [],
        currentSprintId: null,
        setCurrentSprintID: function(id) {
            this.currentSprintId = id
        },
        getCurrentSprintID: function() {
            return this.currentSprintId
        },
        getSprints: function () {
            //get sprints
            fetch("/sprint", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(json => {
                    this.sprints = json;
                    view.displayAllSprints();
                });
        },
        getIssues: function () {
            // get issues
            fetch("/issue", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(json => this.issues = json);
        }

    };

    const view = {
        displaySprint: function (sprint) {
            const sprintDisplay = document.getElementById("sprintDisplay");
            const cardContainer = document.createElement('div');
            cardContainer.className ="card sprint";
            const sprintDiv = document.createElement('div');
            sprintDiv.className = "card-header";
            sprintDiv.innerText = sprint.sprint;
            const addIssueBtn = document.createElement("button");
            addIssueBtn.className = "btn btn-primary float-right";
            addIssueBtn.innerText = "Add Issue";
            addIssueBtn.setAttribute("data-toggle", "modal");
            addIssueBtn.setAttribute("data-target", "#issueModal");
            addIssueBtn.id = `btn_${sprint._id}`;
            addIssueBtn.addEventListener('click', (event) => {
                data.setCurrentSprintID(event.target.id.split("_")[1]);
            });
            const sprintIssues = document.createElement('div');
            sprintIssues.id = `sprint_${sprint._id}`;
            sprintDiv.appendChild(addIssueBtn);
            sprintDisplay.appendChild(cardContainer).appendChild(sprintDiv);
            cardContainer.appendChild(sprintIssues);
            this.displaySprintIssues(sprint._id);
        },
        displayAllSprints: function () {
            data.sprints.forEach((sprint => this.displaySprint(sprint)));
        },
        displayIssue: function (issue, containerId) {
            const display = document.getElementById(containerId);
            const newIssue = document.createElement("div");
            const type = document.createElement("div");
            const name = document.createElement("div");
            const status = document.createElement("div");
            const description = document.createElement("div");
            [type, name, status, description].forEach(each => each.className = "p-2 flex-fill styleIssue");
            type.innerText = "Type \n" + issue.type;
            name.innerText = "Name \n" +  issue.name;
            status.innerText = "Status \n" + issue.status;
            description.innerText = "Description \n" + issue.description;
            newIssue.appendChild(type);
            newIssue.appendChild(name);
            newIssue.appendChild(status);
            newIssue.appendChild(description);
            newIssue.className = "list-group-item d-flex bd-highlight";
            display.appendChild(newIssue);
        },
        displaySprintIssues: function (sprintId) {
            data.issues.filter(issue => {
                return issue.sprint === sprintId;
            }).forEach((issue) => this.displayIssue(issue, `sprint_${sprintId}`))
        }
    };

    const controller = {
        addSprintEventListener: function () {
            document.getElementById("sprintSaveBtn").addEventListener('click', (e) => {
                e.preventDefault();
                const userInputSprint = document.getElementById("userInputSprint").value;

                fetch("/sprint", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sprint: userInputSprint})
                })
                    .then(response => response.json())
                    .then(json => {
                        view.displaySprint(json.document);
                    });

            });
        },
        addIssueEventListener: function() {

            document.getElementById("addIssueForm").addEventListener("submit", (e) => {
                e.preventDefault();
                const name = document.getElementById("nameInput").value;
                const type = document.getElementById("inputGroupSelect01").value;
                const description = document.getElementById("description").value;
                const status = "New";
                const userInput = {
                    name: name,
                    type: type,
                    status: status,
                    description: description,
                    sprint: data.getCurrentSprintID()
                };
                fetch("/issue", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userInput)
                })
                    .then(response => response.json())
                    .then(json => {
                        const containerId = `sprint_${data.getCurrentSprintID()}`;
                        view.displayIssue(json.document, containerId);
                    });
            });
        }

    };

    data.getIssues();
    data.getSprints();
    controller.addSprintEventListener();
    controller.addIssueEventListener()
});