"use strict";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

const restaurantTitle = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const minPrice = document.querySelector(".price");
const category = document.querySelector(".category");

const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

const inputSearch = document.querySelector(".input-search");

let login = localStorage.getItem("gloDelivery");

const cart = [];


const loadCart = () => {
    if (localStorage.getItem(login)) {
        // // JSON.parse(localStorage.getItem(login)).forEach(function (item) {
        // //     cart.push(item);
        // })
        cart.push(...JSON.parse(localStorage.getItem(login)));
    }
};


const saveCart = () => {
    localStorage.setItem(login, JSON.stringify(cart))
};


const getData = async (url) => {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }

    return await response.json();
};


const toggleModal = () => {
    modal.classList.toggle("is-open");
};

const toggleModalAuth = () => {
    loginInput.style.borderColor = "";
    modalAuth.classList.toggle("is-open");
};

const returnMain = () => {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
};

const autorized = () => {

    const logOut = () => {
        login = null;
        cart.length = 0;
        localStorage.removeItem("gloDelivery");

        buttonAuth.style.display = "";
        userName.style.display = "";
        buttonOut.style.display = "";
        cartButton.style.display = '';
        buttonOut.removeEventListener("click", logOut);

        checkAuth();
        returnMain();
    };

    console.log("Авторизован");

    userName.textContent = login;
    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "flex";
    cartButton.style.display = 'flex';

    buttonOut.addEventListener("click", logOut);
    loadCart();
};


const noAutorized = () => {
    // loginInput.required = true;
    // loginInput.setAttribute("required", "");
    console.log("Не авторизован");

    const logIn = event => {
        event.preventDefault();

        if (valid(loginInput.value)) {
            loginInput.style.borderColor = "";
            login = loginInput.value;
            localStorage.setItem("gloDelivery", login);

            toggleModalAuth();

            buttonAuth.removeEventListener("click", toggleModalAuth);
            closeAuth.removeEventListener("click", toggleModalAuth);
            logInForm.removeEventListener("submit", logIn);
            logInForm.reset();

            checkAuth();
        } else {
            loginInput.style.borderColor = "red";
            loginInput.value = "";
        }
    };

    buttonAuth.addEventListener("click", toggleModalAuth);
    closeAuth.addEventListener("click", toggleModalAuth);
    logInForm.addEventListener("submit", logIn);
};

const checkAuth = () => login ? autorized() : noAutorized();


const createCardRestaurant = (restaurant) => {

    // console.log(restaurant);

    const {
        image,
        kitchen,
        name,
        price,
        stars,
        products,
        time_of_delivery: timeOfDelivery,
    } = restaurant;

    const card1 = document.createElement("a");
    // card1.classList.add("card");
    // card1.classList.add("card-restaurant");
    card1.className = "card card-restaurant"; // передача без data-атрибутов
    card1.products = products;
    card1.info = [name, price, stars, kitchen];

    card1.insertAdjacentHTML("beforeend", `
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery}</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
    
    `);
    // console.dir(card1);


    const card = `
        <a class="card card-restaurant" 
            data-products="${products}"
            data-info="${[name, price, stars, kitchen]}"
            >
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery}</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `;

    // cardsRestaurants.insertAdjacentHTML("beforeend", card);
    cardsRestaurants.insertAdjacentElement("beforeend", card1); // лучше чем inner
};


const createCardGood = ({description, image, name, price, id}) => {

    console.log(description, image, name, price, id);

    const card = document.createElement("div");
    card.className = "card";
    card.insertAdjacentHTML("beforeend", `
            <img src="${image}" alt="${name}" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${description}</div>
                </div>
                <div class="card-buttons">
                     <button class="button button-primary button-add-cart" id="${id}">
                           <span class="button-card-text">В корзину</span>
                           <span class="button-cart-svg"></span>
                     </button>
                     <strong class="card-price-bold card-price">${price} ₽</strong>
                </div>
            </div>
    `);

    // console.log(card);
    cardsMenu.insertAdjacentElement("beforeend", card);
};

// открываем меню ресторана
const openGoods = event => {
    const target = event.target;
    if (login) {

        const restaurant = target.closest(".card-restaurant");
        console.dir(restaurant); // карточка ресторана стр.157

        if (restaurant) {
            // console.log(restaurant.dataset.info.split(",")); // при создании карточки через стр. 160
            // console.log(restaurant.dataset.products); // при создании карточки через стр. 160

            // const info = restaurant.dataset.info.split(",");  // при создании карточки через стр. 160
            // const [name, price, stars, kitchen] = info; // при создании карточки через стр. 160
            const [name, price, stars, kitchen] = restaurant.info;

            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            restaurantTitle.textContent = name;
            rating.textContent = stars;
            minPrice.textContent = `От ${price} ₽`;
            category.textContent = kitchen;

            // getData(`./db/${restaurant.dataset.products}`).then(function (data) { // при создании карточки через стр. 160
            getData(`./db/${restaurant.products}`)
                .then(data => data.forEach(createCardGood));
        }
    } else {
        toggleModalAuth();
    }
};


