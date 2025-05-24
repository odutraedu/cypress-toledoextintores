describe("Teste API", () => {
  const api = "http://localhost:3000/extintor";
  const token = "UNICORNIOcolorido123";

  let extintorId;

  it("Listar - deve retornar lista de extintores com status 200", () => {
    cy.request({
      method: "GET",
      url: api,
      headers: {
        "x-api-token": token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("Criar - deve criar um novo extintor", () => {
    cy.request({
      method: "POST",
      url: api,
      headers: {
        "x-api-token": token,
      },
      body: {
        nome: "Extintor de Incêndio",
        tipo: "CO2",
        validade: "2025-12-31",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("nome", "Extintor de Incêndio");
      expect(response.body).to.have.property("tipo", "CO2");
      expect(response.body).to.have.property("validade", "2025-12-31");
      extintorId = response.body.id;
    });
  });

  it("Atualizar - deve atualizar um extintor existente", () => {
    cy.request({
      method: "PATCH",
      url: `${api}/${extintorId}`,
      headers: {
        "x-api-token": token,
      },
      body: {
        nome: "Extintor de Incêndio Atualizado",
        tipo: "CO2",
        validade: "2025-12-31",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property(
        "nome",
        "Extintor de Incêndio Atualizado"
      );
    });
  });

  it("Listar/id - deve retornar o extintor criado", () => {
    cy.request({
      method: "GET",
      url: `${api}/${extintorId}`,
      headers: {
        "x-api-token": token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", extintorId);
    });
  });

  it("Deletar - deve deletar o extintor criado", () => {
    cy.request({
      method: "DELETE",
      url: `${api}/${extintorId}`,
      headers: {
        "x-api-token": token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Listar com filtros - deve retornar status 200", () => {
    cy.request({
      method: "GET",
      url: api,
      headers: {
        "x-api-token": token,
      },
      qs: {
        id: 1,
        nome: "extintor",
        classe: "co2",
        preco: "120",
        validade: "2025-12-12",
        peso: 60,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

// Testes de cenários inválidos e erros
describe("Teste API - Cenários Inválidos e Erros", () => {
  const api = "http://localhost:3000/extintor";
  const token = "UNICORNIOcolorido123";

  it("GET /extintor/999999 - deve retornar 404 para extintor inexistente", () => {
    cy.request({
      method: "GET",
      url: `${api}/999999`,
      headers: { "x-api-token": token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.include("não encontrado");
    });
  });

  it("GET /extintor/abc - deve retornar 400 para ID inválido", () => {
    cy.request({
      method: "GET",
      url: `${api}/abc`,
      headers: { "x-api-token": token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it("POST /extintor - deve retornar 400 ao criar sem campos obrigatórios", () => {
    cy.request({
      method: "POST",
      url: api,
      headers: { "x-api-token": token },
      body: { tipo: "CO2" }, // faltando nome e validade
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("obrigatório");
    });
  });

  it("POST /extintor - deve retornar 400 ao criar com tipo de dado errado", () => {
    cy.request({
      method: "POST",
      url: api,
      headers: { "x-api-token": token },
      body: {
        nome: 123, // deveria ser string
        tipo: "CO2",
        validade: "2025-12-31",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("tipo inválido");
    });
  });

  it("PATCH /extintor/999999 - deve retornar 404 ao atualizar extintor inexistente", () => {
    cy.request({
      method: "PATCH",
      url: `${api}/999999`,
      headers: { "x-api-token": token },
      body: {
        nome: "Teste",
        tipo: "CO2",
        validade: "2025-12-31",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.include("não encontrado");
    });
  });

  it("DELETE /extintor/999999 - deve retornar 404 ao deletar extintor inexistente", () => {
    cy.request({
      method: "DELETE",
      url: `${api}/999999`,
      headers: { "x-api-token": token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.include("não encontrado");
    });
  });

  it("Validação de conteúdo - lista deve conter campos esperados", () => {
    cy.request({
      method: "GET",
      url: api,
      headers: { "x-api-token": token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
      if (res.body.length > 0) {
        const ext = res.body[0];
        expect(ext).to.have.all.keys("id", "nome", "tipo", "validade");
      }
    });
  });
});
