// Select Variables
let container = document.querySelector(".container");
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let totalSpan = document.querySelector(".price .total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let search = document.getElementById("search");
let searchByTitle = document.querySelector(".by-title");
let searchByCategory = document.querySelector(".by-category");
let deleteAllBtn = document.querySelector(".delete-all");
let tbody = document.querySelector(".tbody");

let storageArray = [];

if(localStorage.getItem("items")){
    storageArray = JSON.parse(localStorage.getItem("items"));
    deleteAllBtn.style.display = "block";
    deleteAllBtn.textContent = `Delete All (${storageArray.length})`;
}

getFromLocalStorage();

window.oninput = calcTotal;

// Search
searchByTitle.onclick = function(){
    search.disabled = false;
    search.focus();
    search.placeholder = "Search By Title";
    searchData("title");
}
searchByCategory.onclick = function(){
    search.disabled = false;
    search.focus();
    search.placeholder = "Search By Category";
    searchData("category");
}

// Press on the create button
window.addEventListener("click", (e) => {
    // Press on the create button and here it creates elements
    if(e.target.id === "create"){
        if(title.value != "" && price.value != "" && taxes.value != "" && ads.value != "" && category.value != ""){
            addToStorageArray();
            deleteAllBtn.style.display = "block";
            deleteAllBtn.textContent = `Delete All (${storageArray.length})`;
            title.value = "";
            price.value = "";
            taxes.value = "";
            ads.value = "";
            calcTotal();
            discount.value = "";
            count.value = "";
            category.value = "";
        }        
    }
    else if(e.target.id === "update-element"){
        // Press on the create button and here it updates an element
        Array.from(tbody.children).forEach(tr => {
            if(tr.classList.contains("on-update")){
                let index = Array.from(tbody.children).indexOf(tr);
                storageArray[index].myTitle = title.value;
                storageArray[index].myPrice = price.value;
                storageArray[index].myTaxes = taxes.value;
                storageArray[index].myAds = ads.value;
                storageArray[index].myDiscount = discount.value;
                storageArray[index].myTotal = calcTotal();
                storageArray[index].myCategory = category.value;
            }
        });
        createElements(storageArray);
        addToLocalStorage(storageArray);

        title.value = "";
        price.value = "";
        taxes.value = "";
        ads.value = "";
        calcTotal();
        discount.value = "";
        count.value = "";
        category.value = "";
        
        document.querySelector(".create").textContent = "Create";
        document.querySelector(".create").id = "create";
        count.disabled = false;
    }
});

// Press on the Delete All button
window.addEventListener("click", (e) => {
    if(e.target.className === "delete-all"){
        tbody.innerHTML = "";
        e.target.style.display = "none";
        localStorage.clear();
    }
});

// Press on the update button within an element
window.addEventListener("click", (e) => {
    if(e.target.getAttribute("id") === "update"){
        storageArray.forEach(element => {
            if(element.id == Number(e.target.parentElement.parentElement.children[0].textContent) - 1){
                title.value = element.myTitle;
                price.value = element.myPrice;
                taxes.value = element.myTaxes;
                ads.value = element.myAds;
                discount.value = element.myDiscount;
                category.value = element.myCategory;
                calcTotal();
                e.target.parentElement.parentElement.classList.add("on-update");
                document.querySelector(".create").textContent = "Update";
                document.querySelector(".create").id = "update-element";
                count.disabled = true;
                scroll({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });
    }
});

// Press on the delete button within an element
window.addEventListener("click", (e) => {
    if(e.target.getAttribute("id") === "delete"){
        storageArray.forEach(element => {
            if(element.id == Array.from(tbody.children).indexOf(e.target.parentElement.parentElement)){
                storageArray.splice(storageArray.indexOf(element), 1);
                for(let i = element.id; i < storageArray.length; i++){
                    storageArray[i].id--;
                }
                createElements(storageArray);
                addToLocalStorage(storageArray);
            }
        });
    }
});

function calcTotal(){
    if(price.value != "" && taxes.value != "" && ads.value != ""){
        let total = +price.value + +taxes.value + +ads.value - +discount.value;
        totalSpan.innerHTML = `Total: ${total}`;
        totalSpan.style.backgroundColor = "green";       
        return total;
    } else {
        totalSpan.innerHTML = "Total: ";
        totalSpan.style.backgroundColor = "red";        
    }
}

function addToStorageArray(){
    if(discount.value === ""){
        discount.value = "0";
    }
    let counter;
    if(count.value === "" || count.value === "1"){
        counter = 1;
    } else {
        counter = Number(count.value);
    }

    for(let i = 0; i < counter; i++){
        let item = {
            id: storageArray.length,
            myTitle: title.value,
            myPrice: price.value, 
            myTaxes: taxes.value,
            myAds: ads.value,
            myDiscount: discount.value,
            myTotal: calcTotal(),
            myCategory: category.value
        };
        storageArray.push(item);
    }

    createElements(storageArray);
    addToLocalStorage(storageArray);
}

function createElements(arr){
    tbody.innerHTML = "";
    arr.forEach(element => {
        let tr = document.createElement("tr");
            tr.innerHTML = `<td>${arr.indexOf(element) + 1}</td>
                            <td>${element.myTitle}</td>
                            <td>${element.myPrice}</td>
                            <td>${element.myTaxes}</td>
                            <td>${element.myAds}</td>
                            <td>${element.myDiscount}</td>
                            <td>${element.myTotal}</td>
                            <td>${element.myCategory}</td>
                            <td><button id="update">Update</button></td>
                            <td><button id="delete">Delete</button></td>`;
                            tbody.append(tr);
    });
}

function addToLocalStorage(arr){
    window.localStorage.setItem("items", JSON.stringify(arr));
}

function getFromLocalStorage(){
    let data = window.localStorage.getItem("items");
    if(data){
        let items = JSON.parse(data);
        createElements(items);
    }
}

function searchData(item){
    if(item === "title"){
        let titles = [];
        for(let i = 0; i < storageArray.length; i++){
            titles.push(storageArray[i].myTitle);
        }
        search.oninput = function(){
            for(let j = 0; j < titles.length; j++){
                if(titles[j].toLowerCase().includes(search.value.toLowerCase())){
                    tbody.children[j].style.display = "table-row";
                } else {
                    tbody.children[j].style.display = "none";
                }
            }
        }
    } else {
        let categories = [];
        for(let i = 0; i < storageArray.length; i++){
            categories.push(storageArray[i].myCategory);
        }
        search.oninput = function(){
            for(let j = 0; j < categories.length; j++){
                if(categories[j].toLowerCase().includes(search.value.toLowerCase())){
                    tbody.children[j].style.display = "table-row";
                } else {
                    tbody.children[j].style.display = "none";
                }
            }
        }
    }
}