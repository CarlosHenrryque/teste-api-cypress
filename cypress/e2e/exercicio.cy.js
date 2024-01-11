/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contracts.cy'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
           }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
           })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          ///let produto = `EBAC ${Math.floor(Math.random() * 100)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": 'José Bastos',
                    "email": 'jose3@qa.com',
                    "password": 'jose!ebac',
                    "administrador": 'false'
               },
               headers: { authorization: token }

          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
           })

     });
     
     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, "Fulano da Silva", "fulano@qa.com", "teste", "true")

            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
               })
    });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               ///cy.log(response.body.produtos[0]._id)
               let id = response.body.usuarios[1]._id
               cy.request({
                   method: 'PUT',
                   url: `usuarios/${id}`,
                   headers: { authorization: token },
                   body: {
                    "nome": 'Carlos Barros editado',
                    "email": 'editado4@qa.com',
                    "password": 'edit!ebac',
                    "administrador": 'true'
                   }
   
               }).then((response) => {
                   expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
   
           });
          
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `User EBAC ${Math.floor(Math.random() * 100)}`
          cy.cadastrarUsuario(token, usuario, "fulano2@qa.com", "teste", "true")
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                headers: { authorization: token } 
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })    

          })

     });

})