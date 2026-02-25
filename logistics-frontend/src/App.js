import React, { useState, useEffect } from 'react';
import './App.css';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:8080'; 

// --- DATA ---
const MOCK_PRODUCTS = [
  { id: 1, name: "Smartphone 📱", weight: 0.5, price: 699 },
  { id: 2, name: "Laptop 💻", weight: 2.5, price: 1200 },
  { id: 3, name: "Microwave ☢️", weight: 15.0, price: 150 },
  { id: 4, name: "Washing Machine 🧺", weight: 60.0, price: 450 },
  { id: 5, name: "Book 📚", weight: 0.3, price: 15 },
  { id: 6, name: "Gaming Chair 🪑", weight: 20.0, price: 250 },
];

function App() {
  // --- GLOBAL STATE ---
  const [view, setView] = useState("LOGIN"); // "LOGIN", "SHOP", "ADMIN"
  const [userRole, setUserRole] = useState(""); 
  
  // --- LOGIN STATE ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- SHOP STATE ---
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [destination, setDestination] = useState("");
  const [shippingType, setShippingType] = useState("STANDARD");
  const [shopMessage, setShopMessage] = useState("");
  const [shippingFee, setShippingFee] = useState(0.0);

  // --- ADMIN STATE ---
  const [analytics, setAnalytics] = useState(null);
  const [vehicleType, setVehicleType] = useState("TRUCK");
  const [licensePlate, setLicensePlate] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [vehicles, setVehicles] = useState([]);

  // --- HELPERS ---
  const getTotalWeight = () => cart.reduce((sum, item) => sum + item.weight, 0);
  const getTotalProductPrice = () => cart.reduce((sum, item) => sum + item.price, 0);
  
  const resetShopForm = () => {
    setCart([]);
    setCustomerName("");
    setDestination("");
    setShippingType("STANDARD");
    setShippingFee(0.0);
  };

  // --- EFFECT: LIVE SHIPPING CALCULATION ---
  useEffect(() => {
    if (view !== "SHOP" || cart.length === 0) {
      setShippingFee(0);
      return;
    }
    
    const fetchFee = async () => {
      try {
        const weight = getTotalWeight();
        const res = await fetch(`${API_BASE_URL}/orders/calculate-fee?type=${shippingType}&weight=${weight}`);
        if (res.ok) {
          const cost = await res.json();
          setShippingFee(cost);
        }
      } catch (err) {
        console.error("Calculation API error:", err);
      }
    };

    fetchFee();
  }, [cart, shippingType, view]);

  // --- HANDLERS ---
  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setUserRole("ADMIN");
      setView("ADMIN");
      setLoginError("");
      loadAnalytics();
      loadVehicles(); 
    } else if (username === "user" && password === "1234") {
      setUserRole("USER");
      setView("SHOP");
      setLoginError("");
    } else {
      setLoginError("Λάθος στοιχεία! Ελέγξτε τα Demo Credentials.");
    }
  };

  const handleLogout = () => {
    setView("LOGIN");
    setUserRole("");
    setUsername("");
    setPassword("");
    setShopMessage("");
    setAdminMessage("");
    resetShopForm();
  };

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (i) => setCart(cart.filter((_, index) => index !== i));

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Το καλάθι είναι άδειο!");
    if (!customerName || !destination) return alert("Παρακαλώ συμπληρώστε Όνομα και Προορισμό!");

    const orderData = { customerName, destination, shippingType, weight: getTotalWeight() };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        const id = await response.text();
        setShopMessage(`✅ Η παραγγελία καταχωρήθηκε! ID: ${id} (Μεταφορικά: ${shippingFee.toFixed(2)}€)`);
        resetShopForm();
      } else {
        setShopMessage("❌ Αποτυχία καταχώρησης παραγγελίας.");
      }
    } catch (err) {
      console.error(err);
      setShopMessage("❌ Σφάλμα δικτύου. Ελέγξτε αν τρέχει ο Server.");
    }
  };

  // --- ADMIN FUNCTIONS ---
  const createVehicle = async () => {
    if (!licensePlate) return alert("Παρακαλώ εισάγετε πινακίδα!");

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: vehicleType, licensePlate })
      });

      if (response.ok) {
        setAdminMessage(`🚛 Το όχημα ${vehicleType} (${licensePlate}) δημιουργήθηκε!`);
        setLicensePlate("");
        loadVehicles(); 
      }
    } catch (err) {
      setAdminMessage("❌ Σφάλμα σύνδεσης με τον Server.");
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`);
      if (res.ok) setAnalytics(await res.json());
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles`);
      if (res.ok) setVehicles(await res.json());
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  // --- VIEWS ---

  if (view === "LOGIN") {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, maxWidth: "400px", margin: "100px auto", textAlign: "center"}}>
          <h1>🔐 Logistics Login</h1>
          
          <input style={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin} style={styles.actionBtn}>Login</button>
          
          {loginError && <p style={{color: "red", marginTop: "10px"}}>{loginError}</p>}

          <div style={{marginTop: "25px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", textAlign: "left", fontSize: "0.9em", border: "1px solid #dee2e6"}}>
            <p style={{margin: "0 0 10px 0", fontWeight: "bold", color: "#495057"}}>ℹ️ Demo Credentials:</p>
            <div style={{marginBottom: "5px"}}>👤 <strong>User:</strong> <code>user</code> / <code>1234</code></div>
            <div>👮 <strong>Admin:</strong> <code>admin</code> / <code>admin</code></div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "SHOP") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
            <h2>🛍️ Logistics E-Shop</h2>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout ({userRole})</button>
        </div>
        
        {shopMessage && <div style={styles.successBox}>{shopMessage}</div>}

        <div style={{display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px"}}>
          {/* Products */}
          <div style={styles.card}>
            <h3>Products</h3>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px"}}>
              {MOCK_PRODUCTS.map(p => (
                <button key={p.id} onClick={() => addToCart(p)} style={styles.productBtn}>
                  <b>{p.name}</b><br/>{p.price}€ <small>({p.weight}kg)</small>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div style={styles.card}>
            <h3>My Cart ({cart.length})</h3>
            <ul style={{paddingLeft: "20px", maxHeight: "150px", overflowY: "auto"}}>
               {cart.map((item, i) => <li key={i}>{item.name} <span style={{color:"red", cursor:"pointer"}} onClick={()=>removeFromCart(i)}>[x]</span></li>)}
            </ul>
            <hr/>
            
            <div style={{lineHeight: "1.6"}}>
                <div>Products: <strong>{getTotalProductPrice()} €</strong></div>
                <div>Weight: <strong>{getTotalWeight().toFixed(1)} kg</strong></div>
                <div style={{color: "#d35400"}}>
                    Shipping Fee: <strong>{shippingFee.toFixed(2)} €</strong>
                </div>
                <div style={{borderTop: "1px solid #eee", marginTop: "5px", paddingTop: "5px", fontSize: "1.2em", fontWeight: "bold"}}>
                    TOTAL: {(getTotalProductPrice() + shippingFee).toFixed(2)} €
                </div>
            </div>
            
            <hr/>

            <input style={styles.input} placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            <input style={styles.input} placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
            
            <label style={{fontWeight: "bold", display: "block", marginBottom: "5px"}}>Shipping Method:</label>
            <select style={styles.input} value={shippingType} onChange={e => setShippingType(e.target.value)}>
               <option value="STANDARD">Standard</option>
               <option value="EXPRESS">Express</option>
               <option value="FREE">Free</option>
            </select>
            
            <button onClick={handleCheckout} style={styles.actionBtn}>Place Order</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "ADMIN") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
            <h2>👮 Admin Dashboard</h2>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout ({userRole})</button>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
            
            {/* Fleet Management */}
            <div style={styles.card}>
                <h3>🚛 Fleet Management</h3>
                {adminMessage && <p style={{color: "green"}}>{adminMessage}</p>}
                
                <label style={{fontWeight: "bold", display: "block", marginBottom: "5px"}}>Add New Vehicle:</label>
                <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                    <select style={{...styles.input, marginBottom: 0}} value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                        <option value="TRUCK">Truck</option>
                        <option value="VAN">Van</option>
                        <option value="DRONE">Drone</option>
                    </select>
                    <input style={{...styles.input, marginBottom: 0}} placeholder="Plate Number" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} />
                    <button onClick={createVehicle} style={{...styles.actionBtn, width: "auto"}}>Add</button>
                </div>

                <hr style={{border: "0", borderTop: "1px solid #eee", marginBottom: "15px"}}/>
                
                <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
                    <h4 style={{margin: 0}}>📋 Active Fleet ({vehicles.length})</h4>
                    <button onClick={loadVehicles} style={{cursor: 'pointer', background: 'none', border: 'none', color: '#007bff'}}>🔄 Refresh</button>
                </div>
                
                <ul style={{paddingLeft: "20px", maxHeight: "150px", overflowY: "auto", marginTop: "10px"}}>
                    {vehicles.length > 0 ? (
                        vehicles.map((v, i) => (
                            <li key={i} style={{marginBottom: "8px"}}>
                                <strong>{v.type}</strong> <span style={{color: "#666"}}>({v.licensePlate})</span>
                            </li>
                        ))
                    ) : (
                        <p style={{color: "#999", fontSize: "0.9em"}}>No vehicles added yet.</p>
                    )}
                </ul>
            </div>

            {/* Analytics */}
            <div style={styles.card}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
                    <h3 style={{margin: 0}}>📊 Live Analytics</h3>
                    <button onClick={loadAnalytics} style={{...styles.actionBtn, width: "auto", padding: "5px 10px"}}>🔄 Refresh</button>
                </div>
                
                {analytics ? (
                    <div style={{marginTop: "15px", display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <div style={{padding: "10px", background: "#e8f5e9", borderLeft: "5px solid #28a745", borderRadius: '4px'}}>
                            Shipping Revenue: <strong style={{fontSize: "1.2em"}}>{analytics.totalCost.toFixed(2)} €</strong>
                        </div>
                        <div style={{padding: "10px", background: "#fff3e0", borderLeft: "5px solid #fd7e14", borderRadius: '4px'}}>
                            <div style={{fontWeight: 'bold', color: '#d35400', marginBottom: '5px'}}>🏆 Most Expensive Order</div>
                            {analytics.mostExpensiveOrder ? 
                                <div>
                                    👤 {analytics.mostExpensiveOrder.customerName}<br/>
                                    📍 {analytics.mostExpensiveOrder.destination}<br/>
                                    💰 <strong>{analytics.mostExpensiveOrder.cost} €</strong>
                                </div> : "No orders yet."}
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <strong>Orders per City:</strong>
                            <ul style={{margin: 0, paddingLeft: '20px', marginTop: '5px'}}>
                                {analytics.ordersByDestination && Object.keys(analytics.ordersByDestination).map(city => (
                                    <li key={city}>{city}: <strong>{analytics.ordersByDestination[city].length}</strong></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : <p style={{color: "#666"}}>Loading data...</p>}
            </div>
        </div>
      </div>
    );
  }
}

// --- STYLES ---
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: "20px", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid #ddd" },
  card: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  input: { padding: "10px", width: "100%", marginBottom: "10px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "5px", outline: "none" },
  actionBtn: { padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%", fontWeight: "bold", transition: "background 0.2s" },
  logoutBtn: { padding: "8px 15px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  productBtn: { padding: "15px", border: "1px solid #eee", borderRadius: "8px", cursor: "pointer", backgroundColor: "#fdfdfd", textAlign: "left", transition: "transform 0.1s, box-shadow 0.1s" },
  successBox: { padding: "12px", backgroundColor: "#d4edda", color: "#155724", marginBottom: "20px", borderRadius: "5px", borderLeft: "5px solid #28a745" }
};

export default App;