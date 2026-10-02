// ================= MENU DATA =================

const menu = [

    {
        id: 1,
        name: "Vada Pav",
        price: 30,
        category: "Snacks",
        emoji: "🍔",
        available: true
    },

    {
        id: 2,
        name: "Masala Pav",
        price: 50,
        category: "Snacks",
        emoji: "🥪",
        available: true
    },

    {
        id: 3,
        name: "Paneer Roll",
        price: 90,
        category: "Meals",
        emoji: "🌯",
        available: true
    },

    {
        id: 4,
        name: "Veg Thali",
        price: 120,
        category: "Meals",
        emoji: "🍱",
        available: true
    },

    {
        id: 5,
        name: "Cold Coffee",
        price: 60,
        category: "Drinks",
        emoji: "🥤",
        available: true
    },

    {
        id: 6,
        name: "Lemon Soda",
        price: 40,
        category: "Drinks",
        emoji: "🍋",
        available: true
    }

];


// ================= VARIABLES =================

let cart = [];

let orders = [];


// ================= CUSTOMER / VENDOR =================

function showCustomer() {

    document.getElementById("customer")
        .classList.remove("hidden");

    document.getElementById("vendor")
        .classList.add("hidden");

    document.querySelectorAll("nav button")[0]
        .classList.add("active");

    document.querySelectorAll("nav button")[1]
        .classList.remove("active");

}


function showVendor() {

    document.getElementById("customer")
        .classList.add("hidden");

    document.getElementById("vendor")
        .classList.remove("hidden");

    document.querySelectorAll("nav button")[0]
        .classList.remove("active");

    document.querySelectorAll("nav button")[1]
        .classList.add("active");

    renderVendor();

}


// ================= MENU =================

function displayMenu() {

    const category =
        document.getElementById("category").value;

    const items = menu.filter(item => {

        return item.available &&
            (category === "All" ||
             item.category === category);

    });


    document.getElementById("menu").innerHTML =

        items.map(item => `

            <div class="menu-card">

                <div class="food">
                    ${item.emoji}
                </div>

                <div class="menu-info">

                    <h3>${item.name}</h3>

                    <small>
                        ${item.category}
                    </small>

                    <div class="price">
                        ₹${item.price}
                    </div>

                </div>

                <button
                    class="add"
                    onclick="addToCart(${item.id})">

                    + Add

                </button>

            </div>

        `).join("");

}


// ================= CART =================

function addToCart(id) {

    const item =
        menu.find(x => x.id === id);

    const existing =
        cart.find(x => x.id === id);


    if (existing) {

        existing.quantity++;

    }

    else {

        cart.push({

            ...item,

            quantity: 1

        });

    }


    renderCart();

}


function changeQuantity(id, amount) {

    const item =
        cart.find(x => x.id === id);

    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(x => x.id !== id);

    }


    renderCart();

}


