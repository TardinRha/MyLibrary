let myLibrary = [];

const buttonEnviar = document.getElementById("addBook");
buttonEnviar.addEventListener("click", addBookToLibrary);

class Book {
    constructor(title, author, pages, statusRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.statusRead = statusRead;
        this.info = function () {
            return `${title} by ${author}, ${pages} pages, ${statusRead}.`;
        };
    }
}

function addBookToLibrary(event){
    event.preventDefault();

    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let statusRead = getSelectStatus();

    const newBook = new Book(title, author, pages, statusRead);
    myLibrary.push(newBook);
    
    saveInLocalStorage();
    generateBookElementsByMylibrary();
}

function getSelectStatus(){
    //pega todos os elementos de input do tipo radio com o nome "status"
    const radioButtons = document.querySelectorAll('input[name="status"]');
    console.log(radioButtons);

    for(let i = 0; i < radioButtons.length; i++){
        if(radioButtons[i].checked){
            return radioButtons[i].value;
        }
    }
}

function generateBookElementsByMylibrary(){
    let bodyTable = document.getElementById("bodyTable");
    bodyTable.textContent = "";

    for(let i = 0; i < myLibrary.length; i++){
        let linha = document.createElement("tr");

        const titleCel = document.createElement("td");
        const authorCel = document.createElement("td");
        const pagesCel = document.createElement("td");
        const statusCel = document.createElement("td");
        const editBookCel = document.createElement("td");

        titleCel.textContent = myLibrary[i].title;
        authorCel.textContent = myLibrary[i].author;
        pagesCel.textContent = myLibrary[i].pages;
        statusCel.textContent = myLibrary[i].statusRead;

        const deleteItem = document.createElement("button");
        deleteItem.textContent = "Delete";
        deleteItem.name = "delete";
        deleteItem.addEventListener("click", () => deleteLine(i, bodyTable, linha));

        const editItem = document.createElement("button");
        editItem.textContent = "Edit";
        editItem.name = "edit";
        editItem.addEventListener("click", () => editLine(i, linha));

        editBookCel.appendChild(editItem);
        editBookCel.appendChild(deleteItem);

        linha.appendChild(titleCel);
        linha.appendChild(authorCel);
        linha.appendChild(pagesCel);
        linha.appendChild(statusCel);
        linha.appendChild(editBookCel);
        
        bodyTable.appendChild(linha);
    }
}

function deleteLine(index, bodyTable, linha){
    myLibrary.splice(index, 1);
    bodyTable.removeChild(linha);
    saveInLocalStorage();
}

function editLine(index, linha){
    let divEdit = document.createElement("div");
    divEdit.id = "divEdit";
    divEdit.className = "div-edit";

    let formEdit = document.createElement("form");
    formEdit.id = "formEdit";

    const labelTitle = document.createElement("label");
    labelTitle.textContent = "Title:";

    let inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.value = myLibrary[index].title;

    const labelAuthor = document.createElement("label");
    labelAuthor.textContent = "Author:";

    let inputAuthor = document.createElement("input");
    inputAuthor.name = "inputAuthor"
    inputAuthor.type = "text";
    inputAuthor.value = myLibrary[index].author;

    const labelPages = document.createElement("label");
    labelPages.textContent = "Pages:";

    let inputPages = document.createElement("input");
    inputPages.type = "text";
    inputPages.value = myLibrary[index].pages;

    let inputStatusLido = document.createElement("input");
    inputStatusLido.type = "radio";
    inputStatusLido.name = "status";
    inputStatusLido.value = "Read";
    inputStatusLido.id = "statusLido";
    
    const labelStatusLido = document.createElement("label");
    labelStatusLido.innerHTML = "Read";
    labelStatusLido.setAttribute("for", "statusLido");
    
    let inputStatusNaoLido = document.createElement("input");
    inputStatusNaoLido.type = "radio";
    inputStatusNaoLido.name = "status";
    inputStatusNaoLido.value = "Not Read";
    inputStatusNaoLido.id = "statusNaoLido";
    
    const labelStatusNaoLido = document.createElement("label");
    labelStatusNaoLido.innerHTML = "Not Read";
    labelStatusNaoLido.setAttribute("for", "statusNãoLido");

    const saveEditButton = document.createElement("button");
    saveEditButton.textContent = "Salvar";
    saveEditButton.addEventListener("click", (ev) => {
        ev.preventDefault();
        saveEdit(index, inputTitle, inputAuthor, inputPages, inputStatusLido, inputStatusNaoLido );
        generateBookElementsByMylibrary();
    });

    labelStatusLido.appendChild(inputStatusLido);
    labelStatusNaoLido.appendChild(inputStatusNaoLido);

    formEdit.appendChild(labelTitle);
    formEdit.appendChild(inputTitle);
    formEdit.appendChild(labelAuthor);
    formEdit.appendChild(inputAuthor);
    formEdit.appendChild(labelPages);
    formEdit.appendChild(inputPages);
    formEdit.appendChild(labelStatusLido);
    formEdit.appendChild(labelStatusNaoLido);
    formEdit.appendChild(saveEditButton);

    divEdit.appendChild(formEdit);
    linha.appendChild(divEdit);
}

function saveEdit(index, inputTitle, inputAuthor, inputPages, inputLido, inputNaoLido){
    myLibrary[index].title = inputTitle.value;
    myLibrary[index].author = inputAuthor.value;
    myLibrary[index].pages = inputPages.value;
    myLibrary[index].statusRead = inputLido.checked ? inputLido.value : inputNaoLido.value;
    saveInLocalStorage();
}

const buttonDeleteLista = document.getElementById("clearBooks");
buttonDeleteLista.addEventListener("click", clearBooks);

function clearBooks(){
    myLibrary.values = "";
    saveInLocalStorage();
}

function saveInLocalStorage(){
    let libraryJSON = JSON.stringify(myLibrary);
    localStorage.setItem("books", libraryJSON);
    // chamado nas funcoes deleteLine, editLine, addBook e clearBooks
}

function getInLocalStorage(){
    let libraryJSON = localStorage.getItem("books");
    let libraryOBJ = JSON.parse(libraryJSON);
    if(libraryJSON === null){
        myLibrary = [];
        return;
    }
    myLibrary = libraryOBJ;
}

getInLocalStorage();
generateBookElementsByMylibrary();