loadResource("script", "./Assets/js/components/tagsInput.js")


//SINGLE EYLEM COMPONENT
function eylemView(id, kodu = "", adi = "", secapYsep = "", yetki = "", energySavingsMWh = "", renEnergyProdMWh = "", toplamAzaltimCO2eTon = "", mevcutYapilanlar = ""
) {

	let eylemlerFeVals = {
		secapYsep: "SECAP / YŞEP",
		secap: "SECAP",
		ysep: "YŞEP",
		belediyeKent: "Belediye / Kent",
		belediye: "Belediye",
		kent: "Kent",
	}


	return /*html*/`
	<div class="card">
		<!--Eylem Adı-->
    <div class="tabs">
			<div class="flex w-full-children-sm ai-center jc-spaceBetween">
				<div class="wrap w-full-children-sm tabs-head" onclick="tabs(event, 'btn-1', 'btn-0')">
					<button class="fs-875 btn-0">${kodu}</button>
					<button class="fs-875 btn-1">Bilgiler</button>
					<button class="fs-875 btn-1">Faydaları</button>
					<button class="fs-875 btn-1">Mevcut Yapılanlar</button>
					<div class="flex">
						<!--Düzenle-->
						<button class="fgrow fs-875 btn-1 noTabsButton" title="Düzenle" onclick="eylemlerFormView('eylemGuncelleController', '${id}')">
							<span class="icon-edit"></span>
						</button>
						<!--Sil-->
						<button class="fgrow ml-1vh fs-875 btn-danger noTabsButton" title="Sil" onclick="msgBox('${kodu} kodlu eylemi silmek istediğinize emin misiniz?', true, ()=>eylemSilController('${id}', '${kodu}'))">
							<span class="icon-cross"></span>
						</button>
					</div>
				</div>
			</div>
			<hr/>
			<div class="tabs-body clr0 mt-1vh">
				<!--Kodu / Adı-->
				<div>
						<p>${adi}</p>
				</div>
				<!--Bilgiler-->
				<div>
					<div>
						<h3>Plan:</h3>
						<p class="ml-2vh">${eylemlerFeVals[secapYsep]}</p>
					</div>
					<div>
						<h3>Yetki:</h3>
						<p class="ml-2vh">${eylemlerFeVals[yetki]}</p>
					</div>
				</div>
				<!--Faydaları-->
				<div>
					<div>
						<h3>Enerji Tasarrufu:</h3>
						<p class="ml-2vh">${energySavingsMWh} (MWh)</p>
					</div>
					<div>
						<h3>Yenilenebilir Enerji Üretimi:</h3>
						<p class="ml-2vh">${renEnergyProdMWh} (MWh)</p>
					</div>
					<div>
						<h3>Toplam Azaltım:</h3>
						<p class="ml-2vh">${toplamAzaltimCO2eTon} (CO<sub>2</sub>eqTon)</p>
					</div>
				</div>
				<!--Mevcut Yapılanlar-->
				<div class="mb-2-children">
					${mevcutYapilanlar}
				</div>
			</div>
		</div>
  </div>`;
}


//Altsektorleri getir
function userSektorSelect(sektorSelect) {
	let sektorId = sektorSelect.value;
	let altSektorSelect = document.getElementById("altSektorSelect");

	//sektor listesi getir
	let sektorler = pages.Eylemler.formData.sektorlerAltsektorleriyle;
	let selectedSektor = sektorler.filter(sektor => sektor._id == sektorId)[0];


	let strOptions = toOptions(selectedSektor.altSektorler.map(item => {
		return { innerText: item.name.tr, value: item._id }
	}));
	altSektorSelect.innerHTML = /*html*/`
				<option value="">Seçiniz</option>
				${strOptions}
			`;
}

function flattenIbbOrganizasyon(ibbOrganizasyon) {
	let options = [];
	ibbOrganizasyon.forEach(item => {
		options.push(item.baskanlikAdi);
		for (let birim of item.birimler) {
			options.push(birim);
		}
	})

	options = options.sort((a, b) => a.localeCompare(b, 'tr')).map(item => { return { "value": item } });
	return options;
}

