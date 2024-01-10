/// <reference types="cypress" />
import contrato from '../contracts/produtos.contracts.cy'

describe('Teste da funcionalidade produtos', () => {
    let token

    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.body.produtos[0].nome).to.equal('EBAC 88')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })

    });

    it.only('Cadastrar produto', () => {
        let produto = `EBAC ${Math.floor(Math.random() * 100)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 43,
                "descricao": "EBAC",
                "quantidade": 97
            },
            headers: { authorization: token }

        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })

    });

    it('Deve validar mensagem de erro cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "Produto EBAC novo", 250, "Descricao do produto", 201)

            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });

    it('Deve editar produto já cadastrado', () => {
        cy.request('produtos').then(response => {
            ///cy.log(response.body.produtos[0]._id)
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": "Logitech MX Vertical 4",
                    "preco": 1003,
                    "descricao": "Mouse editado",
                    "quantidade": 1000
                }

            }).then((response) => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })

        });

    });

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100)}`
        cy.cadastrarProduto(token, produto, 250, "Descricao do produto", 201) 
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": produto,
                    "preco": 100,
                    "descricao": "Editado",
                    "quantidade": 100
                }

            }).then((response) => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })

        })

    });

    it.only('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100)}`
        cy.cadastrarProduto(token, produto, 250, "Descricao do produto", 201)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: { authorization: token } 
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })    

        })

    }); 

})