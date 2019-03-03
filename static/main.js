$(document).ready(() => {
    const display = document.getElementById("display");

    document.getElementById("addIssueForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const userInput = document.getElementById("userInput").value;
        fetch("/issue", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({issue: userInput})
        })
            .then(response => response.json())
            .then(json => {
                displayIssue(json.document)
            });
    });

    fetch("/issue", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(json => displayIssues(json));


    function displayIssues(issues) {
        issues.forEach((issue) => displayIssue(issue))
    }

    function displayIssue(issue) {
        const newTask = document.createElement("li");
        newTask.innerText = issue.issue;
        newTask.className = "list-group-item";
        display.appendChild(newTask);
    }

});