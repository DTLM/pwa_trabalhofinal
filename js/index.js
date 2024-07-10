$(function () {
  $(".origin").select2({
    placeholder: "Selecione moeda de origem",
    allowClear: true,
  });
  $(".destino").select2({
    placeholder: "Selecione moeda de destino",
    allowClear: true,
  });
  util.atualizarCodes();
});
let editingIndex = -1;
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

var util = {
  atualizarCodes: function () {
    // $.ajax({
    //   url: "https://v6.exchangerate-api.com/v6/codes",
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer bd99edd9beed235bf8f56b5f",
    //   },
    //   success: function (response) {
    //     if (response.result === "success") {
    //       util.preencherselect(response.supported_codes);
    //     } else {
    //       alert("Erro ao obter os dados para o Selecionavel");
    //     }
    //   },
    //   error: function () {
    //     alert("ERROR! verifique a chave da api");
    //   },
    // });
    this.preencherselect([
      ["USD", "Usa"],
      ["BRL", "Brazil"],
      ["EUR", "euro"],
    ]);
  },
  preencherselect: function (codes) {
    let options = [];
    codes.forEach((code) => {
      let op = new Option(code[1], code[0], false, false);
      options.push(op);
    });
    $(".origin").append(options);
    $(".destino").append(options);
  },
  exibirDispesas: function () {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expenseList = document.getElementById("lista");
    expenseList.innerHTML = "";
    let totalOrigin = 0;
    let totalDestination = 0;

    expenses.forEach((expense, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");

      const textSpan = document.createElement("span");
      textSpan.textContent = `${expense.description} (Qtd. ${expense.quantity}): ${expense.amount} ${expense.currencyFrom} => ${expense.convertedAmount} ${expense.currencyTo}`;

      const editButton = document.createElement("button");
      editButton.classList.add("edit-button");
      editButton.onclick = () => {
        util.editar(index);
      };

      // Cria o ícone de lápis (editar) e adiciona ao botão
      const editIcon = document.createElement("i");
      editIcon.classList.add("fas", "fa-pencil-alt");

      editButton.appendChild(editIcon); // Adiciona o ícone ao botão

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-button");
      removeButton.onclick = () => {
        util.remove(index);
      };

      // Cria o ícone da lixeira e adiciona ao botão
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fas", "fa-trash");

      removeButton.appendChild(trashIcon); // Adiciona o ícone ao botão

      li.appendChild(textSpan);
      li.appendChild(editButton);
      li.appendChild(removeButton);
      expenseList.appendChild(li);

      totalOrigin += expense.amount * expense.quantity;
      totalDestination += expense.convertedAmount;
    });

    $("#total-origin").text(totalOrigin.toFixed(2));
    $("#total-destino").text(totalDestination.toFixed(2));
  },
  editar: function (index) {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expense = expenses[index];
    document.getElementById("expense-description").value = expense.description;
    document.getElementById("expense-quantity").value = expense.quantity;
    document.getElementById("expense-amount").value = expense.amount;
    document.getElementById("currency-from").value = expense.currencyFrom;
    document.getElementById("currency-to").value = expense.currencyTo;

    editingIndex = index;
  },
  remove: function (index) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    util.exibirDispesas();
  },
};
