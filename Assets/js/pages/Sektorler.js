//SINGLE SEKTOR COMPONENT
function sektorView(sektorName, sektorId) {
	return /*html*/`<div class="card sektor">
      <p class="sektor-name fs-1000 mb-2vh">${sektorName.tr} (${sektorName.en})</p>
      <div class="wrap">
				<a href="/#AltSektorler?sektorId=${sektorId}&sektorName=${sektorName.tr}" class="btn-0 fs-1000">Alt Sektörler</a>
				<button
					type="button"
					class="btn-0 fs-1125"
					title="Düzenle"
					onclick="sektorlerFormView('sektorAdiGuncelleController', '${sektorId}')"
				>
					<span class="icon-edit"></span>
				</button>
				<button
					title="Sil"
					onclick="msgBox('\\'${sektorName.tr}\\' sektörünü silmek istediğinize emin misiniz? (Alt sektörleri de silinecektir!)', true, ()=>sektorSilController('${sektorId}', '${sektorName.tr}'))"
					type="button"
					class="btn-danger fs-1125"
				>
					<span class="icon-cross"></span>
				</button>
      </div>
   	</div>`;
}

//SEKTÖR EKLE / GÜNCELLE FORM
function sektorlerFormView(callback, sektorId) {


	let sektorData = sektorId ? pages.Sektorler.data.result.find(({ _id }) => _id === sektorId) : null;

	let sektorForm = /*html*/`
		<div class="form oFlowYAuto flex flexColumn fgrow">
			<div class="wrap fgrow ai-start ac-start">
				<!--Sektor Adı (TR)-->
				<div class="inputContainer w-full-sm">
					<p class="fs-1125">Sektör Adı (TR)*</p>
					<input required name="name_tr" type="text" class="br-5 fs-1125" value='${sektorData ? sektorData.name.tr : ""}'/>
				</div>
				<!--Sector Name (EN)-->
				<div class="inputContainer w-full-sm">
					<p class="fs-1125">Sektör Adı (EN)*</p>
					<div class="translateInput br-5">
						${translateInput({ tr: "name_tr", en: "name_en", isRequired: true, value: sektorData ? sektorData.name.en : "" })}
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
					onclick="${callback}(this, '${sektorId}');"
				>
					${sektorId ? "Güncelle" : "Ekle"}
				</button>
			</div>
			
		</div>
	`;
	let contentContainer =
		document.getElementsByClassName("panel-content")[0];
	//
	contentContainer.innerHTML = /*html*/`
		<div class="flex jc-spaceBetween ai-center p-1vh">
			<h2 class="clr0">${sektorId ? "Sektör Düzenleme" : "Sektör Ekleme"}</h2>
			<div class="flex flex-center ai-center">
				<button type="button" class="btn-0 fs-1125" onclick="loadPage('Sektorler')">Geri</button>
			</div>
		</div>
		<hr/>
		${sektorForm}
	`;
	// if (sektorId) {
	// 	//
	// 	let formNode = document.querySelectorAll(".form")[0];
	// 	let formData = pages.Sektorler.data.result

	// 	//
	// 	fillForm(formNode, formData.find(({ _id }) => _id === sektorId))
	// }
}

function yeniSektorEkleController(elem) {

	let form = elem.closest(".form");
	let isFormReady = formCheck(form);


	if (isFormReady) {
		toggleLoader("Yeni sektör ekleniyor...");
		fetch(endPoint + "/sektorler/add", {
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
					msgBox(`Yeni sektör '${data.added.name_tr}' eklendi`, false, null, "success");
					loadPage("Sektorler");
				}
				else {
					msgBox(`Bir hata oldu.`, false, null, "fail");
				}
			})
	}
}

function sektorAdiGuncelleController(elem, sektorId) {
	let form = elem.closest(".form");
	let isFormReady = formCheck(form);

	if (isFormReady) {
		toggleLoader(`Sektör güncelleniyor...`);

		fetch(endPoint + "/sektorler/update/" + sektorId, {
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
					msgBox(`Sektör adı güncellendi.`, false, null, "success");
					loadPage("Sektorler");
				}
				else {
					msgBox(`Bir hata oldu.`, false, null, "fail");
				}
			})
	}
}

//SEKTOR SİLME
function sektorSilController(sektorId, sektorName) {
	toggleLoader(`${sektorName} siliniyor...`)
	fetch(endPoint + "/sektorler/delete/" + sektorId)
		.then(res => res.json())
		.then(data => {
			if (data.deletedCount == 1) {
				toggleLoader();
				msgBox(`Sektör (${sektorName}) silindi.`, false, null, "success");
				loadPage("Sektorler");
			}
			else {
				msgBox(`Bir hata oldu.`, false, null, "fail");
			}
		})
}

//SEKTORLER PAGE
function Sektorler() {
	toggleLoader("Sektörler yükleniyor...");
	fetch(endPoint + "/sektorler/list")
		.then((res) => res.json())
		.then((data) => {

			//sil
			let val = "opt2";
			//

			pages.Sektorler.data = data;

			let sektorlerView = data.result.map((item) => sektorView(item.name, item._id)).join("");

			let contentContainer =
				document.getElementsByClassName("panel-content")[0];
			//
			contentContainer.innerHTML = /*html*/`
				<div class="flex jc-spaceBetween ai-center p-1vh">
					<h2 class="clr0">Sektörler (${data.count})</h2>
					<div class="flex flex-center ai-center">
						<button 
							type="button" 
							class="btn-0 fs-1125" 
							onclick="sektorlerFormView('yeniSektorEkleController')">
							Yeni Ekle
						</button>
					</div>
				</div>
				<hr/>
				<div class="grid grid-325 appear">
					${sektorlerView}
				</div>
			`;
			toggleLoader();
		});
}

//SEKTORLER ROUTER
pages.Sektorler = { link: Sektorler };
pages.Sektorler.link();
