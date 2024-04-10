import axios from "axios";

async function addToCart(productId, setTrigger) {
    axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/cart/${productId}`,
        { quantity: 1 },
        { withCredentials: true }
    )
        .then((response) => {
            if (response) setTrigger(prevValue => !prevValue)
        })
        .catch((error) => console.log(error));
}

async function updateInCart(productId, quantity, setTrigger) {
    axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/user/cart/${productId}`,
        { quantity: quantity },
        { withCredentials: true }
    )
        .then((response) => {
            if (response) setTrigger((prevValue) => !prevValue);
        })
        .catch((error) => console.log(error));
};

async function removeFromCart(productId, setTrigger) {
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/user/cart/${productId}`, {
        withCredentials: true,
    })
        .then((response) => {
            if (response) setTrigger((prevValue) => !prevValue);
        })
        .catch((error) => console.log(error));
};

export { addToCart, updateInCart, removeFromCart };