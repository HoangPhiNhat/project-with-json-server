const baseURL = "http://localhost:3000/products";
const productList = document.getElementById("productList");

const query = {
  _page: 1,
  _per_page: 10,
  _sort: null,
  _order: null,
  name: null,
};
const sortPrice = () => {
  if (query._sort === null) {
    query._sort = "-price";
  } else if (query._sort === "-price") {
    query._sort = "price";
  } else {
    query._sort = null;
  }
  fetchProducts();
};
const getValueForSearch = () => {
  const value = document.getElementById("searchInput").value;
  if (value !== "") {
    query.name = value;
    console.log(query.name);
  } else {
    // console.log(123);
    query.name = null;
  }
  fetchProducts();
};
const keys = Object.keys(query);
let nextURL = null;
let numberPages = null;
const fetchProducts = async () => {
  let url = baseURL + `?`;
  // dùng Object.keys(query) để lấy ra các key trong object query => dung vong for để lặp qua từng key
  // => Lấy key và value tương ứng trong query để gán param vào url
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (key !== "_page" && key !== "_per_page") {
      if (key === "_sort") {
        if (query[key] === "-price" || query[key] === "price") {
          url += `&${key}=${query[key]}`;
        } else {
          url;
        }
      }
      if (key === "name") {
        if (query[key] !== null) {
          console.log(query[key]);
          url += `&${key}=${query[key]}`;
        } else {
          url;
        }
      }
      continue;
    }
    // console.log("key:", key, query[key]);
    if (index !== 0) {
      url += "&";
    }
    url += `${key}=${query[key]}`;
    console.log(url);
    // console.log(index, keys.length - 1);
  }
  const res = await fetch(url);
  const data = await res.json();
  nextURL = data.next;
  productList.innerHTML = "";
  data.data.forEach((element, index) => {
    const productItem = createProductItem(element, index);
    productList.appendChild(productItem);
  });
  let pageNumber = document.getElementById("pages");
  pageNumber.innerHTML = "";
  let currentPage = query._page;
  for (let i = 1; i <= data.pages; i++) {
    const li = document.createElement("li");
    li.textContent = i;
    if (i === currentPage) {
      li.classList.add("active");
    }
    li.addEventListener("click", async () => {
      currentPage = i;
      query._page = i;
      productList.innerHTML = "";
      await fetchProducts();
      li.classList.add("active");
    });
    pageNumber.appendChild(li);
  }
};

const nextPage = async () => {
  if (nextURL !== null) {
    productList.innerHTML = "";
    query._page++;
    await fetchProducts();
  }
};

const prevPage = async () => {
  if (query._page > 1) {
    productList.innerHTML = "";
    query._page--;
    await fetchProducts();
  }
};
fetchProducts();
const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const productItem = document.getElementById(`productItem-${id}`);
      if (productItem) {
        productItem.remove();
      }
    } else {
      throw new Error("Xóa sản phẩm không thành công!");
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
  }
};
let editingProductId = null;
const openUpdateModal = async (id) => {
  console.log(`Sửa: ${id}`);
  editingProductId = id;
  const res = await fetch(`${baseURL}/${id}`);
  const data = await res.json();
  let nameInput = document.getElementById("name-edit");
  let priceInput = document.getElementById("price-edit");
  nameInput.value = data.name;
  priceInput.value = data.price;
};

const handleUpdateProduct = async () => {
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
const createProductItem = (element, index) => {
  const newElm = document.createElement("tr");
  newElm.classList.add(`productItem-${element.id}`);
  newElm.innerHTML = `
      <th scope="row">${(query._page - 1) * query._per_page + index + 1}</th>
      <td>${element.name}</td>
      <td>${element.price}</td>
      <td>
          <button type="button" class="btn btn-outline-info" onclick="deleteProduct('${
            element.id
          }')">Xóa</button>
          <button data-toggle="modal" data-target="#modalEditProduct" class="btn btn-outline-warning" onclick="openUpdateModal('${
            element.id
          }')">Sửa</button>
      </td>
  `;
  return newElm;
};
