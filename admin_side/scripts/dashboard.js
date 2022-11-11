import { deactiveLinks, hidePages } from "./func.js";

// Toggle Pages

const link_items = document.querySelectorAll(".link_item");
let pages = document.querySelectorAll(".page");

link_items.forEach((el, i) => {
  el.addEventListener("click", function () {
    hidePages(pages);
    pages[i].classList.add("active");
    deactiveLinks(link_items);
    el.classList.add("link_active");
  });
});

const getProductData = async (cat) => {
  localStorage.setItem("active_cat", cat);
  try {
    let res = await fetch(`http://localhost:3000/${cat}`);
    let data = await res.json();

    console.log(data);
    appendProducts(data, cat);
  } catch (err) {}
};

getProductData("skincare");

const appendProducts = (data, cat) => {
  document.getElementById("product_tbody").innerHTML = "";
  data.forEach(({ id, image, productName, quantity, price, active }) => {
    let tr = document.createElement("tr");

    let img_td = document.createElement("td");
    let img = document.createElement("img");
    img.src = image;
    img_td.append(img);

    let name = document.createElement("td");
    name.innerText = productName;

    let inventory = document.createElement("td");
    let inv_span = document.createElement("span");
    inv_span.innerText = quantity;
    let inv_icon = document.createElement("i");
    inv_icon.classList.add("fa-solid", "fa-pencil", "edit_icon");
    inventory.append(inv_span, inv_icon);

    // adding EventListner
    inv_icon.onclick = (e) => {
      let new_quantity = +prompt("Enter New Quantity");
      if (new_quantity == 0) return;
      updateInvetory(id, cat, new_quantity);
      e.target.previousSibling.innerText = new_quantity;
    };

    let pri = document.createElement("td");
    let pri_span = document.createElement("span");
    pri_span.innerText = price;
    let pri_icon = document.createElement("i");
    pri_icon.classList.add("fa-solid", "fa-pencil", "edit_icon");
    pri.append(pri_span, pri_icon);
    pri_icon.onclick = (e) => {
      let new_price = +prompt("Enter New Amount");
      if (new_price == 0) return;
      updatePrice(id, cat, new_price);
      e.target.previousSibling.innerText = new_price;
    };

    let status = document.createElement("td");
    let btn = document.createElement("button");
    if (active) {
      btn.classList.add("status_active");
      btn.innerText = "Active";
    } else {
      btn.classList.add("status_inactive");
      btn.innerText = "Inactive";
    }
    status.append(btn);
    btn.onclick = (e) => {
      updateActive(id, cat, btn.innerText);
      if (e.target.innerText == "Active") {
        e.target.classList.add("status_inactive");
        e.target.innerText = "Inactive";
      } else {
        e.target.classList.add("status_active");
        e.target.innerText = "Active";
      }
    };

    // <i class="fa-solid fa-trash-can"></i>
    let del = document.createElement("td");
    let del_icon = document.createElement("i");
    del_icon.classList.add("fa-solid", "fa-trash-can", "del_icon");
    del.append(del_icon);
    del_icon.onclick = (e) => {
      if (confirm("Press Ok! to Remove")) {
        console.log("OK!");
        removeProduct(id, cat);
        e.target.parentNode.parentNode.remove();
      }
    };

    tr.append(img_td, name, inventory, pri, status, del);
    document.getElementById("product_tbody").append(tr);
  });
};

//update Inventory
const updateInvetory = async (id, cat, new_quantity) => {
  let data = {
    quantity: new_quantity,
  };

  let res = await fetch(`http://localhost:3000/${cat}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  alert("Inventory Updated");
};

//update Price
const updatePrice = async (id, cat, new_price) => {
  let dataToSent = {
    price: new_price,
  };
  let res = await fetch(`http://localhost:3000/${cat}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dataToSent),
    headers: {
      "Content-type": "application/json",
    },
  });
  alert("Price Updated");
};

