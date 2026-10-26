
//Select HTML Elements
const newNote = document.getElementById("new-note-btn");
const noteEditor = document.querySelector(".note-editor");
const noteTitle = document.getElementById("input");
const noteText = document.getElementById("note-text");
const noteContainer = document.querySelector(".notes-container");
const saveBtn = document.querySelector(".save-btn");
const deleteButtons = document.querySelectorAll(".note-card .deleteBtn");
const navItems = document.querySelectorAll(".nav-item");
const sectionTitle = document.querySelector(".notes-section h2");
const dateElement = document.querySelector(".date");


//LOAD NOTES FROM LOCAL STORAGE
//Get saved notes local storage.
//if no notes exist , start with an empty array.


let notes = JSON.parse(localStorage.getItem("notes")) || [];

// add default values to older notes if needed.
notes = notes.map(function(note) {
    return {
        ...note,
        favorite: note.favorite ?? false,
        trashed: note.trashed ?? false
    };
});

// store the name of the currently selected page.

let currentPage = "home";


//SAVE NOTES

//convert the notes array to JSON and save it.
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}


//OPEN  THE NOTE EDITOR

//Show the editor when the new note button is clicked.


newNote.addEventListener("click", function() {
    noteEditor.hidden = false;
});

//CREATE AND DISPLAY A NOTE 

//Create a note card and add its content and button.
function displayNote(title, text, note) {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";

    //expand the card when it is clicked
    noteCard.addEventListener("click", function() {
        //do not expand the card when button is clicked.
        if (event.target.closest("button")) {
    return;
}
    noteCard.classList.add("expanded");
    noteContainer.classList.add("has-expanded");
});

noteContainer.addEventListener("click", function(event) {
    if (
        event.target.classList.contains("has-expanded") ||
        event.target === noteContainer
    ) {
        closeExpandedNote();
    }
});

//create the container for the action buttons.

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions"

    //create the note title.
    const heading = document.createElement("h3");
    heading.textContent = title;
    
    //create the note text.
    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    //create the date label.
    const date = document.createElement("small");
    date.className = "note-date";

    //use the saved date, or today's date for older notes.
    date.textContent = "Created on" + new 
    Date(note.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    //FAVORITE BUTTON

    //Create the favorite button.
    const favoriteBtn = document.createElement("button");
    favoriteBtn.textContent = "\u2606";
    favoriteBtn.className = "star-btn";

    //show whenther this note is already a favorite.
    favoriteBtn.classList.toggle("is-favorite", note.favorite);

    //toggle favorite status when the button is clicked.
    favoriteBtn.addEventListener("click", function(){
        note.favorite = !note.favorite;

        //update the button's apperance.
        favoriteBtn.classList.toggle("is-favorite", note.favorite);

        //save the change and refresh the notes.
        saveNotes();
        renderNotes();
    });


    //Delete / trash button

    //create the trash button.
    const button = document.createElement("button");
    button.textContent = "\u{1F5D1}";
    button.className = "deleteBtn";


    //move a note to trash or delte it permanently.
    button.addEventListener("click", function () {
       if (currentPage === "trash") {
        notes = notes.filter(function(item){
            return item !== note;

        });

       } else {

        //mark the note as moved to trash
        note.trashed = true;
       }

       //save the change and refresh the page.
        saveNotes();
        renderNotes();
    });


    //ADD ELEMENTS TO THE CARD


    //Put both buttons inside the actions container.
    cardActions.appendChild(favoriteBtn);
    cardActions.appendChild(button);

    //add the note content to the card
    noteCard.appendChild(cardActions);
    noteCard.appendChild(heading);
    noteCard.appendChild(paragraph);
    noteCard.appendChild(date);
    

    //display the finished card on the page.
    noteContainer.appendChild(noteCard);
}



//CLOSE AN EXPANED NOTE

//Close the expanded note and restore the normal view.
function closeExpandedNote() {
    const expandedCard = document.querySelector(".note-card.expanded");

    if (expandedCard) {
        expandedCard.classList.remove("expanded");
    }

    noteContainer.classList.remove("has-expanded");
}


//RENDER NOTES FR THE CURRENT PAGE


//Clear the container and display the correct notes.
function renderNotes() {

    //remove the previos cards from the page.
    noteContainer.innerHTML = "";

    //create the card used toinvite users to make a note.
    const createCard = document.createElement("div");
    createCard.className = "create-card";
    createCard.innerHTML = `<span class="plus">+</span><p> Create a new note</p>`;


    if (
        currentPage !== "trash" && 
        notes.filter(function(note){
            return !note.trashed;
        }).length === 0 
    ) {
        createCard.classList.add("center-card");
        noteContainer.appendChild(createCard);
    }



    //start with all notes before appling the page filter.
    let filterNotes = notes;

    //show only favorite notes on the favorites page.
    if (currentPage === "favorites") {
       filterNotes = notes.filter(function(note) {
            return note.favorite && ! note.trashed;
        });

        //shoe olny trashed notes ont the trashed notes.
    } else if ( currentPage === "trash"){
        filterNotes = notes.filter(function(note){
            return note.trashed;
        });


        //on the home and notes , hide trashed notes.
    } else {
        filterNotes = notes.filter(function(note) {
            return !note.trashed;
        });
    }

    //display every note tht matches the current filter.
    filterNotes.forEach(function(note) {
        displayNote(note.title, note.text, note);
    })
}

//display the saved notes when the script starts.
renderNotes();



//SAVE A NEW NOTE

//create and save a note when the save buttton is clicked.
saveBtn.addEventListener("click", function(){

    //read the input values and remove extra spaces.
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();

 //update the date shown in the page header.
    const today = new Date();

    dateElement.textContent = 
    today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    //make sure both fields contian text.
      if(title === "" || text ===""){
        alert("please enter both a title and note.");
        return;
    }


    //crate a new note object and add it to the array.
   
    notes.push({
        title: title,
        text: text,
        favorite: false,
        trashed: false,
        createdAt: new Date().toISOString()
    });

    //save the ipdated array and refresh the page.
    saveNotes();
    renderNotes();

    //clear the inputs after saving 
    noteTitle.value = "";
    noteText.value = "";

    //hide the editor 
    noteEditor.hidden = true;


});

deleteButtons.forEach(function(button){
    button.addEventListener("click", function(){
        button.parentElement.remove();
    });
});


//add a click event to each navigation item.
navItems.forEach(function(item){
    item.addEventListener("click", function(){

        //remove the active style from every navigation item.
        navItems.forEach(function(navItem) {
            navItem.classList.remove("active");
        });

        //highlight the selected navigation item.
        item.classList.add("active");


        //get the page name from the datepage attribute.
        const page = item.dataset.page;

        //update the current page and refresh the notes.
        if(!page){
            return;
        }
        currentPage = page;
        renderNotes();


        //update the section heading.
        if (page === "home") {
            sectionTitle.textContent = "Home";
        } else if (page === "notes") {
            sectionTitle.textContent = "My Notes";
        } else if (page === "favorites") {
            sectionTitle.textContent = "Favorites";
        } else if (page === "trash") {
            sectionTitle.textContent = "Trash";
        }
    });
});


//listen for clicks anywhere in the document.
document.addEventListener("click", function(event) {
    const expandedCard = document.querySelector(".note-card.expanded");

    //stop if no note is expanded.
    if (!expandedCard) {
        return;
    }

    //close the card if the click happeded outside it.
    if (!expandedCard.contains(event.target)) {
        closeExpandedNote();
    }
});



   

