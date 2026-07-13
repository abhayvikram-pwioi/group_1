const eventForm = document.getElementById("eventForm");
const title = document.getElementById("title");
const date = document.getElementById("date");
const time = document.getElementById("time");
const venue = document.getElementById("venue");
const category = document.getElementById("category");
const seats = document.getElementById("seats");
const image = document.getElementById("image");
const description = document.getElementById("description");
const search = document.getElementById("search");
const eventTable = document.getElementById("eventTable");
const submitBtn = document.getElementById("submitBtn");


let events = JSON.parse(localStorage.getItem("events")) || [];
let editIndex = -1;
displayEvents();

eventForm.addEventListener("submit", function(e){

    e.preventDefault();

    const event = {
        id: Date.now(),

        title: title.value,

        date: date.value,

        time: time.value,

        location: venue.value,

        category: category.value,

        maxAttendees: seats.value,

        image: image.value,

        description: description.value

    };

    if(editIndex === -1){

    events.push(event);

    }
    else{

    events[editIndex] = event;

    editIndex = -1;

    submitBtn.textContent = "Add Event";

   }

    localStorage.setItem("events",JSON.stringify(events));

    console.log(events);
    displayEvents();

    eventForm.reset();

});


function displayEvents(eventList = events){
    eventTable.innerHTML = "";
    eventList.forEach(function(event,index){
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
               <img src="${event.image}" alt="Event">
            </td>

            <td>${event.title}</td>

            <td>${event.description}</td>

            <td>${event.category}</td>

            <td>${event.date}</td>

            <td>${event.time}</td>

            <td>${event.location}</td>

            <td>${event.seats}</td>

            <td>
               <button class="edit-btn" data-index="${index}">Edit</button>
               <button class="delete-btn" data-index="${index}">Delete</button>
            </td>`;

            eventTable.appendChild(row);

    })

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function(button){
      button.addEventListener("click",function(){
        const index = this.dataset.index;

        events.splice(index,1);

        localStorage.setItem("events", JSON.stringify(events));

        displayEvents();
      })
});

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(function(button){
       button.addEventListener("click", function(){

    const index = this.dataset.index;

    editIndex = index;

    title.value = events[index].title;

    date.value = events[index].date;

    time.value = events[index].time;

    venue.value = events[index].venue;

    category.value = events[index].category;

    seats.value = events[index].seats;

    image.value = events[index].image;

    description.value = events[index].description;

    submitBtn.textContent = "Update Event";

});
});
}

search.addEventListener("input",function(){
    const searchText = search.value.toLowerCase();
    const filteredEvents = events.filter(function(event){
        return(
            event.title.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText)
        );
    })
    displayEvents(filteredEvents);
})




const profileImg = document.querySelector(".profile-img");
const dropdown = document.getElementById("profile-dropdown");

profileImg.addEventListener("click",(e)=>{

    e.stopPropagation();
    dropdown.classList.toggle("active");

});

document.addEventListener("click",()=>{

    dropdown.classList.remove("active");

});


const user = JSON.parse(localStorage.getItem("currentUser"));

document.getElementById("dropdown-name").innerText = user.fullName;
document.getElementById("dropdown-email").innerText = user.email;

document.getElementById("dropdown-pic").src = user.profilePic;
document.getElementById("profile-pic").src = user.profilePic;

if(user.role === "admin"){

    document.getElementById("registration-link").style.display = "none";

}else{

    document.getElementById("dashboard-link").style.display = "none";

}

document.getElementById("logout-btn").addEventListener("click",()=>{

    localStorage.removeItem("currentUser");

    window.location.href = "LoginPage.html";

});