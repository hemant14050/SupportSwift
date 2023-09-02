const selectDepartmentNode = document.getElementById("department");

function createDepartmentOptions() {
    loaderNode.classList.remove("hidden");
    otherThanLoaderNode.classList.add("hidden");

    fetch("/department/getAllDepartments", {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        }
    })
    .then((res ) => {
        return res.json();
    })
    .then((data) => {
        let allDepartments = data.allDepartments;
        allDepartments.forEach((department) => {
            let optionNode = document.createElement("option");
            optionNode.value = `${department.departmentName}`
            optionNode.innerHTML = `${department.departmentName}`
            selectDepartmentNode.appendChild(optionNode);   
        });

        loaderNode.classList.add("hidden");
        otherThanLoaderNode.classList.remove("hidden");
    })
    .catch((err) => {
        console.log("Error:", err);
        alert("Somehting wents wrong!");
    })
}

createDepartmentOptions();