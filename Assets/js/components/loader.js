{
	let loaderTemplate = /*html*/`
      <div id="loader" class="hidden">
        <!-- <div id="loader-inner"></div> -->
				<span class="leaf">🍃</span>
				<p id="loader-msg"></p>
      </div>
   `;

	strToDOM(document.body, loaderTemplate);
}

function toggleLoader(msg) {
	//console.log("Being called from " + arguments.callee.caller.name.toString());
	toggleItem(loader);
	document.getElementById("loader-msg").innerText = msg;
}
//toggleLoader("Hello")
