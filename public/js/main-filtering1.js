"use strict";

// Fetch the items from tge JSON file
function loadItems() {
  return fetch("db.json")
    .then((response) => response.json())
    .then((json) => json.items);
}

// Creates HTML element form given item
function createElement(item) {
  const img = document.createElement("img");
  img.setAttribute("class", "item__thumbnail");
  img.setAttribute("src", item.image);

  const span = document.createElement("span");
  span.setAttribute("class", "description");
  span.innerText = `${item.gender},${item.size} size`;

  const li = document.createElement("li");
  li.setAttribute("class", "item");
  li.setAttribute("data-type", item.type);
  li.setAttribute("data-color", item.color);
  li.append(img);
  li.append(span);
  return li;
}
<img class="item__thumbnail" src="<%= item.image %>" alt=""></img>;
// Handle button click
function onButtonClick(event, items) {
  const target = event.target;
  const key = target.dataset.key;
  const value = target.dataset.value;
  if (key == null || value == null) {
    return;
  }
  updateItems(items, key, value);
}

// Make the items matching {key:value} invisible
function updateItmes(items, key, value) {
  items.forEach((item) => {
    if (item.dataset[key] === value) {
      itemclassList.remove("invisible");
    } else {
      item.classList.add("invisible");
    }
  });
}

// Handle button click
loadItems().then((items) => {
  const elements = items.map(createElement);
  const container = document.querySelector(".items");
  container.append(...elements);
  const buttons = document.querySelector(".buttons");
  buttons.addEventListener("click", (event) => onButtonClick(event, elements));
});
