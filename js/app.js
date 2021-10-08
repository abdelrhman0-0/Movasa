/************* Assigning Global Variables ***************/
let myData = [];
let dataAfterSearch = [];
const myRow = document.getElementById("myRow");
const btns = document.querySelectorAll("#home .btn");
const openBtn = $(".fa-align-justify");
const closeBtn = $(".fa-times");
const sideBar = $("#side-bar");
const lists = $("#side-bar li");
const anchors = $("#side-bar li a");
const hideSideWidth = $(".hide-side").outerWidth(true);
const searchMoviesInput = $("#search-by-movies");
const searchInput = $("#general-search");
const contactInputs = document.querySelectorAll("#contact-us input");
const inputsAlert = document.querySelectorAll(".alert");
const submitBtn = document.getElementById("submit-btn");

/************* General Changes ***************/
$(btns).css({ opacity: "0", transition: "0.7s" });
lists.css({
  transform: "translateY(400%)",
  opacity: "0",
  transition: "all 0.4s",
});
sideBar.css({ left: -hideSideWidth }, 1000);

$(window).ready(function () {
  $("#loading-screen .img").fadeOut(1000, () => {
    $("#loading-screen").fadeOut(1000, () => {
      $("body").css("overflow-y", "auto");
      $("#loading-screen").remove();
    });
  });
});

/************* Start the Validation  ***************/
// Validation global variables
const nameRegex = /^[a-zA-Z]{1,}$/;
const emailRegex = /@[a-z]{4,8}\.[a-z]{2,}$/;
const phoneRegex = /^(\+2)?(01)(0|1|2|5)[0-9]{8}$/;
const ageRegex = /^[1-9][0-9]?$/;
const passRegex = /(?=.*\d)(?=.*[a-z])(\w+){8,}/;
const typeArr = [nameRegex, emailRegex, phoneRegex, ageRegex, passRegex];

//Validation functions
function check(type, index) {
  let inputValue = contactInputs[index].value;
  if (type.test(inputValue) && inputValue != "") {
    inputsAlert[index].classList.add("d-none");

    return true;
  } else {
    inputsAlert[index].classList.remove("d-none");

    return false;
  }
}

function checkPassRewrite() {
  let passInputValue = contactInputs[4].value;
  let passRewriteInputValue = contactInputs[5].value;
  if (passRewriteInputValue == passInputValue && passRewriteInputValue != "") {
    inputsAlert[5].classList.add("d-none");
    return true;
  } else {
    inputsAlert[5].classList.remove("d-none");
    return false;
  }
}

function checkAllInputs() {
  if (
    check(typeArr[0], 0) &&
    check(typeArr[1], 1) &&
    check(typeArr[2], 2) &&
    check(typeArr[3], 3) &&
    check(typeArr[4], 4) &&
    checkPassRewrite()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "true");
  }
}

// Validation Event
for (
  let i = 0, n = 0;
  i < contactInputs.length, n <= typeArr.length;
  n++, i++
) {
  contactInputs[i].addEventListener("keyup", () => {
    if (n < typeArr.length) {
      check(typeArr[n], i);
    } else {
      checkPassRewrite();
    }
    checkAllInputs();
  });
}

/************* Finish the Validation  ***************/
/************* Start Home Functions  ***************/

async function getData(cd = "now_playing", type = "movie", q = "") {
  let url = `https://api.themoviedb.org/3/${type}/${cd}?api_key=c1036a1af34f090f11514a258b4724cf${q}`;

  let res = await fetch(url);
  let data = await res.json();
  myData = data.results;
  display();
}

async function search() {
  if (searchMoviesInput.val() == "") {
    getData("now_playing", "movie");
  } else {
    getData("multi", "search", `&query=${searchMoviesInput.val()}`);
  }
}

/* Searching in myData array for our input value
and push it in anther array and call display(with the new Data array)*/
function searchInThisPage() {
  let searchValue = searchInput.val();
  dataAfterSearch = [];
  myData.forEach((data) => {
    if (data.title.toLowerCase().includes(searchValue.toLowerCase())) {
      dataAfterSearch.push(data);
      display(dataAfterSearch);
    }
  });
}

function display(arr = myData) {
  let rows = "";
  for (let data of arr) {
    if (data.title == undefined) {
      rows += `<div class="col-lg-4 col-md-6 p-3">
        <div class = "item-col">
            <img class = "w-100 mb-2" src = https://image.tmdb.org/t/p/w500${data.poster_path}>
            <div class = "item-details ">
                <h4 class = "py-4">${data.name}</h2>
                <p class = "p-3">${data.overview}</p>
                <p class="py-1">Rate : ${data.vote_average} </p>
                <p>Date : ${data.release_date}</p>
            </div>
            
        </div>
    </div>`;
    } else {
      rows += ` <div class="col-lg-4 col-md-6 p-3">
            <div class = "item-col">
                <img class = "mb-2" src = https://image.tmdb.org/t/p/w500${data.poster_path}>
                    <div class = "item-details ">
                        <h4 class = "py-4">${data.title}</h2>
                        <p class = "p-3">${data.overview}</p>
                        <p class="py-1">Rate : ${data.vote_average} </p>
                        <p>Date : ${data.release_date}</p>
                        
                    </div>
                
            </div>
        </div>`;
    }
  }
  myRow.innerHTML = rows;
}
/************* Finish Home Functions  ***************/
/************* Start Events ***************/

searchMoviesInput.keyup(search);
searchInput.keyup(searchInThisPage);

// Call getData function when we click on side bar buttons
for (let anchor of anchors) {
  anchor.addEventListener("click", (e) => {
    let extension = e.target.innerHTML.toLowerCase().split(" ");
    if (extension.length < 2) {
      if (extension[0] == "trending") {
        getData("all/week", `${extension[0]}`);
        $(btns).css({ opacity: "1" });
      } else {
        getData(extension[0]);
        $(btns).css({ opacity: "0" });
      }
    } else {
      getData(`${extension[0]}_${extension[1]}`);
      $(btns).css({ opacity: "0" });
    }
  });
}

/*Call getData function when we click on Trending button to show the other buttons
and choose the category by clicking the button */
for (let btn of btns) {
  btn.addEventListener("click", (e) => {
    let extension = e.target.innerHTML.toLowerCase();
    getData(`${extension}/week`, "trending");
  });
}

openBtn.click(() => {
  sideBar.animate({ left: 0 }, 1000, () => {
    // What is going on here is we animate all the lists in the side bar
    for (let i = 0, s = 100; i < lists.length; i++, s += 100) {
      setTimeout(() => {
        lists.eq(i).css({
          transform: "translateY(0)",
          opacity: "1",
          transition: "all 0.4s",
        });
      }, s);
    }
  });

  // Hiding the side bar open icon and show close icon
  openBtn.hide(() => {
    closeBtn.show();
  });
  //Change sidebar photo
  $(".logo img").attr("src", "imgs/PngItem_791151.png");
});

closeBtn.click(() => {
  // Resetting all effects that happened when we opened the side bar
  sideBar.animate({ left: -hideSideWidth }, 1000, () => {
    lists.css({
      transform: "translateY(400%)",
      opacity: "0",
      transition: "all 0.4s",
    });
  });
  closeBtn.hide(100, () => {
    openBtn.show(100);
  });

  //Reset sidebar photo
  $(".logo img").attr("src", "imgs/pngwing.com.png");
});

/************* Finish Events  ***************/
/************* Start Calling Functions  ***************/
getData();
