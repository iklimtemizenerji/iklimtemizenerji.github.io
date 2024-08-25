/*
  <!--İrtibat Kişisi-->
  <div class="inputContainer w-full-sm">
    <p class="fs-1125">İrtibat Kişileri*</p>
    <div class="tagsInput br-5">
      ${tagsInput({options: {
        arrOfOptObjs: [{ value: 'John Doe' }, { value: 'Jane Austin' },{ value: 'Charles Dickens' }]
        },
        name: "testTagsInputu",
        value: "genco|yigiter|bonjour|"
      })}
    </div>
  </div>
*/


function createPill(value) {
  return /*html*/`
    <div class="pill">
      <span>${value.trim()}</span>
      <button onclick="removePill(this)">
        <span class="icon-cross"></span>
      </button>
    </div>`;
}

function removePill(elem) {
  let pill = elem.closest(".pill");
  let valueToRemove = pill.children[0].innerText;
  let realInput = pill.closest(".tagsInput").getElementsByClassName("tagsRealInput")[0];
  //remove pill value from real input 
  let values = realInput.value.split("|");
  let indexOfElemToBeRemoved = values.indexOf(valueToRemove);

  values = [
    ...values.slice(0, indexOfElemToBeRemoved),
    ...values.slice(indexOfElemToBeRemoved + 1)
  ]
  realInput.value = values.join("|");
  //remove pill element
  pill.remove();
  //console.log(realInput.value);
}

function onTagsKeyUp(event) {
  let input = event.target;
  let realInput = input.closest('.tagsInput').getElementsByClassName("tagsRealInput")[0];

  let inputValue = input.value.trim();
  let realInputValue = realInput.value;


  if (event.key == "Enter" &&
    inputValue &&
    inputValue.trim().length
  ) {

    //pass if it is duplicate
    if (realInputValue.indexOf(inputValue) == -1) {
      //value ile pill ekle
      strToDOM(event.target.closest('.tagsInput').getElementsByClassName("container")[0], createPill(input.value));
      input.closest(".inputContainer").scrollIntoView();
      //gerçek inputu güncelle
      realInput.value += input.value.trim() + "|";
    }

    //inputu resetle
    input.value = "";
  }
}

function tagsInput({ options, name, value, className, isRequired }) {

  let pillsTemplate = "";
  if (value) {
    let values = value.slice(0, value.length - 1).split("|");

    values.forEach(val => pillsTemplate += createPill(val));
  }

  let dynamicId = getRandomNum();

  return /*html*/`
    <input type="text" list="${dynamicId}" onkeyup="onTagsKeyUp(event)" class="${className}" />
    <datalist id=${dynamicId}>
      ${options ? toOptions(options.arrOfOptObjs, options.selectedValue) : ""}
    </datalist>
    <div class="container fs-1000">
      ${pillsTemplate ? pillsTemplate : ""}
    </div>
    <!--Real input for forms-->
    <input name=${name} class="displayNone tagsRealInput" value="${value}" ${isRequired ? "required" : ""} />
  `
}