const produits = JSON.parse(localStorage.getItem("produits")) || [];
const ventes = JSON.parse(localStorage.getItem("ventes")) || [];

function afficherProduits() {
  const tbody = document.getElementById("produitBody");
  tbody.innerHTML = "";

  produits.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.nom}</td>
      <td>${p.quantite}</td>
      <td>${p.prix.toFixed(2)} FCFA</td>
      <td>
        <button onclick="modifierProduit(${index})">Modifier</button>
        <button onclick="supprimerProduit(${index})">Supprimer</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  const select = document.getElementById("produit-a-vendre");
  select.innerHTML = "";
  produits.forEach((p, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = p.nom;
    select.appendChild(option);
  });

  localStorage.setItem("produits", JSON.stringify(produits));
}

function afficherHistorique() {
  const tbody = document.getElementById("historiqueBody");
  tbody.innerHTML = "";
  ventes.forEach((v) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.date}</td>
      <td>${v.nom}</td>
      <td>${v.quantite}</td>
      <td>${v.total.toFixed(2)} FCFA</td>
    `;
    tbody.appendChild(tr);
  });

  localStorage.setItem("ventes", JSON.stringify(ventes));
}

document.getElementById("ajout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nom = document.getElementById("nom-produit").value.trim();
  const quantite = parseInt(document.getElementById("quantite-produit").value);
  const prix = parseFloat(document.getElementById("prix-produit").value);

  if (!nom || isNaN(quantite) || isNaN(prix) || quantite < 1 || prix < 0) {
    alert("Veuillez remplir tous les champs correctement avec des valeurs valides.");
    return;
  }

  produits.push({ nom, quantite, prix });
  afficherProduits();
  e.target.reset();
});

function supprimerProduit(index) {
  if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
    produits.splice(index, 1);
    afficherProduits();
  }
}

function modifierProduit(index) {
  const produit = produits[index];
  const nom = prompt("Modifier le nom :", produit.nom);
  if (nom === null) return; // annulation

  const quantiteStr = prompt("Modifier la quantité :", produit.quantite);
  if (quantiteStr === null) return;

  const prixStr = prompt("Modifier le prix (FCFA) :", produit.prix.toFixed(2));
  if (prixStr === null) return;

  const quantite = parseInt(quantiteStr);
  const prix = parseFloat(prixStr);

  if (!nom.trim() || isNaN(quantite) || quantite < 0 || isNaN(prix) || prix < 0) {
    alert("Valeurs invalides, modification annulée.");
    return;
  }

  produits[index] = { nom: nom.trim(), quantite, prix };
  afficherProduits();
}

document.getElementById("vente-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const index = parseInt(document.getElementById("produit-a-vendre").value);
  const quantiteVendue = parseInt(document.getElementById("quantite-vendue").value);

  if (isNaN(index) || isNaN(quantiteVendue) || quantiteVendue < 1) {
    alert("Veuillez sélectionner un produit et saisir une quantité valide.");
    return;
  }

  const produit = produits[index];

  if (quantiteVendue > produit.quantite) {
    alert("Quantité insuffisante en stock !");
    return;
  }

  produit.quantite -= quantiteVendue;

  const total = quantiteVendue * produit.prix;
  const date = new Date().toLocaleString("fr-FR");

  ventes.push({ date, nom: produit.nom, quantite: quantiteVendue, total });

  document.getElementById("details-facture").innerHTML = `
    <p><strong>Facture</strong> - ${date}</p>
    <p>Produit : <strong>${produit.nom}</strong></p>
    <p>Quantité vendue : <strong>${quantiteVendue}</strong></p>
    <p>Prix unitaire : <strong>${produit.prix.toFixed(2)} FCFA</strong></p>
    <hr>
    <p><strong>Total : ${total.toFixed(2)} FCFA</strong></p>
  `;

  // Affiche le bouton Imprimer facture
  const btnImprimer = document.getElementById("btn-imprimer");
  btnImprimer.style.display = "inline-block";
  btnImprimer.onclick = () => window.print();

  afficherProduits();
  afficherHistorique();
  e.target.reset();
});

document.getElementById("reset-stock").addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment réinitialiser tout le stock ?")) {
    produits.length = 0;
    afficherProduits();
    localStorage.removeItem("produits");
  }
});

// Initialisation
afficherProduits();
afficherHistorique();
