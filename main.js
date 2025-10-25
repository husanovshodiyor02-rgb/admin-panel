const API_URL = "https://68fb44ef94ec9606602561ae.mockapi.io/api/api";

const loader = document.getElementById("loader");
const gallery = document.getElementById("gallery");
const errorBox = document.getElementById("error");
const search = document.getElementById("search");
const form = document.getElementById("addForm");


const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalModel = document.getElementById("modalModel");
const modalSpecs = document.getElementById("modalSpecs");
const modalClose = document.getElementById("modalClose");

async function loadData() {
  loader.style.display = "block";
  errorBox.hidden = true;
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server javobi: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Qaytgan ma'lumot array emas");

    
    const items = data.slice(0, 20);
    render(items);
    attachSearch(items);
  } catch (err) {
    console.error(err);
    errorBox.hidden = false;
    errorBox.textContent = "Ma'lumot yuklanmadi: " + err.message;
  } finally {
    loader.style.display = "none";
  }
}



async function getCars() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderGallery(data);
  } catch (err) {
    errorBox.textContent = "Xatolik: " + err.message;
    errorBox.hidden = false;
  } finally {
    loader.style.display = "none";
  }
}


function renderGallery(cars) {
  gallery.innerHTML = "";
  cars.forEach((car) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${car.Rasm || car.rasm}" alt="${
      car.Model
    }" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">
      <div class="card-content">
        <h3>${car.Model}</h3>
        <p>Rang: ${car.Rang}</p>
        <p>Yil: ${car.Yil}</p>
        <p>Narx: ${car.Narx}</p>
        <div class="actions">
          <button class="edit" onclick="editCar(${car.id})">Edit</button>
          <button class="delete" onclick="deleteCar(${car.id})">Delete</button>
        </div>
      </div>
    `;
  
    card.querySelector("img").addEventListener("click", () => openModal(car));
    gallery.appendChild(card);
  });
}


function openModal(car) {
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = car.Rasm;
  modalModel.textContent = car.Model;
  modalSpecs.textContent = `${car.Rang}, ${car.Yil}, ${car.Narx}`;
}
modalClose.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", "true");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newCar = {
    Model: form.model.value,
    Rang: form.rang.value,
    Yil: form.yil.value,
    Narx: form.narx.value,
    Rasm: form.rasm.value,
  };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCar),
  });
  const car = await res.json();
  renderGallery(await (await fetch(API_URL)).json());
  form.reset();
});


async function deleteCar(id) {
  if (confirm("Haqiqatan ham o‘chirmoqchimisiz?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getCars();
  }
}


async function editCar(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const car = await res.json();

  form.model.value = car.Model;
  form.rang.value = car.Rang;
  form.yil.value = car.Yil;
  form.narx.value = car.Narx;
  form.rasm.value = car.Rasm;

  document.querySelector(".add-btn").textContent = "💾 Saqlash";

  form.onsubmit = async (e) => {
    e.preventDefault();
    const updated = {
      Model: form.model.value,
      Rang: form.rang.value,
      Yil: form.yil.value,
      Narx: form.narx.value,
      Rasm: form.rasm.value,
    };
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    document.querySelector(".add-btn").textContent = "+ Qo‘shish";
    form.reset();
    getCars();
  };
}


search.addEventListener("input", async (e) => {
  const res = await fetch(API_URL);
  const cars = await res.json();
  const filtered = cars.filter((car) =>
    car.Model.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderGallery(filtered);
});

getCars();