async function eylemlerFormView(callback, eylemId) {

	async function fetchEylemlerFormData() {
		toggleLoader("");
		return fetch(endPoint + "/eylemlerFormData")
			.then(res => {
				toggleLoader();
				return res.json();
			})
	}
	pages.Eylemler.formData = await fetchEylemlerFormData();
	let formData = pages.Eylemler.formData;
	//

	//sektorleri forma ekle
	let strSektorlerOptions = toOptions(formData.sektorlerAltsektorleriyle.map(item => {
		return { innerText: item.name.tr, value: item._id }
	}));

	//birimler tagsInput olustur
	//let ibbOrganizasyonFlattenedArr = flattenIbbOrganizasyon(formData.ibbOrganizasyon);

	// let birimlerTagsInputLiteral = tagsInput(
	// 	{ "options": { "arrOfOptObjs": ibbOrganizasyonFlattenedArr, selectedValue: "" }, name: "birimler", value: "", className: "", isRequired: true })

	let birimlerTagsInputLiteral = tagsInput(
		{ "options": { "arrOfOptObjs": formData.ibbOrganizasyon.map(item => { return { "value": item } }), selectedValue: "" }, name: "birimler", value: "", className: "", isRequired: true })
	//sirketleri olstur

	let sirketlerTagsInputLiteral = tagsInput(
		{ "options": { "arrOfOptObjs": formData.ibbSirketler.map(item => { return { "value": item } }), selectedValue: "" }, name: "sirketler", value: "", className: "", isRequired: true });

	//Dis kurumlar
	let disKurumlarTagsInputLiteral = tagsInput(
		{ "options": { "arrOfOptObjs": formData.disKurumlar.map(item => { return { "value": item } }), selectedValue: "" }, name: "sirketler", value: "", className: "", isRequired: true });


	let eylem = getPageData(eylemId);

	let eylemForm = /*html*/`
		<div class="form flex flexColumn fgrow jc-spaceBetween oFlowYAuto">
			<div class="oFlowYAuto">
				<!--EYLEM KODU-->
				<div class="wrap ai-start ac-start">
					<!--Eylem Kodu-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Eylem Kodu*</p>
						<input required name="kodu_tr" type="text" class="br-5 fs-1125" />
					</div>
				</div>
				<!--EYLEM ADI-->
				<div class="wrap ai-start ac-start">
					<!--Eylem Adı (TR)-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Eylem Adı (TR)*</p>
						<input required name="name_tr" type="text" class="br-5 fs-1125" />
					</div>
					<!--Eylem Adı (EN)-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Eylem Adı (EN)*</p>
						<div class="translateInput br-5">
							${translateInput({ tr: "name_tr", en: "name_en", isRequired: true, value: eylemId ? eylem.name.en : "" })}
						</div>
					</div>
				</div>
				<!--EYLEM TANIMI-->
				<div class="wrap ai-start ac-start">
					<!--Eylem Tanımı (TR)-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Eylem Tanımı (TR)*</p>
						<textarea required name="tanimi_tr" type="text" class="br-5 fs-1125"></textarea>
					</div>
					<!--Eylem Tanımı (EN)-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Eylem Tanımı (EN)*</p>
						<div class="translateInput br-5">
							${translateInput({
		tr: "tanimi_tr", en: "tanimi_en", isRequired: true,
		value: eylemId ? eylem.name.en : "", type: "textarea"
	})}
						</div>
					</div>
				</div>
				<!--SECAP/YSEP-->
				<div class="wrap ai-start ac-start">
					<!--Secap/Ysep-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">SECAP / YŞEP*</p>
						<select required name="secapYsep" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
 							<option value="secapYsep">SECAP/YŞEP</option>
 							<option value="secap">SECAP</option>
 							<option value="ysep">YŞEP</option>
 						</select>
					</div>
				</div>
				<!--AZALTIM/UYUM-->
				<div class="wrap ai-start ac-start">
					<!--Azaltım/Uyum-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Azaltım/Uyum*</p>
						<select required name="azaltımUyum" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
 							<option value="azaltımUyum">Azaltım/Uyum</option>
 							<option value="azaltım">Azaltım</option>
 							<option value="uyum">Uyum</option>
 						</select>
					</div>
				</div>
				<!--SEKTÖRLER/ALTSEKTÖRLER-->
				<div class="wrap ai-start ac-start">
					<!--SEKTÖRLER-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Sektör*</p>
						<select required name="sektor" class="br-5 fs-1125" oninput="userSektorSelect(this)">
							<option value="" hidden>Seçiniz</option>
							${strSektorlerOptions}
						</select>
					</div>
					<!--ALTSEKTÖRLER-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Alt Sektör*</p>
						<select required name="altSektor" id="altSektorSelect" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
						</select>
					</div>
				</div>
				<!--YETKİ-->
				<div class="wrap ai-start ac-start">
					<!--Yetki-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Yetki Sahibi*</p>
						<select required name="yetki" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
							<option value="belediyeKent">Belediye/Kent</option>
							<option value="belediye">Belediye</option>
							<option value="kent">Kent</option>
						</select>
					</div>
				</div>
				<!--STRATEJİK PLAN-->
				<div class="wrap ai-start ac-start">
					<!--Stratejik Plan-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Stratejik Plan*</p>
						<select required name="stratejikPlan" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
							<option value="2015-2019">2015 - 2019</option>
							<option value="2020-2024">2020 - 2024</option>
						</select>
					</div>
				</div>
				<!--PLANLANAN BAŞLAMA - BİTİŞ-->
				<div class="wrap ai-start ac-start">
					<!--Planlanan Başlama-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Planlanan Başlama*</p>
						<select required name="planlananBaslama" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
							${toOptions(Array(50).fill().map((a, b) => { return { value: b + 2010, innerText: b + 2010 } }))}
						</select>
					</div>
					<!--Planlanan Bitiş-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Planlanan Bitiş*</p>
						<select required name="planlananBitis" class="br-5 fs-1125">
							<option value="" hidden>Seçiniz</option>
							${toOptions(Array(50).fill().map((a, b) => { return { value: b + 2010, innerText: b + 2010 } }))}
						</select>
					</div>
				</div>
				<!--İLGİLİ BİRİMLER - ŞiRKETLER - DIŞ KURUMLAR-->
				<div class="wrap ai-start ac-start">
					<!--İlgili Birimler-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">İlgili Birimler*</p>
						<div class="tagsInput br-5">
							${birimlerTagsInputLiteral}
						</div>
					</div>
					<!--İlgili Şirketler-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">İlgili Şirketler*</p>
						<div class="tagsInput br-5">
							${sirketlerTagsInputLiteral}
						</div>
					</div>
					<!--Dış Kurumlar-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Dış Kurumlar*</p>
						<div class="tagsInput br-5">
							${disKurumlarTagsInputLiteral}
						</div>
					</div>
				</div>
				<!--NOTLAR-->
				<div class="wrap ai-start ac-start">
					<!--Notlar-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Notlar*</p>
						<textarea required name="notlar" type="text" class="br-5 fs-1125"></textarea>
					</div>
					<!--Azaltım Notu (TR)-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Azaltım Notu (TR)*</p>
						<textarea required name="azaltımNotu_tr" type="text" class="br-5 fs-1125"></textarea>
					</div>
					<!--Azaltım Notu (EN)-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Azaltım Notu (EN)*</p>
						<div class="translateInput br-5">
							${translateInput({
		tr: "azaltımNotu_tr", en: "azaltımNotu_en", isRequired: true,
		value: eylemId ? eylem.name.en : "", type: "textarea"
	})}
						</div>
					</div>
				</div>
				<!--EYLEM FAYDALARI-->
				<div class="wrap ai-start ac-start">
					<!--Enerji Tasarrufu-->	
					<div class="inputContainer w-full-sm">	
						<p class="fs-1125">Enerji Tasarrufu (MWh)*</p>
						<input
							required
							name="energySavingsMWh"
							min="0"
							step="0.1" 
							class="br-5 fs-1125" 
							placeholder="0.0"
							${inputNumber()}
						>
					</div>
					<!--Yenilenebilir Enerji Üretimi-->
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Yenilenebilir Enerji Üretimi (MWh)*</p>
						<input 
							required 
							name="renEnergyProdMWh"
							min="0" 
							step="0.1"
							class="br-5 fs-1125" 
							placeholder="0.0"
							${inputNumber()}
						>
					</div>
					<!--Toplam Azaltım-->	
					<div class="inputContainer w-full-sm">
						<p class="fs-1125">Toplam Azaltım (MWh)*</p>
						<input 
							required 
							name="toplamAzaltimCO2eTon" 
							min="0" 
							step="0.1"
							class="br-5 fs-1125"
							placeholder="0.0"
							${inputNumber()}
						>
					</div>
				</div>	
				
			</div>
			<div class="m-1vh">
				<button
					type="submit"
					class="btn-submit fs-1250 flexCenter m-auto mt-1vh min-width-300"
					onclick="${callback}(this, '${eylemId}');"
				>
					${eylemId ? "Güncelle" : "Ekle"}
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
			${eylemId ? "Eylem Düzenle" : "Yeni Eylem Ekle"}
		</h2>
		<div class="flex flex-center ai-center">
			<button type="button" class="btn-0 fs-1125" onclick="applyUrl()">
				Geri
			</button>
		</div>
	</div >
		<hr />
	${eylemForm}
	`;
}

