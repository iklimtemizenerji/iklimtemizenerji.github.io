//SINGLE ALTSEKTOR COMPONENT
function altSektorView(altSektor) {
	return /*html*/`
		<div class="card sektor m-1-children">
      <p class="sektor-name fs-1000 mb-1vh">
				${altSektor.name.tr} (${altSektor.name.en})
			</p>
      <div class="wrap">
        <button
					type="button"
					class="btn-0 fs-1125" title="Düzenle"
					onclick="altSektorlerFormView('altSektorGuncelleController','${altSektor._id}')"
				>
					<span class="icon-edit"></span>
				</button>
      	<button
					onclick="msgBox('\\'${altSektor.name.tr}\\' alt sektörünü silmek istediğinize emin misiniz?', true, ()=>altSektorSilController('${altSektor._id}'))"
					type="button"
					class="btn-danger fs-1125" title="Sil"
				>
					<span class="icon-cross"></span>
				</button>
      </div>
   	</div>`;
}

//ALT SEKTÖR EKLE / GÜNCELLE FORM
function altSektorlerFormView(callback, altSektorId) {

	let altSektor = getPageData(altSektorId);

	let altSektorForm = /*html*/`
		<div class="form oFlowYAuto flex flexColumn fgrow">
			<div class="wrap fgrow ai-start ac-start">
				<!--Sektor Adı (TR)-->
				<div class="inputContainer w-full-sm">
					<p class="fs-1125">Alt Sektör Adı (TR)*</p>
					<input required name="name_tr" type="text" class="br-5 fs-1125" value='${altSektorId ? altSektor.name.tr : ""}'/>
				</div>
				<!--Sector Name (EN)-->
				<div class="inputContainer w-full-sm">
					<p class="fs-1125">Alt Sektör Adı (EN)*</p>
					<div class="translateInput br-5">
						${translateInput({ tr: "name_tr", en: "name_en", isRequired: true, value: altSektorId ? altSektor.name.en : "" })}
					</div>
				</div>
			</div>
			<p class="warnArea clr0 br-5 p-1vh fs-1125"></p>
			<div class="mb-1vh flexCenter">
				<!--
				<button 
					type="submit" 
					class="btn-submit fs-1250 m-1vh min-width-300 jc-center w-full-sm">
					Ekle
				</button>
				-->
				<button 
					type="submit" 
					class="btn-submit fs-1250 flexCenter m-auto mt-1vh min-width-300" 
					onclick="${callback}(this, '${altSektorId}');"
				>
					${altSektorId ? "Güncelle" : "Ekle"}
				</button>
			</div>
			
		</div>
	`;
	let contentContainer =
		document.getElementsByClassName("panel-content")[0];
	//
	contentContainer.innerHTML = /*html*/`
		<div class="flex jc-spaceBetween ai-center p-1vh">
			<h2 class="clr0">
				${altSektorId ? "Alt Sektör Düzenle" : "Yeni Alt Sektör Ekle"}
			</h2>
			<div class="flex flex-center ai-center">
				<button type="button" class="btn-0 fs-1125" onclick="applyUrl()">
					Geri
				</button>
			</div>
		</div>
		<hr/>
		${altSektorForm}
	`;
	// if (sektorId) {
	// 	//
	// 	let formNode = document.querySelectorAll(".form")[0];
	// 	let formData = pages.Sektorler.data.result

	// 	//
	// 	fillForm(formNode, formData.find(({ _id }) => _id === sektorId))
	// }
}

function yeniAltSektorEkleController(elem) {
	let form = elem.closest(".form");
	let isFormReady = formCheck(form);

	if (isFormReady) {
		toggleLoader("Yeni alt sektör ekleniyor...");
		fetch(endPoint + `/altSektorler/add/${getParams().sektorId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(getFormState(form).currentFormBody)
		})
			.then(res => res.json())
			.then(data => {
				if (data.msg.acknowledged) {
					toggleLoader();
					msgBox(`Yeni alt sektör (${data.added.name_tr}) eklendi.`, false, null, "success");
					loadPage("AltSektorler", { sektorId: getParams().sektorId, sektorName: getParams().sektorName });
				}
				else {
					msgBox(`Bir hata oldu.`, false, null, "fail");
				}
			})
	}
}

function altSektorGuncelleController(elem, altSektorId) {
	//
	let form = elem.closest(".form");
	let isFormReady = formCheck(form);

	if (isFormReady) {
		toggleLoader(`Alt Sektör güncelleniyor...`);
		fetch(endPoint + `/altSektorler/update/${altSektorId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "PATCH",
			body: JSON.stringify(getFormState(form).currentFormBody)
		})
			.then(res => res.json())
			.then(data => {
				if (data.msg.acknowledged) {
					toggleLoader();
					msgBox(`Alt sektör güncellendi.`, false, null, "success");
					applyUrl();
				}
				else {
					msgBox(`Bir hata oldu.`);
				}
			})
	}
}

//SEKTOR SİLME
function altSektorSilController(altSektorId) {
	toggleLoader(`Alt Sektör siliniyor...`)
	fetch(endPoint + "/altSektorler/delete/" + altSektorId)
		.then(res => res.json())
		.then(data => {
			if (data.deletedCount == 1) {
				toggleLoader();
				msgBox(`Alt sektör silindi.`, false, null, "success");
				loadPage("AltSektorler", { sektorId: getParams().sektorId, sektorName: getParams().sektorName });
			}
			else {
				msgBox(`Bir hata oldu.`);
			}
		})
}

//PAGE
function AltSektorler() {
	toggleLoader(`${getParams().sektorName} alt sektörleri yükleniyor...`);
	//
	fetch(`${endPoint}/altSektorler/list/${getParams().sektorId}`)
		.then((res) => res.json())
		.then((data) => {

			pages.AltSektorler.data = data;

			let altSektorlerView = data.result.map((altSektor) => altSektorView(altSektor)).join("");

			let contentContainer =
				document.getElementsByClassName("panel-content")[0];
			//
			contentContainer.innerHTML = /*html*/`
					<div class="flex jc-spaceBetween ai-center p-1vh">
						<h2 class="clr0">${getParams().sektorName} (${data.count})</h2>
						<div class="flex">
							<a class="btn-0 fs-1125 mr-1vh" href="/#Sektorler">Geri</a>
							<button type="button" class="btn-0 fs-1125" onclick="altSektorlerFormView('yeniAltSektorEkleController')">Yeni Ekle</button>
						</div>
					</div>
					<hr/>
					<div class="grid grid-325 appear">
						${altSektorlerView}
					</div>
	`;
			toggleLoader();
		});
}

//ALT SEKTORLER ROUTER
pages.AltSektorler = {
	...pages.AltSektorler,
	link: AltSektorler
}
//
pages.AltSektorler.link();
//altSektorlerFormView()