const addToCart = event => {
    const target = event.target;
    const buttonAddToCart = target.closest('.button-add-cart');

    if (buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const cost = card.querySelector('.card-price').textContent;
        console.log(card);
        console.log(title);
        console.log(cost);
        const id = buttonAddToCart.id;
        console.log(buttonAddToCart);
        console.dir(buttonAddToCart);
        console.log(`id = ${id}`);

        const food = cart.find(item => item.id === id);

        if (food) {
            food.count += 1;
            console.log(food);
        } else {
            cart.push({
                id,
                title,
                cost,
                count: 1
            });
            // console.log(cart);
        }
    }
    saveCart();
};


const renderCart = () => {
    modalBody.textContent = '';
    // console.log(`cart = ${cart}`);

    cart.forEach(function ({id, title, cost, count}) {
        const itemCart = `
        <div class="food-row">
                <span class="food-name">${title}</span>
                <strong class="food-price">${cost}</strong>
                <div class="food-counter">
                    <button class="counter-button counter-minus" data-id=${id}>-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button counter-plus" data-id=${id}>+</button>
                </div>
            </div>
        `;

        modalBody.insertAdjacentHTML('afterbegin', itemCart);
    });

    const totalPrice = cart.reduce(function (result, item) {
        return result + (parseFloat(item.cost) * item.count);
    }, 0);

    modalPrice.textContent = totalPrice + ' ₽';
};


const changeCount = event => {
    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1);
            }
        }
        if (target.classList.contains('counter-plus')) food.count++;
        renderCart();
    }
    saveCart();
};


const valid = str => {
    const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    if (!nameReg.test(str)) {
        if (str.length > 20) {
            console.log("Слишком длинная строка");
        } else {
            console.log("Недопустимые символы");
        }
        return false;
    }
    return true;
};


function init() {
    getData("./db/partners.json").then(data => {
        // console.log(data);
        data.forEach(createCardRestaurant)
    });

    cartButton.addEventListener("click", renderCart);
    cartButton.addEventListener("click", toggleModal);

    buttonClearCart.addEventListener('click', () => {
        cart.length = 0;
        renderCart();
    });

    modalBody.addEventListener('click', changeCount);

    cardsMenu.addEventListener('click', addToCart);

    close.addEventListener("click", toggleModal);

    cardsRestaurants.addEventListener("click", openGoods);

    inputSearch.addEventListener("keydown", event => {
        console.log(event.keyCode);
        if (event.keyCode === 13) {
            const target = event.target;
            const value = target.value.toLowerCase().trim();

            target.value = '';

            if (!value || value.length < 3) {
                target.style.backgroundColor = 'tomato';
                setTimeout(function () {
                    target.style.backgroundColor = '';
                }, 2000);
                return;
            }

            const goods = [];

            getData("./db/partners.json")
                .then(function (data) {
                    // console.log(data);

                    const products = data.map(item => item.products);

                    products.forEach(function (product) {
                        getData(`./db/${product}`)
                            .then(function (data) {
                                // console.log(data);

                                goods.push(...data);

                                const searchGoods = goods
                                    .filter(item => item.name.toLowerCase().includes(value));

                                // console.log(goods);
                                console.log(searchGoods);

                                cardsMenu.textContent = "";
                                containerPromo.classList.add("hide");
                                restaurants.classList.add("hide");
                                menu.classList.remove("hide");

                                restaurantTitle.textContent = 'Результат поиска';
                                rating.textContent = '';
                                minPrice.textContent = '';
                                category.textContent = '';

                                return searchGoods;

                            })
                            .then(dataSearchGoods => {
                                if (dataSearchGoods.length === 0) {
                                    restaurantTitle.textContent = 'по вашему запросу ничего не найдено';
                                }
                                dataSearchGoods.forEach(createCardGood);
                            })
                    })
                });
        }
    });

    logo.addEventListener("click", returnMain);

    checkAuth();

    new Swiper(".swiper-container", {
        loop: true,
        autoplay: {
            delay: 3000,
        },
        slidesPerView: 1,
    });
};

init();


// замыкания
function foo(a, b, c, d) {
    const sum = a + b + c;

    return function (x) {
        console.log(x * sum);
    };
}

const bar = foo(1, 2, 3);
console.dir(bar);

bar(2);
bar(3);
bar(4);
