const carList = document.getElementById("carList");
const addCarBtn = document.getElementById("addCarBtn");

function clearInputs() {
  document.getElementById("carName").value = "";
  document.getElementById("carModel").value = "";
  document.getElementById("carPrice").value = "";
  document.getElementById("carYear").value = "";
  document.getElementById("carImg").value = "";
}

addCarBtn.addEventListener("click", () => {
  const name = document.getElementById("carName").value.trim();
  const model = document.getElementById("carModel").value.trim();
  const price = document.getElementById("carPrice").value.trim();
  const year = document.getElementById("carYear").value.trim();
  const imgUrl = document.getElementById("carImg").value.trim();

  if (!name || !model || !price || !year || !imgUrl) {
    alert("Iltimos, barcha maydonlarni to‘ldiring");
    return;
  }

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${imgUrl}" alt="${name}">
    <div class="card-body">
      <h3>${name}</h3>
      <p><i class="fas fa-car"></i> Model: ${model}<br>
         <i class="fas fa-dollar-sign"></i> Narx: ${price}<br>
         <i class="fas fa-calendar-alt"></i> Yil: ${year}</p>
      <button class="edit-btn"><i class="fas fa-edit"></i> Tahrirlash</button>
      <button class="delete-btn"><i class="fas fa-trash"></i> O'chirish</button>
    </div>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    carList.removeChild(card);
  });

  card.querySelector(".edit-btn").addEventListener("click", () => {
    document.getElementById("carName").value = name;
    document.getElementById("carModel").value = model;
    document.getElementById("carPrice").value = price;
    document.getElementById("carYear").value = year;
    document.getElementById("carImg").value = imgUrl;
    carList.removeChild(card);
  });

  carList.appendChild(card);
  clearInputs();
});
