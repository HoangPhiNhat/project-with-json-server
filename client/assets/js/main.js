const baseURL = "http://localhost:3000/products";
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const handleAddProduct = document.getElementById("handleAddProduct");
const recordNumber = document.getElementById("limitPerPage");
const searchForm = document.getElementById("searchForm");
const filterForm = document.getElementById("filterForm");
let url = null;
let isSortingEnabled = false;
let editingProductId = null;
let sortingDirection = null;
// let currentPage = 1;
// let perPage = 2;

let prev;
let next;
let page;
const query = {
  _page: 1,
  _per_page: 10,
  _sort: "price",
  _order: null,
};
const onChangeSortPrice = () => {
  query._order = document.getElementById("sortPrice").value;
  console.log(query._order);
  fetchProducts();
};
const onChangePerPage = () => {
  query._per_page = recordNumber.value;
  fetchProducts();
  pages();
};
const fetchProducts = async () => {
  url = baseURL + `?_page=${query._page}&_per_page=${query._per_page}`;
  const res = await fetch(url);
  const data = await res.json();
  prev = data.prev;
  next = data.next;
  page = data.pages;
  console.log(data.data);
  productList.innerHTML = "";
  if (Array.isArray(data.data)) {
    if (query._sort === "price") {
      data.data.sort((a, b) => {
        return query._order === "asc" ? a.price - b.price : b.price - a.price;
      });
    }
    data.data.forEach((element, index) => {
      const productItem = createProductItem(element, index);
      productList.appendChild(productItem);
    });
  } else {
    console.error(data);
  }
};
const pages = async () => {
  await fetchProducts();
  let pageNumber = document.getElementById("pages");
  pageNumber.innerHTML = "";
  for (let i = 1; i <= page; i++) {
    const li = document.createElement("li");
    li.textContent = i;
    if (i === query._page) {
      li.classList.add("active");
    }
    li.addEventListener("click", async () => {
      query._page = i;
      fetchProducts();
      pageNumber.querySelectorAll("li").forEach((item) => {
        item.classList.remove("active");
      });
      li.classList.add("active");
    });
    pageNumber.appendChild(li);
  }
};

pages();
const nextPage = async () => {
  await fetchProducts();
  if (next !== null) {
    query._page++;
    fetchProducts();
  }
};
const prevPage = async () => {
  await fetchProducts();
  if (query._page > 1) {
    query._page--;
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

// let min;
// let max;

// filterForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   min = document.getElementById("min").value;
//   max = document.getElementById("max").value;
//   await handleSort();
// });
// const handleSort = async () => {
//   const res = await fetch(baseURL + `?price_gte=${min}&price_lte=${max}`);
//   const data = await res.json();
//   productList.innerHTML = "";
//   if (Array.isArray(data)) {
//     data.forEach((element, index) => {
//       const productItem = createProductItem(element, index);
//       productList.appendChild(productItem);
//     });
//   } else {
//     console.error("Data is not an array:", data);
//   }
// };
// let keyWords;

// searchForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   keyWords = document.getElementById("searchInput").value;
//   await handleSearch();
// });
// handleAddProduct.addEventListener("click", handleAddProductClick);
// const handleSearch = async () => {
//   const res = await fetch(baseURL + `?name=${keyWords}`);
//   const data = await res.json();
//   console.log(data);
//   productList.innerHTML = "";
//   if (Array.isArray(data)) {
//     data.forEach((element, index) => {
//       const productItem = createProductItem(element, index);
//       productList.appendChild(productItem);
//     });
//   } else {
//     console.error("Data is not an array:", data);
//   }
// };
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
