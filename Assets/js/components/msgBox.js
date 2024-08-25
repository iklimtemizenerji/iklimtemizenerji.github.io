function msgBox(msg, shouldUserConfirm, callback, type) {

   function typeToIcon(type) {
      let types = {
         success: "<span class='icon-check clr-success'></span>",
         info: "<span class='emoji-info'></span>",
         warn: "<span class='emoji-warn'></span>",
         fail: "<span class='emoji-fail'></span>"
      }

      return types[type];
   }


   let msgBoxTemplate = "";

   if (shouldUserConfirm) {
      msgBoxTemplate = /*html*/`
            <p class="clr0 textAlignCenter fs-1125">${msg ? msg : ""} ${typeToIcon("warn")}</p>
            <div class="msgBoxButtonsContainer">
               <button 
                  class="btn-0 fs-1125 jc-center" 
                  onclick="(${callback})(); togglePopUp('close')"
               >Tamam</button>
               <button class="btn-danger fs-1125 jc-center" onclick="togglePopUp('close')">İptal</button>         
            </div>
   `;
   }
   else {
      msgBoxTemplate = /*html*/`
            <p class="clr0 textAlignCenter fs-1125">${msg ? msg : ""} ${typeToIcon(type)}</p>
            <div class="msgBoxButtonsContainer">
               <button type="button" class="btn-0 fs-1125 jc-center" onclick="togglePopUp('close')">Tamam</button>         
            </div>
   `;
   }
   togglePopUp("open");
   strToDOM(document.getElementById("popupInner"), msgBoxTemplate);
   document.getElementById("popupInner").getElementsByTagName("button")[0].focus();
}