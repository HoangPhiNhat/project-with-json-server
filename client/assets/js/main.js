const baseURL = "http://localhost:3000/product";
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const handleAddProduct = document.getElementById("handleAddProduct");
let editingProductId = null;
const fetchProducts = async () => {
  const res = await fetch(baseURL);
  const data = await res.json();
  console.log(data);
  productList.innerHTML = "";
  data.forEach((element, index) => {
    const newElm = document.createElement("tr");
    newElm.classList.add("productItem");
    newElm.innerHTML = `
    <th scope="row">${index + 1}</th>
    <td> ${element.name} </td>
    <td> ${element.price} </td>
    <td>
   <button data-toggle="modal" data-target="#modalDeleteProduct" class="btn btn-outline-info" onclick="setDeleteProductId('${
     element.id
   }')">Xóa</button>
    <button data-toggle="modal"
    data-target="#modalEditProduct" class="btn btn-outline-warning" onclick="editPr('${
      element.id
    }')">Sửa</button>
    </td>
    `;
    productList.appendChild(newElm);
  });
  list = document.querySelectorAll("#productList .productItem");
  loadItem();
};
fetchProducts();

const setDeleteProductId = (id) => {
  const confirmDeleteButton = document.getElementById("confirmDeleteProduct");
  confirmDeleteButton.dataset.productId = id;
};

const deletePr = async () => {
  const confirmDeleteButton = document.getElementById("confirmDeleteProduct");
  const id = confirmDeleteButton.dataset.productId;
  console.log(id);
  if (id) {
    await fetch(`${baseURL}/${id}`, { method: "DELETE" });
    location.reload();
  }
};

document
  .getElementById("confirmDeleteProduct")
  .addEventListener("click", deletePr);

const editPr = async (id) => {
  console.log(`Sửa: ${id}`);
  editingProductId = id;
  const res = await fetch(`${baseURL}/${id}`);
  const data = await res.json();
  document.getElementById("name-edit").value = data.name;
  document.getElementById("price-edit").value = data.price;
};

const addProduct = async () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  if (name === "") {
    alert("Không được để trống tên sản phẩm");
    document.getElementById("name").focus();
  } else if (price === "") {
    alert("Không được để trống giá sản phẩm");
    document.getElementById("price").focus();
  } else if (price < 0) {
    alert("Giá sản phẩm phải lớn hơn 0");
    document.getElementById("price").focus();
  } else {
    if (editingProductId) {
      await fetch(`${baseURL}/${editingProductId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price }),
      });
      alert("Sửa sản phẩm thành công");
    } else {
      await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price }),
      });
      alert("Thêm sản phẩm thành công");
    }
    fetchProducts();
    productForm.submit();
  }
};

const handleAddProductClick = (event) => {
  event.preventDefault();

  addProduct();
};

handleAddProduct.addEventListener("click", handleAddProductClick);

//
let thisPage = 1;
let limit = 2;
let list = document.querySelectorAll("#productList .productItem");
console.log(list);

function loadItem() {
  let beginGet = limit * (thisPage - 1);
  let endGet = limit * thisPage - 1;
  list.forEach((item, key) => {
    if (key >= beginGet && key <= endGet) {
      item.style.display = "table-row";
    } else {
      item.style.display = "none";
    }
  });
  listPage();
}
loadItem();
function listPage() {
  let count = Math.ceil(list.length / limit);
  document.querySelector(".listPage").innerHTML = "";

  if (thisPage != 1) {
    let prev = document.createElement("li");
    prev.innerText = "PREV";
    prev.setAttribute("onclick", "changePage(" + (thisPage - 1) + ")");
    document.querySelector(".listPage").appendChild(prev);
  }

  for (i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thisPage) {
      newPage.classList.add("active");
    }
    newPage.setAttribute("onclick", "changePage(" + i + ")");
    document.querySelector(".listPage").appendChild(newPage);
  }

  if (thisPage != count) {
    let next = document.createElement("li");
    next.innerText = "NEXT";
    next.setAttribute("onclick", "changePage(" + (thisPage + 1) + ")");
    document.querySelector(".listPage").appendChild(next);
  }
}
function changePage(i) {
  thisPage = i;
  loadItem();
}
// sort
function ascending() {
  let 
}