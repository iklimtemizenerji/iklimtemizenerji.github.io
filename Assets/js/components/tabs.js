{/* <div class="tabs">
  <div class="wrap tabs-head" onclick="tabs(event, 'btn-empty', 'btn-0')">
    <button class="fs-125 btn-0">Tab 1</button>
    <button class="fs-125 btn-empty">Tab 2</button>
    <button class="fs-125 btn-empty">Tab 3</button>
  </div>
  <div class="tabs-body clr0">
    <div>Content 1</div>
    <div>Content 2</div>
    <div>Content 3</div>
  </div>
</div> */}

function tabs(event, passive, active) {

  let buttonClicked = event.target;

  //
  let tabs = buttonClicked.closest(".tabs");
  let buttonContainer = tabs.getElementsByClassName("tabs-head")[0];
  let tabButtons = [...buttonContainer.children].filter(item => !item.classList.contains("noTabsButton"));
  //
  let contentContainer = tabs.getElementsByClassName("tabs-body")[0];
  let index = tabButtons.indexOf(buttonClicked);
  //
  if (buttonClicked.classList.contains("noTabsButton") || !tabButtons.includes(buttonClicked)) {
    return;
  }
  //update buttons state
  tabButtons.forEach(btn => {
    btn.classList.replace(active, passive);
  });
  tabButtons[index].classList.replace(passive, active);
  contentContainer.children[index].scrollIntoView({ block: "center", behavior: "smooth" })
}