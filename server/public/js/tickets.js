 const contentNode = document.getElementById("content");
 const toastContainerNode = document.getElementById("toastContainer");

 function showTickets() {
    loaderNode.classList.remove('hidden');
    fetch('/ticket/getMyTickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        // console.log(data);
        loaderNode.classList.add('hidden');
        if(data.success) {
            let tickets = data.tickets;
            const headingNode = document.createElement('h1');
            headingNode.classList.add('text-2xl', 'font-semibold', 'text-center', 'mt-5');
            headingNode.innerText = "My Tickets";
            contentNode.appendChild(headingNode);

            tickets.forEach((ticket) => {
                let ticketNode = document.createElement('div');
                ticketNode.id = `id-${ticket._id}`;
                ticketNode.classList.add('bg-white', 'shadow-lg', 'rounded-md', 'p-4', 'mt-5', 'w-11/12');
                ticketNode.innerHTML = `
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <div class="flex gap-2 items-center">
                            <div class="flex justify-center">
                                <img
                                id="profilePic"
                                src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
                                alt="profile pic"
                                class="h-10 w-10 object-cover rounded-full"
                                />
                            </div>
                            <div class="flex flex-col gap-2">
                                <div class="flex gap-2 items-center flex-col md:flex-row">
                                    <h1 class="text-lg font-semibold">${ticket.title}</h1>
                                    <span class="text-sm text-gray-500 mr-auto">(${ticket.assignedTo.departmentName})</span>
                                </div>
                                <div class="flex gap-2 items-center">
                                    <span class="text-sm text-gray-500">Status:</span>
                                    <span class="text-sm text-gray-500">${ticket.status}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center flex-col md:flex-row">
                            <span class="text-sm text-gray-500">Created At:</span>
                            <span class="text-sm text-gray-500">${new Date(ticket.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-sm text-gray-500">Description:</span>
                        <span class="text-sm text-gray-500">${ticket.description}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2 items-center">
                            <span class="text-sm text-gray-500">Priority:</span>
                            <span class="text-sm text-gray-500">${ticket.priority}</span>
                        </div>
                        <div class="flex gap-2 items-center">
                            <span class="text-sm text-gray-500">Created By:</span>
                            <span class="text-sm text-gray-500">${ticket.createdBy.firstName +" "+ticket.createdBy.lastName}</span>
                        </div>
                    </div>
                    <div>
                        <button class="bg-red-500 md:w-1/6 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="deleteTicket('${ticket._id}')">Delete Ticket</button>
                        <button class="bg-blue-500 md:w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="showChat('${ticket._id}')">Show Chat</button>
                    </div>

                </div>`;
                contentNode.appendChild(ticketNode);
            });
        } else {
            alert(data.message);
        }
    }).catch((err) => {
        console.log(err);
        loaderNode.classList.add('hidden');
        alert('Something went wrong. Please try again later.');
    });
}

function showChat(ticketId) {
    console.log("loasdchatchatchat", ticketId);
}

function deleteTicket(ticketId) {
    // console.log("asdcsc", ticketId);
    fetch(`ticket/deleteTicket/${ticketId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        // console.log(data);
        if(data.success) {  
            deleteNodeById(`id-${ticketId}`);

            const toastNode = document.createElement("div");
            toastNode.id = `toast-danger-id-${ticketId}`;
            toastNode.className = `flex items-center w-full max-w-xs p-4 mb-2 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transition-all duration-500 ease-out`;
            toastNode.innerHTML = `
                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                    </svg>
                    <span class="sr-only">Error icon</span>
                </div>
                <div class="ml-3 text-sm font-normal">Ticket has been deleted.</div>
                <button type="button" onClick="deleteNodeById('toast-danger-id-${ticketId}')" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                    <span class="sr-only">Close</span>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            `;
            toastContainerNode.appendChild(toastNode);

            setTimeout(()=>{
                deleteNodeById(`toast-danger-id-${ticketId}`);
            }, 2300);
        } else {
            alert(data.message);
        }

    })
    .catch((err) => {
        // console.log("Error:", err);
        alert(err);
    })
}

function deleteNodeById(id) {
    // console.log(id);
    try {
        document.getElementById(id).remove();
    } catch(err) {
        console.log(err);
    }
}

showTickets();