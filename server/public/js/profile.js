const profileBtnNode = document.getElementById('profileBtn');
const profilePicNode = document.getElementById('profilePic');
const profileContentNode = document.getElementById('profileContent');
const otherThanLoaderNode = document.getElementById('otherThanLoader');
const loaderNode = document.getElementById("loader");

profileBtnNode.addEventListener('click', () => {
    profileContentNode.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    if((event.target !== profilePicNode) && !profileContentNode.classList.contains('hidden')) {
        profileContentNode.classList.add('hidden');
    }
});

function showProfile() {
    profileContentNode.classList.add('hidden');
    loaderNode.classList.remove("hidden");
    otherThanLoaderNode.classList.add("hidden");
    fetch('/auth/getProfile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        // console.log(data);
        if(data.success) {
            otherThanLoaderNode.innerHTML = `
            <!-- profile details -->
            <div class="bg-white shadow-lg rounded-md p-4 mt-5 w-11/12">
                <div class="flex flex-col gap-2">
                    <div class="flex justify-center">
                        <img
                        id="profilePic"
                        src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
                        alt="profile pic"
                        class="h-40 w-40 object-cover rounded-full"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <table class="table-auto">
                            <tbody>
                                <tr>
                                    <td class="px-4 py-2">Name:</td>
                                    <td class="px-4 py-2">${data.profile.firstName +" "+ data.profile.lastName}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2">Email:</td>
                                    <td class="px-4 py-2">${data.profile.email}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2">Department:</td>
                                    <td class="px-4 py-2">${data.profile.department.departmentName}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2">Role:</td>
                                    <td class="px-4 py-2">${data.profile.role}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2">Account Created At:</td>
                                    <td class="px-4 py-2">${new Date(data.profile.createdAt).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>`;
            loaderNode.classList.add("hidden");
            otherThanLoaderNode.classList.remove("hidden");
        } else {
            alert('Something went wrong');
        }
    }).catch((err) => {
        console.log(err);
    });
}