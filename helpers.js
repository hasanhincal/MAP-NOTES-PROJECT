export const setStorage = (data) => {
  // veriyi locale göndermek için veriyi stringe çevirme,
  const strData = JSON.stringify(data);

  // localstorage güncelleme;
  localStorage.setItem("notes", strData);
};

let carIcon = L.icon({
  iconUrl: "images/car.png",
  iconSize: [50, 60],
});
let homeIcon = L.icon({
  iconUrl: "images/home-marker.png",
  iconSize: [50, 60],
});
let jobIcon = L.icon({
  iconUrl: "images/job.png",
  iconSize: [50, 60],
});
let visitIcon = L.icon({
  iconUrl: "images/visit.png",
  iconSize: [50, 60],
});

export function detecIcon(type) {
  switch (type) {
    case "park":
      return carIcon;

    case "home":
      return homeIcon;

    case "job":
      return jobIcon;

    case "goto":
      return visitIcon;
  }
}

export const detecType = (type) => {
  switch (type) {
    case "park":
      return "Park Yeri";

    case "home":
      return "Ev";

    case "job":
      return "İş";

    case "goto":
      return "Ziyaret";
  }
};