function yeniEylemEkleController(elem) {

	let form = elem.closest(".form");
	let isFormReady = formCheck(form);

	if (isFormReady) {
		toggleLoader("Yeni eylem ekleniyor...");
		fetch(endPoint + "/eylemler/add", {
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
					msgBox(`${data.added.kodu} kodlu yeni eylem eklendi`);
					loadPage("Eylemler");
				}
			})
	}


}

//EYLEM GUNCELLEME
function eylemGuncelleController(elem, eylemId) {
	let form = elem.closest(".form");
	let isFormReady = formCheck(form);
	if (isFormReady) {
		toggleLoader("Eylem güncelleniyor...");
		fetch(endPoint + `/ eylemler / update / ${eylemId} `, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify(getFormState(form).currentFormBody)
		})
			.then(res => res.json())
			.then(data => {
				if (data.msg.acknowledged) {
					toggleLoader();
					togglePopUp("close");
					msgBox(`${data.added.kodu} kodlu eylem güncellendi`);
					loadPage("Eylemler");
				}
			})
	}
}

//EYLEM SİLME
function eylemSilController(eylemId, kodu) {
	toggleLoader(`${kodu} kodlu eylem siliniyor...`)
	fetch(endPoint + "/eylemler/delete/" + eylemId)
		.then(res => res.json())
		.then(data => {
			if (data.deletedCount == 1) {
				toggleLoader();
				msgBox(`${kodu} kodlu eylem silindi.`);
				loadPage("Eylemler");
			}
			else {
				msgBox(`Bir hata oldu.`);
			}
		})
}

