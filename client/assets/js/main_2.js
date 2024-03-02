const baseURL = "http://localhost:3000/products";
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const handleAddProduct = document.getElementById("handleAddProduct");
const recordNumber = document.getElementById("limitPerPage");
const filterForm = document.getElementById("filterForm");
let cachedData = null;
let url = null;
let editingProductId = null;
let isSortChanged = false;
let btnPrev;
let btnNext;
let page;

const query = {
  _page: 1,
  _per_page: 5,
  _sort: "price",
  _order: null,
};

const sortPrice = () => {
  if (query._order === null) {
    query._order = "desc";
  } else if (query._order === "desc") {
    query._order = "asc";
  } else {
    query._order = null;
  }
  isSortChanged = true;
  fetchProducts();
};

const onChangePerPage = () => {
  query._per_page = recordNumber.value;
  fetchProducts();
};

const fetchProducts = async () => {
  url = baseURL + `?_page=${query._page}&_per_page=${query._per_page}`;
  if (isSortChanged) {
    if (query._order === "asc") {
      url += `&_sort=price`;
    } else if (query._order === "desc") {
      url += `&_sort=-price`;
    } else {
      url;
    }
  }
  const res = await fetch(url);
  cachedData = await res.json();
  const { data, prev, next, pages: totalPages } = cachedData;
  btnPrev = prev;
  btnNext = next;
  page = totalPages;
  productList.innerHTML = "";
  data.forEach((element, index) => {
    const productItem = createProductItem(element, index);
    productList.appendChild(productItem);
  });
  pages();
};

const pages = () => {
  if (!cachedData) return;
  let pageNumber = document.getElementById("pages");
  pageNumber.innerHTML = "";
  let currentPage = query._page;
  for (let i = 1; i <= page; i++) {
    const li = document.createElement("li");
    li.textContent = i;
    if (i === currentPage) {
      li.classList.add("active");
    }
    li.addEventListener("click", async () => {
      currentPage = i;
      query._page = i;
      await fetchProducts();
      li.classList.add("active");
    });
    pageNumber.appendChild(li);
  }
};

fetchProducts();

const nextPage = async () => {
  if (btnNext !== null) {
    query._page++;
    await fetchProducts();
  }
};

const prevPage = async () => {
  if (query._page > 1) {
    query._page--;
    await fetchProducts();
  }
};

const setDeleteProductId = (id) => {
  const confirmDeleteButton = document.getElementById("confirmDeleteProduct");
  confirmDeleteButton.dataset.productId = id;
};

const deletePr = async () => {
  const confirmDeleteButton = document.getElementById("confirmDeleteProduct");
  const id = confirmDeleteButton.dataset.productId;
  if (id) {
    await fetch(`${baseURL}/${id}`, { method: "DELETE" });
    fetchProducts();
  }
};

confirmDeleteProduct.addEventListener("click", (event) => {
  event.preventDefault();
  deletePr();
});                         

const editProduct = async (id) => {
  console.log(`Sửa: ${id}`);
  editingProductId = id;
  const res = await fetch(`${baseURL}/${id}`);
  const data = await res.json();
  let nameInput = document.getElementById("name-edit");
  let priceInput = document.getElementById("price-edit");
  nameInput.value = data.name;
  priceInput.value = data.price;
};

const handleEditProduct = async () => {
  if (editingProductId) {
    let name = document.getElementById("name-edit").value;
    let priceString = document.getElementById("price-edit").value;
    let price = parseFloat(priceString);
    await fetch(`${baseURL}/${editingProductId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });
  }
};

const addProduct = async () => {
  const name = document.getElementById("name").value;
  let priceString = document.getElementById("price").value;
  const price = parseFloat(priceString);
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
    await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });
    alert("Thêm sản phẩm thành công");
  }
  productForm.submit();
};

const handleAddProductClick = (event) => {
  event.preventDefault();
  addProduct();
};

handleAddProduct.addEventListener("click", handleAddProductClick);

let keyWords;

filterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  keyWords = document.getElementById("searchInput").value;
  await handleSearch();
});

const handleSearch = async () => {
  const res = await fetch(url + `&name=${keyWords}`);
  const data = await res.json();
  console.log(data);
  productList.innerHTML = "";
  data.data.forEach((element, index) => {
    const productItem = createProductItem(element, index);
    productList.appendChild(productItem);
  });
};

const createProductItem = (element, index) => {
  const newElm = document.createElement("tr");
  newElm.classList.add("productItem");
  newElm.innerHTML = `
      <th scope="row">${(query._page - 1) * query._per_page + index + 1}</th>
      <td>${element.name}</td>
      <td>${element.price}</td>
      <td>
          <button data-toggle="modal" data-target="#modalDeleteProduct" class="btn btn-outline-info" onclick="setDeleteProductId('${
            element.id
          }')">Xóa</button>
          <button data-toggle="modal" data-target="#modalEditProduct" class="btn btn-outline-warning" onclick="editProduct('${
            element.id
          }')">Sửa</button>
      </td>
  `;
  return newElm;
};
