const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')

router.get('/', (req, res) => {
  res.render('pages/contato', { erros: [] })
})

router.post('/enviar',
  body('nome').notEmpty().withMessage('Digite o nome'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('telefone').notEmpty().withMessage('Digite o telefone'),
  body('assunto').notEmpty().withMessage('Digite o assunto'),
  body('mensagem').notEmpty().withMessage('Digite a mensagem'),
  (req, res) => {

    
    const erros = validationResult(req)
    if (!erros.isEmpty()) {
      return res.render('pages/contato', { erros: erros.array() })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA
      }
    })

    const dados = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: req.body.assunto,
      text: 'Nome: ' + req.body.nome +
            '\nEmail: ' + req.body.email +
            '\nTelefone: ' + req.body.telefone +
            '\nMensagem: ' + req.body.mensagem
    }

    transporter.sendMail(dados, (erro, info) => {
      if (erro) {
        console.log(erro)
        res.send('Erro ao enviar')
      } else {
        res.send('E-mail enviado!')
      }
    })
  }
)

module.exports = router