function renderCart() {

    const cartContainer =
        document.getElementById("cartItems");

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    document.getElementById("cartCount")
        .innerText = count;


    document.getElementById("total")
        .innerText = "₹" + total;


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p class="empty">
                Your cart is empty
            </p>
        `;

        return;

    }


    cartContainer.innerHTML =

        cart.map(item => `

            <div class="cart-item">

                <div>

                    <b>
                        ${item.name}
                    </b>

                    <small>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </small>

                </div>

                <div class="qty">

                    <button
                        onclick="changeQuantity(
                            ${item.id}, -1
                        )">

                        −

                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(
                            ${item.id}, 1
                        )">

                        +

                    </button>

                </div>

            </div>

        `).join("");

}


// ================= CHECKOUT =================

function checkout() {

    if (cart.length === 0) {

        alert(
            "Please add an item to your cart first."
        );

        return;

    }


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    document.getElementById("summary")
        .innerHTML =

        cart.map(item => `

            <p>
                ${item.name}
                ×
                ${item.quantity}
                —
                ₹${item.price *
                   item.quantity}
            </p>

        `).join("") +

        `<hr>

         <b>
            Total: ₹${total}
         </b>`;


    document
        .getElementById("checkoutModal")
        .classList.remove("hidden");

}


function closeCheckout() {

    document
        .getElementById("checkoutModal")
        .classList.add("hidden");

}


// ================= PLACE ORDER =================

function placeOrder() {

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    if (!name) {

        alert("Please enter your name.");

        return;

    }


    const payment =
        document
            .getElementById("payment")
            .value;


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const orderId =
        "MT-" +
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const order = {

        id: orderId,

        customer: name,

        payment: payment,

        total: total,

        status: "NEW",

        items:
            cart.map(
                item =>
                    `${item.name} × ${item.quantity}`
            )

    };


    orders.unshift(order);


    document
        .getElementById("checkoutModal")
        .classList.add("hidden");


    document
        .getElementById("successMessage")
        .innerText =

        `Order ${orderId} has been sent to the vendor kitchen. Payment method: ${payment}.`;


    document
        .getElementById("successModal")
        .classList.remove("hidden");


    cart = [];

    renderCart();

}


// ================= SUCCESS =================

function closeSuccess() {

    document
        .getElementById("successModal")
        .classList.add("hidden");

    showVendor();

}


// ================= VENDOR DASHBOARD =================

function renderVendor() {

    const revenue =
        orders.reduce(
            (sum, order) =>
                sum + order.total,
            0
        );


    const activeOrders =
        orders.filter(
            order =>
                order.status !== "COMPLETED"
        ).length;


    document.getElementById("orderStat")
        .innerText = orders.length;


    document.getElementById("revenueStat")
        .innerText = "₹" + revenue;


    document.getElementById("capacityStat")
        .innerText =
        activeOrders + " / 10";


    document.getElementById("itemsStat")
        .innerText = menu.length;


    renderOrders();

    renderVendorMenu();

}


// ================= ORDERS =================

function renderOrders() {

    const container =
        document.getElementById("orders");


    if (orders.length === 0) {

        container.innerHTML = `

            <p class="empty">
                No orders yet.<br>
                Place an order from Customer view.
            </p>

        `;

        return;

    }


    const statuses = [

        "NEW",

        "ACCEPTED",

        "PREPARING",

        "READY",

        "COMPLETED"

    ];


    container.innerHTML =

        orders.map(order => `

            <div class="order-card">

                <div class="order-top">

                    <b>
                        #${order.id}
                        —
                        ${order.customer}
                    </b>

                    <small>
                        ${order.payment}
                    </small>

                </div>


                <div class="order-items">

                    ${order.items.join(", ")}

                    <br>

                    <b>
                        Total ₹${order.total}
                    </b>

                </div>


                <select
                    class="status"
                    onchange="
                        updateOrder(
                            '${order.id}',
                            this.value
                        )
                    ">

                    ${

                        statuses.map(
                            status => `

                                <option
                                    ${
                                        status ===
                                        order.status
                                        ? "selected"
                                        : ""
                                    }>

                                    ${status}

                                </option>

                            `
                        ).join("")

                    }

                </select>

            </div>

        `).join("");

}


// ================= UPDATE ORDER =================

function updateOrder(id, status) {

    const order =
        orders.find(
            x => x.id === id
        );


    if (order) {

        order.status = status;

    }


    renderVendor();

}


// ================= MENU MANAGEMENT =================

function renderVendorMenu() {

    document.getElementById("vendorMenu")
        .innerHTML =

        menu.map(item => `

            <div class="menu-row">

                <div>

                    <b>
                        ${item.emoji}
                        ${item.name}
                    </b>

                    <small>
                        ₹${item.price}
                        •
                        ${item.category}
                    </small>

                    <span
                        class="
                        ${item.available
                            ? "available"
                            : "sold"}
                        ">

                        ${
                            item.available
                            ? "● Available"
                            : "● Sold Out"
                        }

                    </span>

                </div>


                <button
                    class="toggle"
                    onclick="
                        toggleItem(
                            ${item.id}
                        )
                    ">

                    ${
                        item.available
                        ? "Mark Sold Out"
                        : "Make Available"
                    }

                </button>

            </div>

        `).join("");

}


// ================= TOGGLE MENU =================

function toggleItem(id) {

    const item =
        menu.find(
            x => x.id === id
        );


    if (item) {

        item.available =
            !item.available;

    }


    displayMenu();

    renderVendor();

}


// ================= INITIAL LOAD =================

displayMenu();

renderCart();
