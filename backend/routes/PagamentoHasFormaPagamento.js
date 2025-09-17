const express = require('express');
const router = express.Router();
const PagamentoHasFormaPagamentoController = require('./../controllers/pagamentoHasFormaPagamentoController');

// CRUD de Avaliacaos

router.get('/abrirCrudPagamentoHasFormaPagamento', pagamentoHasFormaPagamentoController.abrirCrudPagamentoHasFormaPagamento);
// router.get('/', pagamentoHasFormaPagamentoController.listarPagamentoHasFormaPagamento);
//  router.post('/', pagamentoHasFormaPagamentoController.criarAvaliacao);
router.get('/:id', pagamentoHasFormaPagamentoController.obterPagamentoHasFormaPagamentoList);
//  router.put('/:id', pagamentoHasFormaPagamentoController.atualizarAvaliacao);
//  router.delete('/:id', pagamentoHasFormaPagamentoController.deletarAvaliacao);

module.exports = router;