//EYLEMLER PAGE
function Eylemler() {
	toggleLoader("Eylemler yükleniyor...");
	fetch(endPoint + "/eylemler/list/all")
		.then((res) => res.json())
		.then((data) => {

			//data
			pages.Eylemler.data = data;

			let eylemlerView = data.result.map((item) => eylemView(item._id, item.kodu, item.adi, item.secapYsep, item.yetki, item.energySavingsMWh, item.renEnergyProdMWh, item.toplamAzaltimCO2eTon, item.mevcutYapilanlar)).join("");
			let contentContainer =
				document.getElementsByClassName("panel-content")[0];
			//
			contentContainer.innerHTML = /*html*/`
		<div class="flex jc-spaceBetween ai-center p-1vh">
					<h2 class="clr0">Eylemler (${data.count})</h2>
					<div class="flex flex-center ai-center">
						<button type="button" class="btn-0 fs-1250" onclick="eylemlerFormView('yeniEylemEkleController')">Yeni Ekle</button>
					</div>
				</div >
				<hr/>
				<div class="grid grid-475 appear">
					${eylemlerView}
				</div>
	`;
			toggleLoader();
			//
			//eylemlerFormView('yeniEylemEkleController')
		});
}


//EYLEMLER ROUTER
pages.Eylemler = { link: Eylemler };
pages.Eylemler.link();