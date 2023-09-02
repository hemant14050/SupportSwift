 const contentNode = document.getElementById("content");
 
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
                    <button class="bg-blue-500 md:w-1/6 ml-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="showChat('${ticket._id}')">Show Chat</button>

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

showTickets();