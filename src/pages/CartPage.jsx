import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import { MdShoppingCartCheckout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../component/BreadCrumb";
import { useSelector } from "react-redux";

const CartPage = ({ cartItems: initialCartItems, onCartUpdate }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [allSelected, setAllSelected] = useState(true);
  const accessToken = sessionStorage.getItem("accessToken");
  const allUserData = useSelector((state) => state.user.data);

  useEffect(() => {
    if (initialCartItems?.length) {
      const itemsWithSelection = initialCartItems.map((item) => ({
        ...item,
        selected: item.selected ?? true,
      }));
      setCartItems(itemsWithSelection);
    } else {
      setCartItems([]);
    }
  }, [initialCartItems]);

  const handleShopNow = () => {
    navigate("/");
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    onCartUpdate(updatedCart);
    if (updatedCart.length === 0) {
      navigate("/");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => (item.selected ? sum + item.quantity * item.price : sum),
    0
  );

  const totalQuantity = cartItems.reduce(
    (sum, item) => (item.selected ? sum + item.quantity : sum),
    0
  );

  const toggleSelect = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updated);
  };

  const toggleSelectAll = () => {
    const newSelected = !allSelected;
    setCartItems(cartItems.map((item) => ({ ...item, selected: newSelected })));
    setAllSelected(newSelected);
  };

  useEffect(() => {
    const allChecked = cartItems.every((item) => item.selected);
    setAllSelected(allChecked);
  }, [cartItems]);

  const proceedToCheckout = () => {
    if (!totalQuantity > 0) {
      toast.error("Add at least one product.");
      return;
    }
    if (accessToken && totalQuantity > 0) {
      toast.success("Order placed successfully!");
      setCartItems([]);
      if (onCartUpdate) onCartUpdate([]);
      navigate("/");
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (allUserData?.role === "admin") {
      navigate("/");
    }
  }, [accessToken]);
  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Cart", active: true },
  ];
  return (
    <div className="container minHeight">
      <div className="row py-4">
        <div className="col-6">
          <BreadCrumb items={breadcrumbItems} />
        </div>
        <div className="col-6 text-end">
          <h2 className="mb-0">🛒 Your Cart</h2>
        </div>
        <div className="col-auto d-flex align-items-center">
          {cartItems.length > 0 && (
            <>
              <input
                type="checkbox"
                checked={allSelected}
                id="selectAll"
                onChange={toggleSelectAll}
                className="form-check-input me-2"
              />
              <label htmlFor="selectAll" className="form-check-label">
                Select All
              </label>
            </>
          )}
        </div>
      </div>
      {cartItems.length === 0 ? (
        <>
          <p className="text-center text-danger mb-0">Your cart is empty.</p>
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-outline-success" onClick={handleShopNow}>
              <IoAddOutline className="me-1 fs-5" /> Add Product
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div className="col-12 mb-4" key={item.id}>
                <div
                  className={`card p-3 d-block d-sm-flex flex-row  ${
                    item.selected ? "bg-body-secondary shadow" : "bg-white"
                  }`}
                >
                  <div className="d-flex justify-content-between mb-2 mb-sm-0">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="form-check-input me-4"
                    />
                    <div
                      onClick={() => handleRemove(item.id)}
                      className="text-danger fs-3 d-flex d-sm-none"
                      style={{ cursor: "pointer" }}
                    >
                      <AiOutlineDelete />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="me-0 me-sm-4 rounded"
                    />
                  </div>
                  <div className="flex-grow-1 w-sm-75 mt-2 mb-sm-0">
                    <h5>{item.title}</h5>
                    <p className="mb-1 mb-sm-2">Quantity: {item.quantity}</p>
                    <p className="mb-0 mb-sm-2">
                      Price: ${item.price} x {item.quantity} ={" "}
                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </p>
                  </div>
                  <div
                    onClick={() => handleRemove(item.id)}
                    className="text-danger fs-3 align-items-start d-none d-sm-flex"
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineDelete />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-end">
            <h4 className="fs-5">Total Quantity: {totalQuantity}</h4>
            <h4 className="fs-5">Total: ${totalPrice.toFixed(2)}</h4>
          </div>
          <div className="row my-4">
            <div className="col-auto">
              <button
                className="btn btn-outline-success px-3 rounded-5"
                onClick={handleShopNow}
              >
                <IoAddOutline className="me-1 fs-5" /> Add Product
              </button>
            </div>
            <div className="col d-flex justify-content-end">
              <button
                className="btn btn-success px-3 rounded-5"
                onClick={proceedToCheckout}
              >
                <MdShoppingCartCheckout className="me-1 fs-5" /> Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
