
// PRODUCT DATABASE
const products = [
    {
        id: 1,
        name: "Women's Fashion Dress",
        price: 1800,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500"
    },
    {
        id: 2,
        name: "Men's Casual Shirt",
        price: 1200,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 2500,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 3200,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 5,
        name: "Running Shoes",
        price: 2800,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 6,
        name: "Classic Sneakers",
        price: 2200,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=500"
    },
    {
        id: 7,
        name: "Stylish Handbag",
        price: 1900,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
    },
    {
        id: 8,
        name: "Sunglasses",
        price: 900,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    }
];

// SAVE AND LOAD DATA
let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("shopEaseWishlist")) || [];

// FORMAT PRICE
function formatPrice(price) {
    return "Rs. " + price.toLocaleString("en-IN");
}

// DISPLAY PRODUCTS
function displayProducts(category = "All", search = "") {
    const grid = document.getElementById("productGrid");

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            category === "All" || product.category === category;

        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        grid.innerHTML = "<p>No products found. Try another search.</p>";
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}"
                     loading="lazy">

                <button class="wishlist-btn ${wishlist.includes(product.id) ? "liked" : ""}"
                    onclick="toggleWishlist(${product.id})"
                    aria-label="Add to wishlist">
                    <i class="fas fa-heart"></i>
                </button>
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)}</p>
                <button class="add-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add To Cart
                </button>
            </div>
        </div>
    `).join("");
}

// CATEGORY FILTER
let currentCategory = "All";

document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category-btn.active")
            ?.classList.remove("active");

        button.classList.add("active");
        currentCategory = button.dataset.category;

        displayProducts(
            currentCategory,
            document.getElementById("searchInput").value
        );
    });
});

// PRODUCT SEARCH
function searchProducts() {
    const search = document.getElementById("searchInput").value;
    displayProducts(currentCategory, search);
}

document.getElementById("searchBtn")
    .addEventListener("click", searchProducts);

document.getElementById("searchInput")
    .addEventListener("input", searchProducts);

// ADD TO CART
function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    saveCart();
    updateCart();

    alert("Product successfully added to your cart!");
}

// SAVE CART
function saveCart() {
    localStorage.setItem("shopEaseCart", JSON.stringify(cart));
}

// UPDATE CART
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            totalItems += item.quantity;
            totalPrice += product.price * item.quantity;
        }
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket fa-3x"></i>
                <p>Your cart is empty!</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>${formatPrice(product.price * item.quantity)}</p>

                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                </div>

                <button class="remove-btn"
                    onclick="removeFromCart(${product.id})"
                    aria-label="Remove product">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join("");
}

// CHANGE QUANTITY
function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    updateCart();
}

// REMOVE PRODUCT
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCart();
}

// OPEN AND CLOSE CART
function toggleCart() {
    document.getElementById("cartPanel").classList.toggle("open");
    document.getElementById("cartOverlay").classList.toggle("show");
}

// WISHLIST
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        alert("Product removed from wishlist!");
    } else {
        wishlist.push(id);
        alert("Product added to wishlist!");
    }

    localStorage.setItem("shopEaseWishlist", JSON.stringify(wishlist));

    document.getElementById("wishCount").textContent = wishlist.length;

    displayProducts(
        currentCategory,
        document.getElementById("searchInput").value
    );
}

// SHOW WISHLIST
function showWishlist() {
    const items = products.filter(product => wishlist.includes(product.id));

    if (items.length === 0) {
        alert("Your wishlist is empty!");
        return;
    }

    alert(
        "YOUR WISHLIST\n\n" +
        items.map(item => item.name + " - " + formatPrice(item.price)).join("\n")
    );
}

// CHECKOUT DEMO
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some products first.");
        return;
    }

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const customerName = prompt("Enter your full name:");

    if (!customerName || !customerName.trim()) {
        alert("Please enter your name to continue.");
        return;
    }

    const address = prompt("Enter your delivery address:");

    if (!address || !address.trim()) {
        alert("Please enter your delivery address.");
        return;
    }

    alert(
        "ORDER CONFIRMED!\n\n" +
        "Customer: " + customerName + "\n" +
        "Delivery Address: " + address + "\n" +
        "Total Amount: " + formatPrice(total) +
        "\n\nThank you for shopping with ShopEase!"
    );

    cart = [];
    saveCart();
    updateCart();
    toggleCart();
}

// NEWSLETTER SUBSCRIPTION
document.getElementById("newsletterForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("emailInput").value;

        alert("Thank you for subscribing, " + email + "!");

        this.reset();
    });

// INITIALIZE WEBSITE
displayProducts();
updateCart();

document.getElementById("wishCount").textContent = wishlist.length;
