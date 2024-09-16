import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

// Create the context with default values
export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateItemQuantity: () => {}
});

// Define the reducer function
function shoppingCartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];

        // Find the index of the item in the cart
        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );

        // Retrieve the item if it exists
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            // Update the quantity if the item already exists
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            // Add the item to the cart if it does not exist
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            ...state,
            items: updatedItems,
        };
    }

    if (action.type === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];

        // Find the index of the item in the cart
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        if (updatedItemIndex === -1) {
            return state; // Item not found
        }

        // Retrieve the item and update its quantity
        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            // Remove the item from the cart if its quantity is 0 or less
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            // Update the item in the cart
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...state,
            items: updatedItems,
        };
    }

    // Return the current state if no action matches
    return state;
}

// Context provider component
export default function CartContextProvider({ children }) {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartReducer, 
        {
            items: [],
        }
    );

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM',
            payload: id
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_ITEM',
            payload: { 
                productId, 
                amount 
            }
        });
    }

    const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,
    };

    return (
        <CartContext.Provider value={ctxValue}>
            {children}
        </CartContext.Provider>
    );
}
