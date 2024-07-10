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
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch((error) => {
        console.log("Falha ao registrar o Service Worker:", error);
      });
  });
}

var util = {
  atualizarCodes: function () {
    $.ajax({
      url: "https://v6.exchangerate-api.com/v6/codes",
      method: "GET",
      headers: {
        Authorization: "Bearer bd99edd9beed235bf8f56b5f",
      },
      success: function (response) {
        if (response.result === "success") {
          util.preencherselect(response.supported_codes);
        } else {
          alert("Erro ao obter os dados para o Selecionavel");
        }
      },
      error: function () {
        alert("ERROR! verifique a chave da api");
      },
    });
  },
  preencherselect: function (codes) {
    codes.forEach((code) => {
      let op = new Option(code[1], code[0], false, false);
      $(".origin").append($("<option>").val(code[0]).text(code[1]));
      $(".destino").append(op);
    });
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
    $(".descricao").val(expense.description);
    $(".quantidade").val(expense.quantity);
    $(".valor").val(expense.amount);
    $(".origin").val(expense.currencyFrom);
    $(".destino").val(expense.currencyTo);

    editingIndex = index;
  },
  remove: function (index) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    alert("Gasto removido com sucesso!");
    util.exibirDispesas();
  },
  adicionar: async function () {
    const description = $(".descricao").val();
    const quantity = $(".quantidade").val();
    const amount = $(".valor").val();
    const currencyFrom = $(".origin").val();
    const currencyTo = $(".destino").val();

    if (
      description === "" ||
      quantity === "" ||
      amount === "" ||
      Number.isNaN(amount) ||
      Number.isNaN(quantity)
    ) {
      alert(
        "Por favor, preencha todos os campos ou verifique os dados e tente novamente."
      );
      return;
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/bd99edd9beed235bf8f56b5f/latest/${currencyFrom}`
    );
    const data = await response.json();
    const rate = data.conversion_rates[currencyTo];
    const convertedAmount = (quantity * amount * rate).toFixed(2);

    const expense = {
      description,
      quantity: parseFloat(quantity),
      amount: parseFloat(amount),
      currencyFrom,
      currencyTo,
      convertedAmount: parseFloat(convertedAmount),
    };

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (editingIndex === -1) {
      expenses.push(expense);
    } else {
      expenses[editingIndex] = expense;
      editingIndex = -1;
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));

    util.limparDadosForm();
    util.exibirDispesas();
  },
  limparDadosForm: function () {
    $(".descricao").val("");
    $(".quantidade").val("");
    $(".valor").val("");
    $(".origin").val("BRL").trigger("change");
    $(".destino").val("BRL").trigger("change");
  },
};
