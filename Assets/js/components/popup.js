function togglePopUp(state) {
   //console.log("Being called from " + arguments.callee.caller.name.toString());
   //
   let popup = () => document.getElementById("popup");
   //
   let popupTemplate = /*html*/`
      <div id="popup" class="">
         <div id="popupInner" class="br-5 oFlowYAuto">

         </div>
         <div id="popupOuter" onclick="togglePopUp('close')"></div>
      </div>
   `;
   //
   if (state == "close") {
      //setTimeout(() => popup().remove(), 450);
      popup().remove();
   }
   else if (state == "open") {
      strToDOM(document.body, popupTemplate);
      popup().classList.add("appear");
   }
   else {
      console.log("wrong parameter of popup state!")
   }




}