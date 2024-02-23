const baseURL = "http://localhost:3000/products";
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const handleAddProduct = document.getElementById("handleAddProduct");
const recordNumber = document.getElementById("limitPerPage");
const searchForm = document.getElementById("searchForm");
const filterForm = document.getElementById("filterForm");
const minToMax = document.getElementById("min-max");
const maxToMin = document.getElementById("max-min");
let isSortingEnabled = false;
let editingProductId = null;
let sortingDirection = null;
let currentPage = 1;
let perPage = 2;
const limitPerPage = () => {
  recordNumber.addEventListener("change", () => {
    perPage = recordNumber.value;
    fetchProducts();
  });
};

minToMax.addEventListener("click", () => {
  isSortingEnabled = true;
  sortingDirection = "asc";
  fetchProducts();
});

maxToMin.addEventListener("click", () => {
  isSortingEnabled = true;
  sortingDirection = "desc";
  fetchProducts();
});
limitPerPage();
const fetchProducts = async () => {
  let url = baseURL + `?_page=${currentPage}&_limit=${perPage}`;
  if (isSortingEnabled) {
    url += `&_sort=price&_order=${sortingDirection}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  productList.innerHTML = "";
  if (Array.isArray(data)) {
    data.forEach((element, index) => {
      const productItem = createProductItem(element, index);
      productList.appendChild(productItem);
    });
  } else {
    console.error(data);
  }
};

let prev;
let next;
const pagination = async () => {
  const res = await fetch(baseURL + `?_page=${currentPage}&_limit=${perPage}`);
  const data = await res.json();
  console.log(data);
  prev = data.prev;
  next = data.next;
};
const nextPage = async () => {
  await pagination();
  console.log(next);
  if (next !== null) {
    currentPage++;
    fetchProducts();
  }
};
const prevPage = async () => {
  await pagination();
  if (currentPage > 1) {
    currentPage--;
    fetchProducts();
  }
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

let min;
let max;

filterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  min = document.getElementById("min").value;
  max = document.getElementById("max").value;
  await handleSort();
});
const handleSort = async () => {
  const res = await fetch(baseURL + `?price_gte=${min}&price_lte=${max}`);
  const data = await res.json();
  productList.innerHTML = "";
  if (Array.isArray(data)) {
    data.forEach((element, index) => {
      const productItem = createProductItem(element, index);
      productList.appendChild(productItem);
    });
  } else {
    console.error("Data is not an array:", data);
  }
};
let keyWords;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  keyWords = document.getElementById("searchInput").value;
  await handleSearch();
});
handleAddProduct.addEventListener("click", handleAddProductClick);
const handleSearch = async () => {
  const res = await fetch(baseURL + `?q=${keyWords}`);
  const data = await res.json();
  console.log(data);
  productList.innerHTML = "";
  if (Array.isArray(data)) {
    data.forEach((element, index) => {
      const productItem = createProductItem(element, index);
      productList.appendChild(productItem);
    });
  } else {
    console.error("Data is not an array:", data);
  }
};
const createProductItem = (element, index) => {
  const newElm = document.createElement("tr");
  newElm.classList.add("productItem");
  newElm.innerHTML = `
      <th scope="row">${(currentPage - 1) * perPage + index + 1}</th>
      <td>${element.name}</td>
      <td>${element.price}</td>
      <td>
          <button data-toggle="modal" data-target="#modalDeleteProduct" class="btn btn-outline-info" onclick="setDeleteProductId('${
            element.id
          }')">Xóa</button>
          <button data-toggle="modal" data-target="#modalEditProduct" class="btn btn-outline-warning" onclick="editPr('${
            element.id
          }')">Sửa</button>
      </td>
  `;
  return newElm;
};
const handleSortPrice = async () => {
  while (productList.firstChild) {
    productList.removeChild(productList.firstChild);
  }

  const res = await fetch(baseURL + `?_sort=price&_order=asc`);
  const data = await res.json();
  data.forEach((element, index) => {
    const productItem = createProductItem(element, index);
    productList.appendChild(productItem);
  });
};
