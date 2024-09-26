// database
const plans = [
    { id: 1, name: 'Plan Básico', price: 25000 },
    { id: 2, name: 'Plan Estándar', price: 40000 },
    { id: 3, name: 'Plan Premium', price: 55000 }
];

const addons = [
    { id: 1, name: 'Agente Especialidades Médicas', price: 10000 },
    { id: 2, name: 'Agente Especialidades Quirúrgicas', price: 8000 },
];

// var globales
let selectedPlan = JSON.parse(localStorage.getItem('selectedPlan')) || null;
let selectedAddons = JSON.parse(localStorage.getItem('selectedAddons')) || [];

// carga de planes
function loadPlans() {
    const plansContainer = document.getElementById('plans-container');
    plansContainer.innerHTML = ''; // limpia contenedor

    plans.forEach(plan => {
        const button = document.createElement('button');
        button.textContent = `${plan.name} / $${plan.price}`;
        button.classList.add('plan-button');
        
        // deja boton seleccionado
        if (selectedPlan && selectedPlan.id === plan.id) {
            button.classList.add('selected');
        }

        button.onclick = () => {
            selectPlan(plan);
            // elimina la clase 'selected' de todos los botones
            document.querySelectorAll('.plan-button').forEach(btn => btn.classList.remove('selected'));
            // agrega la clase 'selected' solo al botón seleccionado
            button.classList.add('selected');
            // habilita los botones de addons
            enableAddons(true);
        };
        plansContainer.appendChild(button);
    });
}

// seleccionar un plan
function selectPlan(plan) {
    selectedPlan = plan;
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    updateCartSummary();
}

// cargar addons
function loadAddons() {
    const addonsContainer = document.getElementById('addons-container');
    addonsContainer.innerHTML = ''; // limpia contenedor

    addons.forEach(addon => {
        const button = document.createElement('button');
        button.textContent = `${addon.name} - $${addon.price}`;
        button.classList.add('addon-button');

        // deshabilita los botones si no hay plan seleccionado
        if (!selectedPlan) {
            button.disabled = true;
        } else if (selectedAddons.find(a => a.id === addon.id)) {
            button.classList.add('selected');
        }

        button.onclick = () => {
            if (selectedPlan) { // solo permite agregar si hay un plan
                toggleAddon(addon);
                // toggle clase 'selected' en el botón actual
                button.classList.toggle('selected');
            }
        };
        addonsContainer.appendChild(button);
    });
}

// agregar/remover addons
function toggleAddon(addon) {
    const index = selectedAddons.findIndex(a => a.id === addon.id);
    if (index === -1) {
        selectedAddons.push(addon);
    } else {
        selectedAddons.splice(index, 1);
    }
    localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
    updateCartSummary();
}

// eliminar el plan seleccionado y addons desde el resumen
function removeSelectedPlan() {
    selectedPlan = null;
    selectedAddons = []; // vacía los addons seleccionados
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedAddons');
    updateCartSummary();
    loadPlans(); // recargar los botones de planes
    loadAddons(); // recargar los botones de addons
    enableAddons(false); // deshabilitar los addons si no hay plan seleccionado
}

// habilitar o deshabilitar los addons
function enableAddons(enable) {
    const addonButtons = document.querySelectorAll('.addon-button');
    addonButtons.forEach(button => {
        button.disabled = !enable;
    });
}

// actualizar el resumen del carrito
function updateCartSummary() {
    const summaryContainer = document.getElementById('cart-summary');
    const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
    const selectedAddons = JSON.parse(localStorage.getItem('selectedAddons')) || [];

    let total = 0;
    let summaryHTML = '';

    if (selectedPlan) {
        total += selectedPlan.price;
        summaryHTML += `<p><strong>Plan seleccionado:</strong> ${selectedPlan.name} - $${selectedPlan.price} <button onclick="removeSelectedPlan()">X</button></p>`;
    } else {
        summaryHTML += `<p class="empty-cart">No has seleccionado ningún plan.</p>`;
    }

    if (selectedAddons.length > 0) {
        summaryHTML += `<p><strong>Adicionales seleccionados:</strong></p><ul>`;
        selectedAddons.forEach(addon => {
            total += addon.price;
            summaryHTML += `<li>${addon.name} - $${addon.price}</li>`;
        });
        summaryHTML += `</ul>`;
    } else {
        summaryHTML += `<p class="empty-cart">No has seleccionado ningún addon.</p>`;
    }

    summaryHTML += `<p><strong>Total:</strong> $${total}</p>`;
    summaryContainer.innerHTML = summaryHTML;
}

// mostrar el resumen en el checkout
function showSummary() {
    const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
    const selectedAddons = JSON.parse(localStorage.getItem('selectedAddons')) || [];
    let total = selectedPlan ? selectedPlan.price : 0;
    const summary = document.getElementById('summary');

    if (selectedPlan) {
        summary.innerHTML = `<p><strong>Plan:</strong> ${selectedPlan.name} - $${selectedPlan.price}</p>`;
    } else {
        summary.innerHTML = `<p>No has seleccionado ningún plan.</p>`;
    }

    if (selectedAddons.length > 0) {
        summary.innerHTML += `<p><strong>Adicionales:</strong></p><ul>`;
        selectedAddons.forEach(addon => {
            total += addon.price;
            summary.innerHTML += `<li>${addon.name} - $${addon.price}</li>`;
        });
        summary.innerHTML += `</ul>`;
    } else {
        summary.innerHTML += `<p>No has seleccionado ningún addon.</p>`;
    }

    summary.innerHTML += `<p><strong>Total: $${total}</strong></p>`;
}

// mostrar los detalles de la compra en la página de éxito
function showPurchaseDetails() {
    const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
    const selectedAddons = JSON.parse(localStorage.getItem('selectedAddons')) || [];
    let total = selectedPlan ? selectedPlan.price : 0;
    const details = document.getElementById('purchase-details');

    if (selectedPlan) {
        details.innerHTML = `<p><strong>Plan:</strong> ${selectedPlan.name}</p>`;
    }

    if (selectedAddons.length > 0) {
        details.innerHTML += `<p><strong>Adicionales</strong>:</p><ul>`;
        selectedAddons.forEach(addon => {
            total += addon.price;
            details.innerHTML += `<li>${addon.name}</li>`;
        });
        details.innerHTML += `</ul>`;
    }

    details.innerHTML += `<p><strong>Total: $${total}</strong></p>`;
}


// inicializacion
window.onload = function() {
    if (document.getElementById('plans-container')) {
        loadPlans();
        loadAddons();
        updateCartSummary();

        // deshabilitar los addons inicialmente si no hay plan seleccionado
        if (!selectedPlan) {
            enableAddons(false);
        }

        document.getElementById('continue-btn').onclick = () => {
            window.location.href = 'pages/checkout.html';
        };
    }

    if (document.getElementById('checkout-form')) {
        showSummary();
        document.getElementById('checkout-form').onsubmit = (e) => {
            e.preventDefault();
            window.location.href = 'success.html';
        };
    }

    if (document.getElementById('purchase-details')) {
        showPurchaseDetails();
    }
};

//borrar carrito al volver
document.getElementById('back-to-store-btn').onclick = function() {
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedAddons');
    window.location.href = 'index.html';
};
