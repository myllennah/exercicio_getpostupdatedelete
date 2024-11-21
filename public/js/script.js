// autocompletar endereço usando api
document.getElementById("cep").addEventListener("blur", async () => {
  const cep = document.getElementById("cep").value;
  const resultadoDiv = document.getElementById("resultado");

  if (cep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        document.getElementById("logradouro").value = data.logradouro;
        document.getElementById("bairro").value = data.bairro;
        document.getElementById("cidade").value = data.localidade;
        document.getElementById("estado").value = data.uf;
      } else {
        resultadoDiv.innerHTML = `<p>CEP não encontrado.</p>`;
      }
    } catch (error) {
      resultadoDiv.innerHTML = `<p>Erro ao buscar o CEP</p>`;
      console.error("Erro:", error);
    }
  } else {
    resultadoDiv.innerHTML = `<p>Por favor, insira um CEP válido.</p>`;
  }
});
