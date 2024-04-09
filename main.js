import { detecIcon, detecType, setStorage } from "./helpers.js";

// ! HTML'den gelenler;
const form = document.querySelector("form");
const list = document.querySelector("ul");

// ! olay izleyicileri;
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

// ! ortak kullanım alanı;
let map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layerGroup = [];

// kullanıcının konumunu ögreneme;
navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kullanıcı Kabul Etmedi!")
);

// haritaya tıklanınca çalısır.
function onMapClick(e) {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
}

//* kullanıcının konumuna göre ekrana haritayı gösterme;
function loadMap(e) {
  //* haritanın kurulumu
  map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 13);
  L.control;

  //* haritanın nasıl gözükeceğini belirler.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // haritada ekrana basılacak imleçleri tutacağımız katman;
  layerGroup = L.layerGroup().addTo(map);

  // local'den gelen notları listeleme;
  renderNoteList(notes);

  // haritada bir tıklanma old. çalışacak fonk.
  map.on("click", onMapClick);
}

// *Ekrana marker basma;
function renderMarker(item) {
  // marker oluşturur.
  L.marker(item.coords, { icon: detecIcon(item.status) })
    // imleçlerin old. katmana ekler.
    .addTo(layerGroup)
    // üzerine tıklanınca açılacak popup ekleme,
    .bindPopup(`${item.desc}`);
}

// *Form gönderildiğinde çalısır.
function handleSubmit(e) {
  e.preventDefault();
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  //* notes dizisine eleman ekleme;
  notes.push({ id: new Date().getTime(), desc, date, status, coords });

  //locol storage güncelleme
  setStorage(notes);

  //Notları ekrana aktarabilmek için fonksiyona notes dizisini paremetre olarak gönderdik,
  renderNoteList(notes);

  // form gömderildiğinde kapanır.
  form.style.display = "none";
}

function renderNoteList(item) {
  list.innerHTML = "";
  //markerları temizler
  layerGroup.clearLayers();
  item.forEach((item) => {
    const listElement = document.createElement("li");
    //datasına sahip old. id'yi ekleme;
    listElement.dataset.id = item.id;
    listElement.innerHTML = `
            <div>
              <p>${item.desc}</p>
              <p><span>Tarih : </span>${item.date}</p>
              <p><span>Durum : </span>${detecType(item.status)}</p>
            </div>
            <i class="fa-solid fa-x" id="delete"></i>
            <i class="fa-solid fa-plane-up" id="fly"></i>`;
    list.appendChild(listElement);
    list.insertAdjacentElement("afterbegin", listElement);
    // ekrana marker basma;
    renderMarker(item);
  });
}

function handleClick(e) {
  // güncellenecek elemanın id'sini ögrenme,
  const id = e.target.parentElement.dataset.id;
  console.log(notes);
  if (e.target.id === "delete") {
    // id'sini bildiğimiz elemanı diziden çıkarma;
    //Bu işlem, id’si verilen id ile eşleşmeyen notları korurken, eşleşen notu diziden çıkarır.
    // Bu şekilde, bir notu id’sine göre diziden kaldırmak için kullanılır.
    notes = notes.filter((note) => note.id != id);
    console.log(notes);

    //localstorage güncelleme
    setStorage(notes);
    //ekranı güncelle
    renderNoteList(notes);
  }

  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords);
  }
}