//update active: true||false
const updateActive = async (id, cat, btn_text) => {
  if (btn_text == "Active") {
    let dataToSend = {
      active: false,
    };
    let res = await fetch(`http://localhost:3000/${cat}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-type": "application/json",
      },
    });
    let data = await res.json();
  } else {
    let dataToSend2 = {
      active: true,
    };
    let resagain = await fetch(`http://localhost:3000/${cat}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dataToSend2),
      headers: {
        "Content-type": "application/json",
      },
    });
    let data2 = await resagain.json();
  }
  // console.log(btn_text);
};

//remove Products
const removeProduct = async (id, cat) => {
  let res = await fetch(`http://localhost:3000/${cat}/${id}`, {
    method: "DELETE",
  });
  alert("Product Deleted!");
};

//Handling category Buttons
//skincare Products
let cat_btns = document.querySelectorAll(".cat_btn");

let skincare = document.getElementById("skin_btn");
skincare.onclick = () => {
  deactiveLinks(cat_btns);
  skincare.classList.add("link_active");
  getProductData("skincare");
};
//fragrance products
let fragrance = document.getElementById("frag_btn");
fragrance.onclick = () => {
  deactiveLinks(cat_btns);
  fragrance.classList.add("link_active");
  getProductData("fragrance");
};
//hair products
let hair = document.getElementById("hair_btn");
hair.onclick = () => {
  deactiveLinks(cat_btns);
  hair.classList.add("link_active");
  getProductData("hair");
};
//lipstick products
let lipstick = document.getElementById("lip_btn");
lipstick.onclick = () => {
  deactiveLinks(cat_btns);
  lipstick.classList.add("link_active");
  getProductData("lipstick");
};

// Handling Filter
let filter_Prods = document.getElementById("filter_Prod");
filter_Prods.onchange = () => {
  let inputVal = filter_Prods.value;
  if (inputVal == "active") {
    handle_filter("active", true);
  } else if (inputVal == "inactive") {
    handle_filter("active", false);
  } else if (inputVal == "999") {
    handle_filter("price_lte", 999);
  } else if (inputVal == "1499") {
    handle_filter("price_lte", 1499);
  } else if (inputVal == "1999") {
    handle_filter("price_gte", 1999);
  }
};

// Handling Filter main function
const handle_filter = async (query, value) => {
  let active_cat = localStorage.getItem("active_cat");
  let res = await fetch(
    `http://localhost:3000/${active_cat}?${query}=${value}`
  );
  let data = await res.json();
  appendProducts(data, active_cat);
};

// Handling sorting

let sort_Prods = document.getElementById("sort_Prod");
sort_Prods.onchange = () => {
  let inputVal = sort_Prods.value;
  if (inputVal == "asc") {
    sort_handle("price", "asc");
  } else if (inputVal == "desc") {
    sort_handle("price", "desc");
  }
};
const sort_handle = async (query, value) => {
  let active_cat = localStorage.getItem("active_cat");
  let res = await fetch(
    `http://localhost:3000/${active_cat}?_sort=${query}&_order=${value}`
  );
  let data = await res.json();
  appendProducts(data, active_cat);
};

// login and logout function
let admin_login = JSON.parse(sessionStorage.getItem("Admin-login"));
let Admin_icon_div = document.getElementById("admin_icon_div");
let Admin_details = document.getElementById("admin_details");
Admin_icon_div.onclick = () => {
  if (Admin_details.style.display == "none") {
    Admin_details.style.display = "block";
  } else {
    Admin_details.style.display = "none";
  }
};
document.addEventListener("click", function (event) {
  if (event.target == Admin_icon_div) {
    return;
  }
  Admin_details.style.display = "none";
});

let admin_email_display = document.querySelector("#admin_email_div>p");
admin_email_display.innerText = admin_login[0];

let admin_logout = document.querySelector("#admin_logout_div>p");
admin_logout.onclick = () => {
  sessionStorage.removeItem("Admin-login");
  location.href = "../admin-side-login/Admin-signin.html";
};
console.log(admin_login[0]);
